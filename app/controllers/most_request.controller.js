const { pool } = require('../database/dbConfig');

async function getMostRequested(req, res) {
  try {
    const { fecha } = req.query;

    //Convertir la fecha a formato 'YYYY-MM-DD 00:00:00' y 'YYYY-MM-DD 23:59:59'

    const fechaInicio = fecha + ' 00:00:00';
    const fechaFin = fecha + ' 23:59:59';

    //Obtener los productos más solicitados en un día específico

    const response = await pool.query(
      `WITH categories AS (
            SELECT 'Hamburguesas' AS category, '%hamburguesa%' AS keyword
            UNION ALL
            SELECT 'Pizzas', '%pizza%'
            UNION ALL
            SELECT 'Sushi', '%sushi%'
            UNION ALL
            SELECT 'Salchipapas', '%salchipapa%'
            UNION ALL
            SELECT 'Pastas', '%pasta%'
            UNION ALL
            SELECT 'Pastas', '%fideos%'
            UNION ALL
            SELECT 'Pastas', '%spaghetti%'
            UNION ALL
            SELECT 'Ensaladas', '%ensalada%'
            UNION ALL
            SELECT 'Ensaladas', '%verdura%'
            UNION ALL
            SELECT 'Asados', '%asado%'
            UNION ALL
            SELECT 'Comida China', '%china%'
            UNION ALL
            SELECT 'Comida China', '%arroz%'
            UNION ALL
            SELECT 'Postres', '%postre%'
            UNION ALL
            SELECT 'Postres', '%pastel%'
            UNION ALL
            SELECT 'Postres', '%malteada%'
            UNION ALL
            SELECT 'Postres', '%helado%'
            UNION ALL
            SELECT 'Postres', '%cono%'
            UNION ALL
            SELECT 'Postres', '%brownie%'
            UNION ALL
            SELECT 'Postres', '%McFlurry%'
            UNION ALL
            SELECT 'Bebidas', '%bebida%'
            UNION ALL
            SELECT 'Bebidas', '%gaseosa%'
            UNION ALL
            SELECT 'Bebidas', '%refresc%'
            UNION ALL
            SELECT 'Bebidas', '%botella%'
            UNION ALL
            SELECT 'Bebidas', '%jugo%'
            UNION ALL
            SELECT 'Bebidas', '%agua%'
            UNION ALL
            SELECT 'Bebidas', '%te%'
            UNION ALL
            SELECT 'Combos', '%combo%'
        )
        SELECT c.category
        FROM PEDIDO p JOIN DETALLE_PEDIDO dp ON p.id = dp.id_pedido
	        JOIN PRODUCTO prod ON dp.id_producto = prod.id
	        JOIN categories c ON (prod.nombre ILIKE c.keyword OR prod.descripcion ILIKE c.keyword)
        WHERE p.fecha BETWEEN $1 and $2 AND p.estado != 'Cancelado'
        GROUP BY c.category
        ORDER BY SUM(dp.cantidad_prod) DESC;`,
      [fechaInicio, fechaFin]
    );

    return res.status(200).json(response.rows);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { getMostRequested };
