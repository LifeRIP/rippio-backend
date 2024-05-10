const { pool } = require('../database/dbConfig');

async function getByResID(req, res) {
  try {
    const id = req.params.id;
    const response = await pool.query(
      `SELECT * 
      FROM producto 
      WHERE id_restaurante = $1`,
      [id]
    );

    if (response.rows === 0) {
      return res
        .status(404)
        .json({ error: 'No se encontraron productos para el restaurante' });
    }

    res.json(response.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los productos' });
  }
}

async function getByResProd(req, res) {
  try {
    const id = req.params.id;
    const nombre = req.body.nombre;

    // REPLACE junto con los espacios entre comillas simples quita los espacio de la búsqueda
    // LOWER convierte en minusculas la busqueda y la info en la base de datos para que coincidan
    const response = await pool.query(
      `SELECT * 
      FROM producto 
      WHERE id_restaurante = $1 AND REPLACE(UNACCENT(LOWER(nombre)), ' ', '') 
      LIKE REPLACE(UNACCENT(LOWER($2)), ' ', '')`,
      [id, `%${nombre}%`]
    );

    if (response.rows.length === 0) {
      return res
        .status(404)
        .json({ error: 'No se encontraron productos para el restaurante' });
    }

    res.json(response.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los productos' });
  }
}

module.exports = { getByResID, getByResProd };
