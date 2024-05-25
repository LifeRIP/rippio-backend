const { pool } = require('../database/dbConfig');

async function add(req, res) {
  try {
    const { id } = req.user;
    const { nombre_seccion } = req.body;

    const seccion = await pool.query(
      `SELECT * FROM seccion WHERE nombre = $1 AND id_restaurante = $2`,
      [nombre_seccion, id]
    );

    if (seccion.rows.length > 0) return res.status(400).json({ error: 'Esta sección ya existe' });

    const response = await pool.query(
      `INSERT INTO seccion (id_restaurante, nombre)
            VALUES ($1, $2) RETURNING id`,
      [id, nombre_seccion]
    );
    res.json({ message: 'Sección agregada correctamente', id: response.rows[0].id });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al agregar la sección' });
  }
}

async function remove(req, res) {
  try {
    const { id_seccion } = req.body;
    await pool.query(`DELETE FROM seccion WHERE id = $1`, [
      id_seccion,
    ]);
    res.status(200).json({ message: 'Sección eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al eliminar la sección' });
  }
}

async function update(req, res) {
  try {

    const {id} = req.user;
    const { id_seccion, nombre_seccion } = req.body;

    const names = await pool.query(
      `SELECT * FROM seccion WHERE nombre = $1 AND id_restaurante = $2`,
      [nombre_seccion, id]
    );
    
    if (names.rows.length > 0) return res.status(400).json({ error: 'Esta sección ya existe' });

    const response = await pool.query(
      `UPDATE seccion SET nombre = $1 WHERE id = $2`,
      [nombre_seccion, id_seccion]
    );
    res.status(200).json({ message: 'Sección modificada correctamente' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al modificar la sección' });
  }
}

async function getByResId(req, res) {
  try {
    const { id } = req.user;
    const response = await pool.query(
      `SELECT nombre, id
            FROM seccion WHERE id_restaurante = $1`,
      [id]
    );
    res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener las secciones' });
  }
}

module.exports = { add, remove, update, getByResId };
