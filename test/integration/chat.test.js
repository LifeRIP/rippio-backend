const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { createServer } = require('node:http');
const express = require('express');
const jwt = require('jsonwebtoken');
const { PGlite } = require('@electric-sql/pglite');
const { createClient } = require('graphql-ws');
const WebSocket = require('ws');
const { createChatService } = require('../../app/services/chat.service');
const { attachChat } = require('../../app/graphql/chat');

const customer = '00000000-0000-4000-8000-000000000001';
const restaurant = '00000000-0000-4000-8000-000000000003';
const stranger = '00000000-0000-4000-8000-000000000004';
const secret = 'chat-test-only-secret';
const token = (id) => jwt.sign({ userID: id }, secret, { expiresIn: '1h' });
const fields = 'id mensaje fecha tipo_usuario img_icon';
const query = `query($id: ID!, $token: String!) { getchat_order(id_pedido:$id, token:$token) { ${fields} } }`;
const mutation = `mutation($id: ID!, $token: String!, $text: String!) {
  insertchat_order(id_pedido:$id, token:$token, mensaje:$text, fecha:"2000-01-01") { ${fields} }
}`;
const subscription = `subscription($id: ID!, $token: String!) {
  listenOrderMessages(id_pedido:$id, token:$token) { ${fields} }
}`;

function deadline(promise) {
  let timeout;
  return Promise.race([
    promise,
    new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('Test timed out')), 5000); }),
  ]).finally(() => clearTimeout(timeout));
}

