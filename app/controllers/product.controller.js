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

module.exports = { getByResID };
