const { pool } = require('../database/dbConfig');

// Listar los restaurantes más populares según la cantidad de pedidos recibidos
// en un rango de tiempo específico (semanal, mensual o total).
async function getMostPopularRestaurants(req, res) {
  try {
    const { fecha } = req.query;

    // Convertir la fecha a formato 'YYYY-MM-DD 00:00:00' y 'YYYY-MM-DD 23:59:59'
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

    const result = response.rows.map((row) => ({
      xlabel: 'Restaurante',
      ylabel: 'Pedidos',
      xvalue: row.nombre,
      yvalue: row.pedidos,
    }));

    res.json(result);
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
    const result = response.rows.map((row) => ({
      xlabel: 'Día',
      ylabel: 'Pedidos',
      xvalue: dias[parseInt(row.dia)],
      yvalue: row.pedidos,
    }));

    res.json(result);
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
    const result = response.rows.map((row) => ({
      xlabel: 'Día',
      ylabel: 'Gasto Promedio',
      xvalue: dias[parseInt(row.dia)],
      yvalue: row.gasto_promedio,
    }));

    res.json(result);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener el gasto promedio' });
  }
}

// Mostrar los productos más populares que los usuarios han pedido según el día
async function getMostSoldProducts(req, res) {
  try {
    const { fecha } = req.query;

    // Convertir la fecha a formato 'YYYY-MM-DD 00:00:00' y 'YYYY-MM-DD 23:59:59'
    const fechaInicio = fecha + ' 00:00:00';
    const fechaFin = fecha + ' 23:59:59';

    const response = await pool.query(
      `SELECT p.nombre, SUM(dp.cantidad_prod) as cantidad
            FROM pedido pe
            JOIN detalle_pedido dp ON pe.id = dp.id_pedido
            JOIN producto p ON dp.id_producto = p.id
            WHERE pe.fecha BETWEEN $1 AND $2
            GROUP BY p.nombre
            ORDER BY cantidad DESC
            LIMIT 20`,
      [fechaInicio, fechaFin]
    );

    const result = response.rows.map((row) => ({
      xlabel: 'Producto',
      ylabel: 'Cantidad Vendida',
      xvalue: row.nombre,
      yvalue: row.cantidad,
    }));

    res.json(result);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los productos' });
  }
}

async function getMostRequested(req, res) {
  try {
    const { fecha } = req.query;

    //Convertir la fecha a formato 'YYYY-MM-DD 00:00:00' y 'YYYY-MM-DD 23:59:59'

    const fechaInicio = fecha + ' 00:00:00';
    const fechaFin = fecha + ' 23:59:59';

    //Obtener los productos más solicitados en un día específico
    const response = await pool.query(
      `WITH categories AS (
              SELECT 'Hamburguesa' AS category, '%hamburguesa%' AS keyword
              UNION ALL
              SELECT 'Pizza', '%pizza%'
              UNION ALL
              SELECT 'Sushi', '%sushi%'
              UNION ALL
              SELECT 'Salchipapa', '%salchipapa%'
              UNION ALL
              SELECT 'Pasta', '%pasta%'
              UNION ALL
              SELECT 'Pasta', '%fideos%'
              UNION ALL
              SELECT 'Pasta', '%spaghetti%'
              UNION ALL
              SELECT 'Ensalada', '%ensalada%'
              UNION ALL
              SELECT 'Ensalada', '%verdura%'
              UNION ALL
              SELECT 'Asado', '%asado%'
              UNION ALL
              SELECT 'Comida China', '%china%'
              UNION ALL
              SELECT 'Comida China', '%arroz%'
              UNION ALL
              SELECT 'Postre', '%postre%'
              UNION ALL
              SELECT 'Postre', '%pastel%'
              UNION ALL
              SELECT 'Postre', '%malteada%'
              UNION ALL
              SELECT 'Postre', '%helado%'
              UNION ALL
              SELECT 'Postre', '%cono%'
              UNION ALL
              SELECT 'Postre', '%brownie%'
              UNION ALL
              SELECT 'Postre', '%McFlurry%'
              UNION ALL
              SELECT 'Bebida', '%bebida%'
              UNION ALL
              SELECT 'Bebida', '%gaseosa%'
              UNION ALL
              SELECT 'Bebida', '%refresc%'
              UNION ALL
              SELECT 'Bebida', '%botella%'
              UNION ALL
              SELECT 'Bebida', '%jugo%'
              UNION ALL
              SELECT 'Bebida', '%agua%'
              UNION ALL
              SELECT 'Bebida', '%te%'
              UNION ALL
              SELECT 'Combo', '%combo%'
          )
          SELECT c.category, SUM(dp.cantidad_prod) AS cantidad
          FROM PEDIDO p JOIN DETALLE_PEDIDO dp ON p.id = dp.id_pedido
              JOIN PRODUCTO prod ON dp.id_producto = prod.id
              JOIN categories c ON (prod.nombre ILIKE c.keyword OR prod.descripcion ILIKE c.keyword)
          WHERE p.fecha BETWEEN $1 and $2 AND p.estado != 'Cancelado'
          GROUP BY c.category
          ORDER BY SUM(dp.cantidad_prod) DESC;`,
      [fechaInicio, fechaFin]
    );

    const result = response.rows.map((row) => ({
      xlabel: 'Categoría',
      ylabel: 'Cantidad Vendida',
      xvalue: row.category,
      yvalue: row.cantidad,
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'Ha ocurrido un error al obtener los productos más solicitados',
    });
  }
}

module.exports = {
  getMostPopularRestaurants,
  getMostRequestedDays,
  getAverageSpending,
  getMostSoldProducts,
  getMostRequested,
};
