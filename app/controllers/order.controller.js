const { pool } = require('../database/dbConfig');
const moment = require('moment');
moment.locale('es');

async function getByUserID(req, res) {
  try {
    const id = req.params.id;
    const response = await pool.query(
      `SELECT
      p.id,
      r.nombre,
      p.costo_total,
      p.estado,
      p.fecha,
      p.observaciones,
      json_agg(
          json_build_object(
              'nombre', prod.nombre,
              'costo_unit', dp.costo_unit
          )
      ) AS productos
      FROM pedido p
      JOIN datos_usuarios r ON p.id_restaurante = r.id
      JOIN detalle_pedido dp ON p.id = dp.id_pedido
      JOIN producto prod ON dp.id_producto = prod.id
      WHERE p.id_usuario = $1
      GROUP BY p.id, r.nombre, p.costo_total, p.estado, p.fecha, p.observaciones
      ORDER BY p.fecha DESC
      LIMIT 10`,
      [id]
    );

    if (response.rows === 0) {
      return res
        .status(404)
        .json({ error: 'No se encontraron pedidos para el usuario' });
    }

    response.rows.forEach((row) => {
      let fechaFormateada = moment(row.fecha).format('MMM D, YYYY h:mm A');
      row.fecha = fechaFormateada =
        fechaFormateada.charAt(0).toUpperCase() +
        fechaFormateada.slice(1).replace('.', '');
    });

    res.json(response.rows);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los pedidos' });
  }
}

module.exports = { getByUserID };
