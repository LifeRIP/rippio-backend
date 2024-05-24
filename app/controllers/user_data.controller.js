const { pool } = require('../database/dbConfig');

async function getAll(req, res) {
  try {
    const response = await pool.query(
      `SELECT * 
      FROM datos_usuarios`
    );
    res.json(response.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los usuarios' });
  }
}

async function getById(req, res) {
  try {
    const id = req.params.id;
    const response = await pool.query(
      `SELECT id, identificacion, nombre, apellido, email, telefono, tipo_usuario, img_icon, estado, creditos 
      FROM datos_usuarios
      WHERE id = $1`,
      [id]
    );

    // Si no se encuentra el usuario
    if (response.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró el usuario' });
    }

    res.json(response.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener el usuario' });
  }
}

module.exports = { getAll, getById };
