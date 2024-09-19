const { pool } = require('../database/dbConfig');

async function createchat_order(req, res) {
  try {
    const { id_pedido, id_restaurante, id_usuario } = req.body;
    const { id } = req.user;

    // Comprobar los datos
    if (!id_pedido || !id_restaurante || !id_usuario) {
      return res.status(400).json('Faltan datos');
    }

    // Comparar si el usuario es el mismo que el que hizo el pedido o es el restaurante
    if (id !== id_usuario && id !== id_restaurante) {
      return res.status(401).json('No tienes permisos para crear un chat');
    }

    // Verificar si ya existe una conversación de ser así devolver la conversación
    const response = await pool.query(
      `
            SELECT *
            FROM conversacion_pedido
            WHERE id_pedido = $1
            `,
      [id_pedido]
    );

    if (response.rows.length > 0) {
      return res.status(200).json(response.rows[0]);
    }

    // Validar si los usuarios existen
    const user = await pool.query(
      `
            SELECT *
            FROM datos_usuarios
            WHERE id = $1 and tipo_usuario = 1
            `,
      [id_usuario]
    );

    if (user.rows.length === 0) {
      return res
        .status(404)
        .json('El usuario no existe o no es un usuario normal');
    }

    const restaurant = await pool.query(
      `
            SELECT *
            FROM restaurante
            WHERE id = $1
            `,
      [id_restaurante]
    );

    if (restaurant.rows.length === 0) {
      return res.status(404).json('El restaurante no existe');
    }

    // Crear conversación
    const response2 = await pool.query(
      `
            INSERT INTO conversacion_pedido (id_pedido, id_restaurante, id_usuario)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
      [id_pedido, id_restaurante, id_usuario]
    );

    res.json(response2.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
}

async function getchat_order(req, res) {
  try {
    const { id_pedido } = req.query;
    const { id } = req.user;

    // Comprobar los datos
    if (!id_pedido) {
      return res.status(400).json('Faltan datos');
    }
    // Verificar si el usuario es el mismo que el que hizo el pedido o es el restaurante
    const authorized = await pool.query(
      `
            SELECT *
            FROM pedido
            WHERE id = $1 AND (id_usuario = $2 OR id_restaurante = $2)
            `,
      [id_pedido, id]
    );

    if (authorized.rows.length === 0) {
      return res.status(401).json('No tienes permisos para ver este chat');
    }

    const response = await pool.query(
      `
          SELECT m.id, m.id_conversacion, m.id_usuario, m.mensaje, m.fecha, d.img_icon, d.tipo_usuario
          FROM mensaje_pedido m
          JOIN datos_usuarios d on m.id_usuario = d.id
          WHERE id_conversacion = (SELECT id
					  FROM conversacion_pedido
						WHERE id_pedido = $1)
          ORDER BY m.fecha ASC
            `,
      [id_pedido]
    );

    return res.status(200).json(response.rows);
  } catch (err) {
    console.log(err);
  }
}

async function insertchat_order(req, res) {
  try {
    const { id_pedido, mensaje, fecha } = req.body;
    const { id } = req.user;

    // Comprobar los datos
    if (!id_pedido || !id || !mensaje || !fecha) {
      return res.status(400).json('Faltan datos');
    }

    // Verificar si el usuario es el mismo que el que hizo el pedido o es el restaurante
    const authorized = await pool.query(
      `
            SELECT *
            FROM pedido
            WHERE id = $1 AND (id_usuario = $2 OR id_restaurante = $2)
            `,
      [id_pedido, id]
    );

    if (authorized.rows.length === 0) {
      return res.status(401).json('No tienes permisos escribir en este chat');
    }

    // Insertar mensaje
    const response = await pool.query(
      `
        WITH mensaje_insertado  AS (
          INSERT INTO mensaje_pedido (id_conversacion, id_usuario, mensaje, fecha)
          VALUES (
          (SELECT id FROM conversacion_pedido WHERE id_pedido = $1),
          $2, $3, $4
          )
          RETURNING *
          )
        SELECT mi.*, du.tipo_usuario, du.img_icon
        FROM mensaje_insertado mi
        JOIN datos_usuarios du ON mi.id_usuario = du.id;
            `,
      [id_pedido, id, mensaje, fecha]
    );

    res.json(response.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
}

// 'pedido', 'general'

async function createchat_admin(req, res) {}

async function getchat_admin(req, res) {}

async function insertchat_admin(req, res) {}

module.exports = {
  createchat_order,
  getchat_order,
  insertchat_order,
  createchat_admin,
  getchat_admin,
  insertchat_admin,
};
