const { pool } = require('../database/dbConfig');
const { tokenVerify } = require('./tokenVerify');
const { EventEmitter, on } = require('node:events');

class ChatError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

// Local event bus: production with multiple instances needs a shared broker.
function createChatService(db = pool, verifyToken = tokenVerify) {
  const events = new EventEmitter();
  events.setMaxListeners(0);

  async function authenticate(token) {
    const claims = token && await verifyToken(token);
    if (!claims?.userID) throw new ChatError('La sesión no es válida.', 401);
    const { rows } = await db.query('SELECT id FROM datos_usuarios WHERE id = $1', [claims.userID]);
    if (!rows[0]) throw new ChatError('La sesión no es válida.', 401);
    return rows[0];
  }

  function orderId(value) {
    if (!/^\d+$/.test(String(value)) || !Number.isSafeInteger(Number(value)) || Number(value) < 1) {
      throw new ChatError('El pedido no es válido.');
    }
    return Number(value);
  }

  async function authorize(queryable, id, userId, lock = false) {
    const { rows } = await queryable.query(
      `SELECT id, id_usuario, id_restaurante, estado FROM pedido
       WHERE id = $1 AND (id_usuario = $2 OR id_restaurante = $2)${lock ? ' FOR UPDATE' : ''}`,
      [orderId(id), userId]
    );
    if (!rows[0]) throw new ChatError('No tienes permisos para acceder a este chat.', 403);
    return rows[0];
  }

  async function ensureConversation(connection, order) {
    // The caller holds the pedido row lock, serializing all chat creators.
    const existing = await connection.query(
      'SELECT * FROM conversacion_pedido WHERE id_pedido = $1 ORDER BY id LIMIT 1', [order.id]
    );
    if (existing.rows[0]) return existing.rows[0];
    const { rows } = await connection.query(
      `INSERT INTO conversacion_pedido (id_pedido, id_restaurante, id_usuario)
       VALUES ($1, $2, $3) RETURNING *`, [order.id, order.id_restaurante, order.id_usuario]
    );
    return rows[0];
  }

  async function transaction(work) {
    const connection = await db.connect();
    try {
      await connection.query('BEGIN');
      const result = await work(connection);
      await connection.query('COMMIT');
      return result;
    } catch (error) {
      await connection.query('ROLLBACK');
      throw error;
    } finally {
      connection.release();
    }
  }

  async function createConversation(id, userId) {
    return transaction(async (connection) => {
      const order = await authorize(connection, id, userId, true);
      return ensureConversation(connection, order);
    });
  }

  async function getMessages(id, userId) {
    await authorize(db, id, userId);
    const { rows } = await db.query(
      `SELECT m.id, m.id_conversacion, m.id_usuario, m.mensaje, m.fecha, d.img_icon, d.tipo_usuario
       FROM mensaje_pedido m
       JOIN conversacion_pedido c ON c.id = m.id_conversacion
       JOIN datos_usuarios d ON d.id = m.id_usuario
       WHERE c.id_pedido = $1 ORDER BY m.fecha ASC, m.id ASC`, [orderId(id)]
    );
    return rows;
  }

  async function sendMessage(id, userId, text) {
    const message = typeof text === 'string' ? text.trim() : '';
    if (!message) throw new ChatError('Escribe un mensaje.');
    const result = await transaction(async (connection) => {
      const order = await authorize(connection, id, userId, true);
      if (['Cancelado', 'Entregado'].includes(order.estado)) {
        throw new ChatError('La conversación ha finalizado.', 409);
      }
      const conversation = await ensureConversation(connection, order);
      if (conversation.estado === false) throw new ChatError('La conversación está cerrada.', 409);
      const { rows } = await connection.query(
        `WITH inserted AS (
           INSERT INTO mensaje_pedido (id_conversacion, id_usuario, mensaje, fecha)
           VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *
         ) SELECT m.*, d.img_icon, d.tipo_usuario FROM inserted m
           JOIN datos_usuarios d ON d.id = m.id_usuario`, [conversation.id, userId, message]
      );
      return rows[0];
    });
    events.emit(String(orderId(id)), result);
    return result;
  }

  async function subscribe(id, token) {
    const user = await authenticate(token);
    await authorize(db, id, user.id);
    const iterator = on(events, String(orderId(id)));
    return {
      async next() {
        const next = await iterator.next();
        if (next.done) return next;
        try {
          await authenticate(token);
          await authorize(db, id, user.id);
          return { value: { listenOrderMessages: next.value[0] }, done: false };
        } catch (error) {
          await iterator.return();
          throw error;
        }
      },
      async return() { await iterator.return(); return { done: true }; },
      [Symbol.asyncIterator]() { return this; },
    };
  }

  return { authenticate, createConversation, getMessages, sendMessage, subscribe };
}

module.exports = { ChatError, createChatService, chatService: createChatService() };
