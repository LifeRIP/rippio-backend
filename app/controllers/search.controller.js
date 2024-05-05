const { pool } = require("../database/dbConfig");

async function search(req, res) {
  try {
    const request = req.body.request;
    const response = await pool.query(
      //TODO: para buscar solo los productos activos agregar en el WHERE -> AND p.estado = true
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
      WHERE p.nombre ILIKE '%' || '${request}' || '%' 
          OR p.descripcion ILIKE '%' || '${request}' || '%'
          OR du.nombre ILIKE '%' || '${request}' || '%'
      GROUP BY r.id, du.nombre, r.calificacion, du.img_icon;`
    );
    res.json(response.rows);
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error al obtener los restaurantes" });
  }
}

module.exports = { search };