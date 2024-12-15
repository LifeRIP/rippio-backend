const { pool } = require('../database/dbConfig');

// Listar los restaurantes más populares según la cantidad de pedidos recibidos
// en un rango de tiempo específico (semanal, mensual o total).
async function getMostPopularRestaurants(req, res) {
  try {
    const { fecha } = req.query;

    //Convertir la fecha a formato 'YYYY-MM-DD 00:00:00' y 'YYYY-MM-DD 23:59:59'

    const fechaInicio = fecha + ' 00:00:00';
    const fechaFin = fecha + ' 23:59:59';

    const response = await pool.query(
      `SELECT du.id, du.nombre, COUNT(p.id) as pedidos
        FROM datos_usuarios du
        JOIN pedido p ON p.id_restaurante = du.id
        WHERE p.fecha BETWEEN $1 AND $2
        GROUP BY du.id, du.nombre
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

// Mostrar en qué días de la semana se realizan más pedidos
async function getMostRequestedDays(req, res) {
  try {
    const response = await pool.query(
      `SELECT EXTRACT(DOW FROM fecha) as dia, COUNT(id) as pedidos
            FROM pedido
            GROUP BY dia
            ORDER BY dia`
    );

    // Convertir el número del día de la semana a su nombre
    const dias = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    response.rows.forEach((row) => {
      row.dia = dias[parseInt(row.dia)];
    });

    res.json(response.rows);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los días de la semana' });
  }
}

module.exports = { getMostPopularRestaurants, getMostRequestedDays };
