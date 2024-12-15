const { pool } = require('../database/dbConfig');

// Listar los restaurantes más populares según la cantidad de pedidos recibidos en un rango de tiempo específico (semanal, mensual o total).
async function getMostPopularRestaurants(req, res) {
  try {
    const { fecha } = req.query;

    //Convertir la fecha a formato 'YYYY-MM-DD 00:00:00' y 'YYYY-MM-DD 23:59:59'

    const fechaInicio = fecha + ' 00:00:00';
    const fechaFin = fecha + ' 23:59:59';

    const response = await pool.query(
      `SELECT du.id, du.nombre, r.calificacion, COUNT(p.id) as pedidos
        FROM restaurante r
        JOIN datos_usuarios du ON du.id = r.id
        JOIN pedido p ON p.id_restaurante = r.id
        WHERE p.fecha BETWEEN $1 AND $2
        GROUP BY r.id, du.nombre
        ORDER BY pedidos DESC
        LIMIT 20`,
      [fechaInicio, fechaFin]
    );
    res.json(response.rows);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los restaurantes' });
  }
}

module.exports = { getMostPopularRestaurants };
