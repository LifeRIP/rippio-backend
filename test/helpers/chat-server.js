// Disposable full-stack fixture: no .env files or external database are loaded.
process.env.ALLOWED_ORIGINS = 'http://127.0.0.1:5175,http://localhost:5175';
const { readFileSync } = require('node:fs');
const express = require('express');
const jwt = require('jsonwebtoken');
const { PGlite } = require('@electric-sql/pglite');
const { createChatService } = require('../../app/services/chat.service');
const { createApp } = require('../../app/server');

async function main() {
  const pg = new PGlite();
  await pg.exec(readFileSync(require.resolve('../fixtures/chat-schema.sql'), 'utf8'));
  const customer = '00000000-0000-4000-8000-000000000001';
  const restaurant = '00000000-0000-4000-8000-000000000003';
  const secret = 'full-stack-fixture-only';
  await pg.query('INSERT INTO datos_usuarios(id,tipo_usuario,img_icon) VALUES ($1,1,$3),($2,3,$3)', [customer, restaurant, '/media/illustrations/user.svg']);
  await pg.query("INSERT INTO pedido(id,id_usuario,id_restaurante,estado) VALUES (1,$1,$2,'Pendiente')", [customer, restaurant]);
  let queue = Promise.resolve();
  async function acquire() {
    const previous = queue;
    let release;
    queue = new Promise(resolve => { release = resolve; });
    await previous;
    return { query: (sql, params) => pg.query(sql, params), release };
  }
  const db = {
    connect: acquire,
    async query(sql, params) {
      const client = await acquire();
      try { return await client.query(sql, params); }
      finally { client.release(); }
    },
  };
  const service = createChatService(db, value => {
    try { return jwt.verify(value, secret); } catch { return null; }
  });
  const routes = express.Router();
  routes.get('/__test__/session', (req, res) => res.json({
    customer, restaurant,
    customerToken: jwt.sign({ userID: customer }, secret, { expiresIn: '1h' }),
    restaurantToken: jwt.sign({ userID: restaurant }, secret, { expiresIn: '1h' }),
  }));
  const { server, chat } = createApp({ routes, chatService: service });
  await new Promise(resolve => server.listen(4010, '127.0.0.1', resolve));
  console.log('Disposable chat fixture listening on 127.0.0.1:4010');
  const close = async () => {
    await chat.dispose();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    await pg.close();
    process.exit(0);
  };
  process.on('SIGINT', close);
  process.on('SIGTERM', close);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
