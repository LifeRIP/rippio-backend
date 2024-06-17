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