test('chat: PostgreSQL schema from current backup + real HTTP/WebSocket transports', async (t) => {
  const pg = new PGlite();
  // Schema-only fixture from the updated backup; no account or message data.
  await pg.exec(readFileSync(require.resolve('../fixtures/chat-schema.sql'), 'utf8'));
  await pg.query('INSERT INTO datos_usuarios(id,tipo_usuario,img_icon) VALUES ($1,1,$4),($2,3,$4),($3,1,$4)',
    [customer, restaurant, stranger, 'test.png']);
  await pg.query("INSERT INTO pedido(id,id_usuario,id_restaurante,estado) VALUES (1,$1,$2,'Pendiente'),(2,$1,$2,'Pendiente')", [customer, restaurant]);

  // PGlite has a single connection. Serialize pool clients for transaction isolation.
  let queue = Promise.resolve();
  async function acquire() {
    const previous = queue;
    let release;
    queue = new Promise((resolve) => { release = resolve; });
    await previous;
    return { query: (sql, params) => pg.query(sql, params), release };
  }
  const db = {
    connect: acquire,
    async query(sql, params) {
      const connection = await acquire();
      try { return await connection.query(sql, params); }
      finally { connection.release(); }
    },
  };
  const service = createChatService(db, (value) => {
    try { return jwt.verify(value, secret); } catch { return null; }
  });
  let ready;
  const app = express();
  const server = createServer(app);
  const chat = attachChat(app, server, {
    ...service,
    async subscribe(...args) {
      const iterator = await service.subscribe(...args);
      ready?.();
      return iterator;
    },
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/graphql`;
  const sockets = [];
  t.after(async () => {
    await Promise.all(sockets.map((socket) => socket.dispose()));
    await chat.dispose();
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await pg.close();
  });
  async function request(document, variables) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: document, variables }),
    });
    return response.json();
  }
  async function listen(authToken, id = '1') {
    const socket = createClient({ url: url.replace('http:', 'ws:'), webSocketImpl: WebSocket, retryAttempts: 0 });
    sockets.push(socket);
    const started = new Promise((resolve) => { ready = resolve; });
    const messages = [];
    let received;
    const failed = new Promise((_, reject) => {
      socket.subscribe({ query: subscription, variables: { id, token: authToken } }, {
        next(value) {
          if (value.errors?.length) { reject(value.errors); return; }
          messages.push(value);
          received?.(value);
        },
        error(error) { reject(error); },
        complete() {},
      });
    });
    await deadline(Promise.race([started, failed]));
    return {
      messages,
      next: () => deadline(new Promise((resolve) => { received = resolve; })),
      dispose: () => socket.dispose(),
    };
  }

  await t.test('rejects invalid, expired and unrelated users for queries, mutations and subscriptions', async () => {
    const expired = jwt.sign({ userID: customer }, secret, { expiresIn: -1 });
    for (const authToken of ['invalid', expired, token(stranger)]) {
      for (const document of [query, mutation]) {
        const result = await request(document, { id: '1', token: authToken, text: 'forbidden' });
        assert.ok(result.errors?.length);
      }
      await assert.rejects(listen(authToken), (error) =>
        Array.isArray(error) && ['401', '403'].includes(error[0]?.extensions?.code)
      );
    }
    await assert.rejects(service.createConversation(1, stranger), { status: 403 });
    assert.equal((await pg.query('SELECT count(*)::int AS count FROM mensaje_pedido')).rows[0].count, 0);
  });

  await t.test('empty history and bidirectional realtime messages persisted with server timestamps', async () => {
    assert.deepEqual((await request(query, { id: '1', token: token(customer) })).data.getchat_order, []);
    const clientStream = await listen(token(customer));
    const restaurantStream = await listen(token(restaurant));
    for (const [id, text, kind] of [[customer, 'Hola restaurante', 1], [restaurant, 'Hola cliente', 3]]) {
      const delivery = Promise.all([clientStream.next(), restaurantStream.next()]);
      const result = await request(mutation, { id: '1', token: token(id), text });
      assert.equal(result.errors, undefined);
      const message = result.data.insertchat_order;
      assert.equal(message.mensaje, text);
      assert.equal(message.tipo_usuario, kind);
      assert.ok(new Date(message.fecha).getUTCFullYear() > 2000);
      for (const notification of await delivery) {
        assert.deepEqual(notification.data.listenOrderMessages, message);
      }
    }
    const history = await request(query, { id: '1', token: token(restaurant) });
    assert.equal(history.data.getchat_order.length, 2);
    assert.equal(clientStream.messages.length, 2);
    assert.equal(restaurantStream.messages.length, 2);
    await clientStream.dispose();
    await restaurantStream.dispose();
  });

  await t.test('concurrent first sends and checkout creation reuse one conversation', async () => {
    await Promise.all([
      service.createConversation(2, customer),
      service.sendMessage(2, customer, 'primero'),
      service.sendMessage(2, restaurant, 'segundo'),
    ]);
    assert.equal((await pg.query('SELECT count(*)::int AS count FROM conversacion_pedido WHERE id_pedido=2')).rows[0].count, 1);
    assert.equal((await service.getMessages(2, customer)).length, 2);
  });

  await t.test('empty or invalid input fails; a later valid send still works', async () => {
    for (const text of ['', '   ']) {
      const result = await request(mutation, { id: '2', token: token(customer), text });
      assert.ok(result.errors?.length);
    }
    await assert.rejects(service.getMessages('1 OR 1=1', customer), { status: 400 });
    await assert.rejects(service.sendMessage(999, customer, 'missing'), { status: 403 });
    assert.equal((await service.sendMessage(2, customer, '  válido  ')).mensaje, 'válido');
  });

  await t.test('closed orders remain readable and reject new messages', async () => {
    for (const status of ['Cancelado', 'Entregado']) {
      await pg.query('UPDATE pedido SET estado=$1 WHERE id=1', [status]);
      await assert.rejects(service.sendMessage(1, customer, 'cerrado'), { status: 409 });
      assert.equal((await service.getMessages(1, restaurant)).length, 2);
    }
    await pg.query('UPDATE conversacion_pedido SET estado=false WHERE id_pedido=2');
    await assert.rejects(service.sendMessage(2, restaurant, 'cerrado'), { status: 409 });
  });

  await t.test('reconnection recovers messages sent offline through history', async () => {
    await pg.exec("UPDATE pedido SET estado='Pendiente' WHERE id=1");
    const stream = await listen(token(customer));
    await stream.dispose();
    await service.sendMessage(1, restaurant, 'mensaje durante desconexión');
    const history = await request(query, { id: '1', token: token(customer) });
    assert.equal(history.data.getchat_order.at(-1).mensaje, 'mensaje durante desconexión');
    const reconnected = await listen(token(customer));
    const next = reconnected.next();
    await service.sendMessage(1, restaurant, 'mensaje tras reconectar');
    assert.equal((await next).data.listenOrderMessages.mensaje, 'mensaje tras reconectar');
    await reconnected.dispose();
  });
});
