const { test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { createApp } = require('../../app/server');
const { sendEmail } = require('../../app/services/mail/mailService');
const { pool } = require('../../app/database/dbConfig');
const { register, login } = require('../../app/controllers/auth.controller');
const jwt = require('jsonwebtoken');

test('Express 5: startup, paths, queries, JSON, 404 and rejected async handlers', async (t) => {
  const routes = express.Router();
  routes.get('/echo/:id', (req, res) => res.json({ id: req.params.id, query: req.query }));
  routes.post('/echo', (req, res) => res.json(req.body));
  routes.get('/failure', async () => { throw new Error('test-only failure'); });
  const { app, server, chat } = createApp({ routes });
  app.set('env', 'production');
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await chat.dispose();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const home = await fetch(base);
  assert.equal(home.status, 200);
  assert.match(home.headers.get('content-type'), /html/);
  assert.deepEqual(await (await fetch(`${base}/healthCheck`)).json(), { status: 'OK' });
  const echo = await fetch(`${base}/api/echo/a%20b?ciudad=Tulu%C3%A1&limit=10`);
  assert.deepEqual(await echo.json(), { id: 'a b', query: { ciudad: 'Tuluá', limit: '10' } });
  const post = await fetch(`${base}/api/echo`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }),
  });
  assert.deepEqual(await post.json(), { ok: true });
  const invalid = await fetch(`${base}/api/echo`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{',
  });
  assert.equal(invalid.status, 400);
  const missing = await fetch(`${base}/missing/nested`);
  assert.equal(missing.status, 404);
  assert.deepEqual(await missing.json(), { error: 'URL_NOT_FOUND' });
  const failure = await fetch(`${base}/api/failure`);
  assert.equal(failure.status, 500);
  assert.doesNotMatch(await failure.text(), /test-only failure/);
});

test('bcrypt 6 reads historical $2a$ and $2b$ hashes and generates valid hashes', async () => {
  // Openwall test vector, also used by upstream bcrypt's compatibility suite.
  const legacy = '$2a$05$CCCCCCCCCCCCCCCCCCCCC.E5YPO9kmyuRGyh0XouQYb4YMJKvyOeW';
  for (const hash of [legacy, legacy.replace('$2a$', '$2b$')]) {
    assert.equal(await bcrypt.compare('U*U', hash), true);
    assert.equal(await bcrypt.compare('wrong', hash), false);
  }
  const hash = await bcrypt.hash('migration-test-password', 10);
  assert.equal(await bcrypt.compare('migration-test-password', hash), true);
  assert.equal(bcrypt.getRounds(hash), 10);
});

test('Nodemailer 10 renders recovery email through an in-memory transport', async (t) => {
  const createTransport = nodemailer.createTransport.bind(nodemailer);
  let transportOptions;
  t.mock.method(nodemailer, 'createTransport', options => {
    transportOptions = options;
    return createTransport({ streamTransport: true, buffer: true, newline: 'unix' });
  });
  const info = await sendEmail('customer@example.test', 'Recovery test', 'Test Customer', 'https://example.test/reset?token=test-only');
  assert.equal(transportOptions.port, 465);
  assert.equal(transportOptions.secure, true);
  assert.deepEqual(info.envelope.to, ['customer@example.test']);
  assert.match(info.message.toString(), /Recovery test/);
  assert.match(info.message.toString(), /example\.test/);
});

test('registration creates UUID v4 and login preserves bcrypt and JWT contracts', async (t) => {
  let savedUser;
  t.mock.method(pool, 'query', async (sql, params) => {
    if (sql.startsWith('INSERT INTO datos_usuarios')) {
      savedUser = { id: params[0], email: params[4], contraseña: params[6], tipo_usuario: params[7] };
    }
    return { rows: sql.includes('email ILIKE') && savedUser ? [savedUser] : [] };
  });
  const oldSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'runtime-migration-test-only';
  t.after(() => {
    if (oldSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = oldSecret;
  });
  const response = () => ({
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
    send(body) { this.body = body; return this; },
  });
  const body = { identificacion: '12345678', nombre: 'Test', apellido: 'Customer', email: 'customer@example.test', telefono: '3000000000', password: 'test-password', tipo_usuario: 1 };
  const registration = response();
  await register({ body }, registration);
  assert.equal(registration.statusCode, 201);
  assert.match(savedUser.id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(await bcrypt.compare(body.password, savedUser.contraseña), true);
  const session = response();
  await login({ body }, session);
  assert.equal(session.statusCode, 200);
  assert.equal(session.body.id, savedUser.id);
  assert.equal(jwt.verify(session.body.token, process.env.JWT_SECRET).userID, savedUser.id);
  const denied = response();
  await login({ body: { ...body, password: 'wrong-password' } }, denied);
  assert.equal(denied.statusCode, 401);
});
