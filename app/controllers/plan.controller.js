const { pool } = require('../database/dbConfig');

async function getAll(req, res) {
  try {
    const response = await pool.query(
      `SELECT * 
      FROM plan`
    );
    res.json(response.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los planes' });
  }
}

module.exports = { getAll };




