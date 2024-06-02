const { pool } = require('../database/dbConfig');
const moment = require('moment');
moment.locale('es');

async function add_order(req, res) {
  try {

    const { id } = req.user;

    const {  
      id_payment_method,
      id_address,
      use_credits,
      shipping_cost,
    } = req.body;

    let total_cost ;
    let credits_result ;

    //Validar que los campos no estén vacíos
    if (
      !id_payment_method ||
      !id_address ||
      !use_credits ||
      !shipping_cost
    ) {
      return res.status(400).json({ error: 'Por favor complete todos los campos' });
    }

    // Validar que el campo use_credits sea booleano
    if (typeof use_credits !== 'boolean') {
      return res.status(400).json({ error: 'El campo use_credits debe ser booleano' });
    }

    // Validar que el campo shipping_cost sea un número positivo
    if (typeof shipping_cost !== 'number' || shipping_cost <= 0) {
      return res.status(400).json({ error: 'El campo shipping_cost debe ser un número positivo' });
    }

    // Verificar si el carrito del usuario no está vacío

    const cart = await pool.query(
      `SELECT * FROM carrito WHERE id_usuario = $1`,
      [id]
    );

    if (cart.rows.length === 0) {
      return res
        .status(400)
        .json({ error: 'No hay productos en el carrito' });
    }

    // Verificar si la dirección del usuario existe

    const address = await pool.query(
      `SELECT * FROM direccion_usuario WHERE id_direccion = $1 and id_usuario = $2`,
      [id_address, id]
    );

    if (address.rows.length === 0) {
      return res
        .status(400)
        .json({ error: 'La dirección no existe' });
    }

    // Verificar si el método de pago del usuario existe

    const payment_method = await pool.query(
      `SELECT * FROM detalles_metodo_pago WHERE id = $1 and id_usuario = $2`,
      [id_payment_method, id]
    );

    if (payment_method.rows.length === 0) {
      return res
        .status(400)
        .json({ error: 'El método de pago no existe' });
    }

    // Calcular costo total del pedido
    
    const total = await pool.query(
      `SELECT sum(cost_unit * cantidad_prod) as Costo_Total
      FROM carrito C join producto P on C.id_producto = P.id
      Where C.id_usuario = $1`,
      [id]
    );
    
    //Obtener cantidad de creditos del usuario
    
    if (use_credits) {
      const credits = await pool.query(
        `SELECT creditos FROM datos_usuarios WHERE id = $1`,
        [id]
      );

      if (credits.rows[0].creditos <= 0) {
        return res.status(400).json({ error: 'No puedes usar créditos' });
      }

      total_cost = total.rows[0].costo_total - credits.rows[0].creditos + shipping_cost;

      if (total_cost < 0) {

        total_cost = 0;
        credits_result = (total_cost * -1) + total_cost*0.1;	

      }else {
        credits_result = total_cost*0.1;
      }

    } else {

       total_cost = total.rows[0].costo_total + shipping_cost;

    }

    // Obtener fecha del pedido

    const date = moment().format('YYYY-MM-DD HH:mm:ss');

    //Obtener el id del restaurante

    const restaurant = await pool.query(
      `SELECT distinct P.id_restaurante
      FROM carrito C join producto P on C.id_producto = P.id
      Where C.id_usuario = $1`,
      [id]
    );

    const id_restaurant = restaurant.rows[0].id_restaurante

  
    // Crear el pedido
    const newOrder = await pool.query(
      `INSERT INTO pedido (id_usuario, id_restaurante,  id_direccion, id_detalles_metodo_pago, estado, fecha, costo_total) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [id, id_restaurant, id_address, id_payment_method, 'Preparando',  date, total_cost]
    );  
    
    // Crear el detalle del pedido
    for (let i = 0; i < cart.rows.length; i++) {
      const Product_Value = await pool.query(
        `SELECT cost_unit FROM producto WHERE id = $1`,
        [cart.rows[i].id_producto]);
        
       await pool.query(
        `INSERT INTO detalle_pedido (id_pedido, id_producto, costo_unit, cantidad_prod, observaciones) VALUES ($1, $2, $3, $4, $5)`,
        [newOrder.rows[0].id, cart.rows[i].id_producto, Product_Value.rows[0].cost_unit  ,cart.rows[i].cantidad_prod, cart.rows[i].observacion]
      );
    }

    // Eliminar el carrito
    await pool.query(
      `DELETE FROM carrito WHERE id_usuario = $1`,
      [id]
    );

    // Actualizar los creditos del usuario

    if (use_credits) {
      await pool.query(
        `UPDATE datos_usuarios SET creditos = $1 WHERE id = $2`,
        [credits_result, id]
      );
    }

    res.json({ message: 'Pedido creado correctamente' });

  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al crear el pedido' });
  }
}

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

module.exports = { add_order,getByUserID };
