const { pool } = require("../database/dbConfig");

async function getAllRestaurant(req, res) {
  try {
    //TODO: si se quita el atributo tipo_usuario, hacer join de restaurantes y datos_usuarios
    const restaurants = await pool.query("SELECT * FROM datos_usuarios WHERE tipo_usuario = 3");

    res.json(restaurants.rows);
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error al iniciar sesion" });
  }
}

module.exports = { getAllRestaurant };
