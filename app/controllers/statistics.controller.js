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

// Mostrar el gasto promedio por día de la semana
async function getAverageSpending(req, res) {
  try {
    const response = await pool.query(
      `SELECT EXTRACT(DOW FROM fecha) as dia, AVG(costo_total) as gasto_promedio
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
      .json({ error: 'Ha ocurrido un error al obtener el gasto promedio' });
  }
}

/*
Descripción: Mostrar los productos más populares que los usuarios han pedido según el día
*/
async function getMostSoldProducts(req, res) {
  try {
    const { fecha } = req.query;

    //Convertir la fecha a formato 'YYYY-MM-DD 00:00:00' y 'YYYY-MM-DD 23:59:59'

    const fechaInicio = fecha + ' 00:00:00';
    const fechaFin = fecha + ' 23:59:59';

    const response = await pool.query(
      `SELECT p.nombre, dp.cantidad_prod
            FROM pedido pe
            JOIN detalle_pedido dp ON pe.id = dp.id_pedido
            JOIN producto p ON dp.id_producto = p.id
            WHERE pe.fecha BETWEEN $1 AND $2
            GROUP BY p.nombre, dp.cantidad_prod
            ORDER BY dp.cantidad_prod DESC
            LIMIT 20`,
      [fechaInicio, fechaFin]
    );
    res.json(response.rows);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los productos' });
  }
}

module.exports = {
  getMostPopularRestaurants,
  getMostRequestedDays,
  getAverageSpending,
  getMostSoldProducts,
};