const { pool } = require('../database/dbConfig');

async function search(req, res) {
  try {
    const request = req.query.request;
    const response = await pool.query(
    `SELECT
      r.id,
      du.nombre,
      r.calificacion,
      du.img_icon,
      json_agg(
          json_build_object(
              'id', p.id,
              'estado', p.estado,
              'nombre', p.nombre,
              'descripcion', p.descripcion,
              'img_product', p.img_product,
              'costo_unit', p.cost_unit
          )
      ) AS productos
      FROM producto p
      JOIN datos_usuarios du ON du.id = p.id_restaurante
      JOIN restaurante r ON r.id = du.id
      WHERE (p.nombre ILIKE $1 
          OR p.descripcion ILIKE $1 
          OR du.nombre ILIKE $1)
          AND p.disponible = true
          AND du.estado = true
      GROUP BY r.id, du.nombre, r.calificacion, du.img_icon;
    `, [`%${request}%`]);
    res.json(response.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los restaurantes' });
  }
}

module.exports = { search };
