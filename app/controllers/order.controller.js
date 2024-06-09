const { pool } = require('../database/dbConfig');

async function add_order(req, res) {
  try {

    const { id } = req.user;

    const {  
      id_payment_method,
      id_address,
      use_credits,
      shipping_cost,
      date
    } = req.body;

    let total_cost ;
    let credits_result ;

    //Validar que los campos no estén vacíos
    if (
      !id_payment_method ||
      !id_address ||
      !shipping_cost ||
      !date
    ) {
      return res.status(400).json({ error: 'Por favor complete todos los campos' });
    }

    // Validar que use_credits no sea undefined

    if (use_credits === undefined) {
      return res.status(400).json({ error: 'El campo use_credits es requerido' });
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
    
    const credits = await pool.query(
      `SELECT creditos FROM datos_usuarios WHERE id = $1`,
      [id]
    );

    if (use_credits) {
      
      if (credits.rows[0].creditos <= 0) {
        return res.status(400).json({ error: 'No puedes usar créditos' });
      }

      total_cost = Number(total.rows[0].costo_total) - Number(credits.rows[0].creditos) + Number(shipping_cost);

      if (total_cost < 0) {

        credits_result = Math.floor(total_cost * -1);
        total_cost = 0;
        	

      }else {
        credits_result = total_cost*0.1;
      }

    } else {

      total_cost = Number(total.rows[0].costo_total) + Number(shipping_cost);

      credits_result = Math.floor(total_cost * 0.1) + Number(credits.rows[0].creditos);

    }

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
      `INSERT INTO pedido (id_usuario, id_restaurante,  id_direccion, id_detalles_metodo_pago, estado, fecha, costo_total, costo_envio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [id, id_restaurant, id_address, id_payment_method, 'Preparando',  date, total_cost, shipping_cost]
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

    // Actualizar los creditos del usuario

    await pool.query(
      `UPDATE datos_usuarios SET creditos = $1 WHERE id = $2`,
      [credits_result, id]
    );

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

    const { id } = req.user;
    const response = await pool.query(
      `SELECT
      p.id,
      r.nombre,
      p.costo_total,
      p.estado,
      p.fecha,
      json_agg(
          json_build_object(
            'nombre', prod.nombre,
            'cantidad', dp.cantidad_prod,
            'Observaciones', dp.observaciones
          )
      ) AS productos
      FROM pedido p
      JOIN datos_usuarios r ON p.id_restaurante = r.id
      JOIN detalle_pedido dp ON p.id = dp.id_pedido
      JOIN producto prod ON dp.id_producto = prod.id
      WHERE p.id_usuario = $1
      GROUP BY p.id, r.nombre, p.costo_total, p.estado, p.fecha
      ORDER BY p.fecha DESC
      LIMIT 10`,
      [id]
    );

    if (response.rows === 0) {
      return res
        .status(404)
        .json({ error: 'No se encontraron pedidos para el usuario' });
    }

    res.json(response.rows);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los pedidos' });
  }
}

async function getDetail(req, res) {

  try {

    const {id_details_order} = req.query;
  
    //Validar que los campos no estén vacíos
    if (!id_details_order) {
      return res
        .status(400)
        .json({ error: 'Por favor complete todos los campos' });
    }

    // Obtener los detalles del pedido

    const response = await pool.query(

      `SELECT  dp.id_pedido, p.fecha,
      pr.nombre, pr.descripcion, pr.img_product, dp.costo_unit, dp.cantidad_prod, (dp.costo_unit * dp.cantidad_prod) as total_prod,
      d.departamento, d.ciudad, d.barrio, d.tipo_via, d.numero_via, d.numero_uno, d.numero_dos, d.observaciones,
      pago.numero
      FROM detalle_pedido dp
      JOIN pedido p ON p.id = dp.id_pedido
     JOIN producto pr ON pr.id = dp.id_producto
     JOIN detalles_metodo_pago pago ON p.id_detalles_metodo_pago = pago.id
      JOIN direccion d ON p.id_direccion = d.id
      WHERE dp.id_pedido = $1`,
      [id_details_order]
    );
    
    // Validar si el pedido no existe
    
    if (response.rows.length === 0) {
      return res
        .status(404)
        .json({ error: 'No se encontraron detalles para el pedido' });
    }

    res.json(response.rows);
  }
  catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los detalles del pedido' });
  } 
}

async function orderStatus(req, res) {
  try {

    const { id } = req.user;
    const { id_order, status } = req.body;

    // Validar que los campos no estén vacíos
    if (!id_order || !status) {
      return res
        .status(400)
        .json({ error: 'Por favor complete todos los campos' });
    }

    // Validar que el campo status sea un string
    if (typeof status !== 'string') {
      return res
        .status(400)
        .json({ error: 'El campo status debe ser un string' });
    }

    // Validar que el campo status tenga un valor válido
    if (status !== 'Pendiente' && status !== 'Preparando' && status !== 'En camino' && status !== 'Entregado' && status !== 'Cancelado') {
      return res
        .status(400)
        .json({ error: 'El campo status debe ser Pendiente, Preparando, En camino, Entregado o Entregado' });
    }

    // Verificar si el pedido pertenece al restaurante
    const order = await pool.query(
      `SELECT * FROM pedido WHERE id = $1 and id_restaurante = $2`,
      [id_order, id]
    );

    if (order.rows.length === 0) {
      return res
        .status(400)
        .json({ error: 'El pedido no existe o no pertenece al restaurante' });
    }

    // Actualizar el estado del pedido
    await pool.query(
      `UPDATE pedido SET estado = $1 WHERE id = $2`,
      [status, id_order]
    );

    res.json({ message: 'Estado del pedido actualizado correctamente' });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al actualizar el estado del pedido' });
  }
}

async function orderRestaurant(req, res) {
  try {

    const { id } = req.user;

    response = await pool.query(
      `SELECT dp.id_pedido,p.estado, p.fecha,
		          (Du.nombre || ' ' || Du.apellido) as cliente,
		          (d.tipo_via || ' ' || d.numero_via || ' #' || d.numero_uno || ' - ' || d.numero_dos || ' ' || d.barrio) as direccion,
		          p.costo_total,
      	      p.costo_envio,
		          (p.costo_total - costo_envio) as subtotal
      FROM detalle_pedido dp
 	      JOIN pedido p ON p.id = dp.id_pedido
	      JOIN datos_usuarios Du ON DU.id = p.id_usuario
	      JOIN direccion d ON d.id = p.id_direccion
      WHERE p.id_restaurante = $1`,
      [id]
    );

    if (response.rows.length === 0) {
      return res
        .status(404)
        .json({ error: 'No se encontraron pedidos para el restaurante' });
    }

    res.json(response.rows);
  }
    
  catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los pedidos' });
  }
}

async function getDatilsRestaurant(req, res) {
  try {

    const { id } = req.user;

    response = await pool.query(
      `SELECT dp.id_pedido,p.estado, p.fecha,
              (Du.nombre || ' ' || Du.apellido) as cliente,
              (d.tipo_via || ' ' || d.numero_via || ' #' || d.numero_uno || ' - ' || d.numero_dos || ' ' || d.barrio) as direccion,
              p.costo_total,
      	      p.costo_envio,
              (p.costo_total - costo_envio) as subtotal
      FROM detalle_pedido dp
 	      JOIN pedido p ON p.id = dp.id_pedido
        JOIN datos_usuarios Du ON DU.id = p.id_usuario
        JOIN direccion d ON d.id = p.id_direccion
      WHERE p.id_restaurante = $1`,
      [id]
    );

    if (response.rows.length === 0) {
      return res
        .status(404)
        .json({ error: 'No se encontraron pedidos para el restaurante' });
    }

    res.json(response.rows);
  }
    
  catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los pedidos' });
  }
}

module.exports = { add_order,getByUserID,getDetail,orderStatus,orderRestaurant };
