const { pool } = require('../database/dbConfig');

async function getAll(req, res) {
  try {
    //TODO: si se quita el atributo tipo_usuario, hacer join de restaurantes y datos_usuarios
    const response = await pool.query(
      `SELECT * 
      FROM datos_usuarios 
      WHERE tipo_usuario = 3`
    );
    res.json(response.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los restaurantes' });
  }
}

async function getTopByCity(req, res) {
  try {
    const ciudad = req.body.ciudad;
    const response = await pool.query(
      `SELECT r.id, du.img_icon, r.calificacion
      FROM restaurante r
      JOIN direccion_restaurante dr ON r.id = dr.id_restaurante
      JOIN direccion d ON dr.id_direccion = d.id
      JOIN datos_usuarios du ON du.id = r.id
      WHERE d.ciudad = '${[ciudad]}'
      ORDER BY r.calificacion DESC
      LIMIT 20`
    );
    res.json(response.rows);
  } catch (error) {
    //console.error('Error en la consulta', error.message);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los restaurantes' });
  }
}

module.exports = { getAll, getTopByCity };
