const { pool } = require('../database/dbConfig');

async function getByResID(req, res) {
  try {
    const id = req.params.id;
    const response = await pool.query(
      `SELECT * 
      FROM producto 
      WHERE id_restaurante = $1`,
      [id]
    );

    if (response.rows === 0) {
      return res
        .status(404)
        .json({ error: 'No se encontraron productos para el restaurante' });
    }

    res.json(response.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los productos' });
  }
}

async function getByResProd(req, res) {
  try {
    const id = req.params.id;
    const nombre = req.query.nombre;
    // Seleccionar todos los productos de un restaurante por nombre

    const response = await pool.query(
      `SELECT p.id, p.nombre, p.descripcion, p.cost_unit, p.img_product, p.estado
      FROM producto p  JOIN restaurante r ON r.id = p.id_restaurante
      WHERE LOWER(REPLACE(p.nombre, ' ', '')) ILIKE LOWER(REPLACE($2, ' ', ''))
      AND r.id = $1`,

      // LOWER convierte en minusculas la busqueda y la info en la base de datos para que coincidan
      //REPLACE juntio con los espacios entre comillas simple quita los espacio de la búsqueda

      [id, `%${nombre}%`]
    );

    if (response.rows.length === 0) {
      return res
        .status(404)
        .json({ error: 'No se encontraron productos para el restaurante' });
    }

    res.json(response.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los productos' });
  }
}

async function add(req, res) {
  // Agregar un producto a un restaurante en la base de datos
  try {
    const { id } = req.user;

    let restaurante;
    let response;

    //obtiene el tipo de usuario

    const tipo_usuario = await pool.query(
      'SELECT tipo_usuario FROM datos_usuarios WHERE id = $1',
      [id]
    );

    const valtipo_usuario = tipo_usuario.rows[0].tipo_usuario;

    //comprueba si el usuario es un admin

    if (valtipo_usuario === 2) {
      const {
        id_restaurante,
        disponible,
        nombre,
        descripcion,
        cost_unit,
        img_product,
        secciones,
      } = req.body;

      // Validar que los campos no estén vacíos
      if (
        !id_restaurante ||
        !disponible ||
        !nombre ||
        !descripcion ||
        !cost_unit ||
        !img_product ||
        !secciones
      ) {
        return res.status(400).json({ error: 'Faltan campos por llenar' });
      }

      // Verificar si el restaurante existe
      restaurante = await pool.query(
        'SELECT * FROM producto WHERE id_restaurante = $1',
        [id_restaurante]
      );

      if (restaurante.rowCount === 0) {
        return res.status(400).json({ error: 'El restaurante no existe' });
      }

      // Agregar el producto
      response = await pool.query(
        `INSERT INTO producto ( id_restaurante, disponible, nombre, descripcion, cost_unit, img_product,estado)
            VALUES ($1, $2, $3, $4, $5 ,$6) RETURNING *`,
        [
          id_restaurante,
          disponible,
          nombre,
          descripcion,
          cost_unit,
          img_product,
          true,
        ]
      );

      // Recursion para agregar el producto a varias secciones

      for (let i = 0; i < secciones.length; i++) {
        
        //Agregar el producto a una seccion
        await pool.query(
          `INSERT INTO seccion_prod (id_producto, id_seccion)
            VALUES ($1, $2) RETURNING *`,
          [response.rows[0].id, secciones[i]]
        );
      }

      // Responder al cliente
      res.json({
        message: 'Menu agregado correctamente',
        response: response.rows[0],
      });
    } else if (valtipo_usuario === 3) {
      //si es usuario no es admin, verifica si es el propio restaurante

      const { 
        disponible,
        nombre,
        descripcion,
        cost_unit,
        img_product,
        secciones 
      } = req.body;

      
      // Validar que los campos no estén vacíos
      // Add missing variable declaration for 'response'

      if (
        !disponible ||
        !nombre ||
        !descripcion ||
        !cost_unit ||
        !img_product ||
        !secciones
      ) {
        return res.status(400).json({ error: 'Faltan campos por llenar' });
      }
      console.log(secciones)
      // Agregar el producto
      response = await pool.query(
        `INSERT INTO producto (id_restaurante, disponible, nombre, descripcion, cost_unit, img_product,estado)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [id, disponible, nombre, descripcion, cost_unit, img_product, true]
      );
      console.log("hola")
      // Recursion para agregar el producto a varias secciones
      for (let i = 0; i < secciones.length; i++) {

        //Agregar el producto a una seccion
        await pool.query(
          `INSERT INTO seccion_prod (id_producto, id_seccion)
            VALUES ($1, $2) RETURNING *`,
          [response.rows[0].id, secciones[i]]
        );
      }

      // Responder al cliente
      res.json({
        message: 'Menu agregado correctamente',
        response: response.rows[0],
      });
    } else {
      res.status(403).json({ error: 'No tienes permiso para agregar un menú' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ha ocurrido un error al agregar el menu' });
  }
}

async function updateState(req, res) {
  // Inhabilitar y habilitar un producto a un restaurante en la base de datos
  try {
    const { id } = req.user;

    let restaurante;
    let response;

    //obtiene el tipo de usuario

    const tipo_usuario = await pool.query(
      'SELECT tipo_usuario FROM datos_usuarios WHERE id = $1',
      [id]
    );

    const valtipo_usuario = tipo_usuario.rows[0].tipo_usuario;

    //comprueba si el usuario es un admin

    if (valtipo_usuario === 2) {
      const {
        id_restaurante,
        nombre_prod,
        disponible,
      } = req.body;

      // Validar que los campos no estén vacíos
      if (
        !id_restaurante ||
        !nombre_prod ||
        !disponible
      ) {
        return res.status(400).json({ error: 'Faltan campos por llenar' });
      }

      // Verificar si el producto existe

      restaurante = await pool.query(
        'SELECT * FROM producto WHERE id_restaurante = $1 AND nombre = $2',
        [id_restaurante, nombre_prod]
      );

      if (restaurante.rowCount === 0) {
        return res.status(400).json({ error: 'El producto no existe' });
      }

      // Inhabilitar o habilitar el producto
      response = await pool.query(
        `UPDATE producto SET disponible = $1 WHERE id_restaurante = $2 AND nombre = $3 RETURNING *`,
        [disponible, id_restaurante, nombre_prod]
      );

      if (disponible === 'false') {
        res.json({
          message: 'Producto inhabilitado',
          response: response.rows[0],
        });
      } else {
        res.json({
          message: 'Producto habilitado',
          response: response.rows[0],
        });
      }
    } else if (valtipo_usuario === 3) {
      const {
        nombre_prod,
        disponible 
      } = req.body;

      // Validar que los campos no estén vacíos
      if (
        !nombre_prod ||
        !disponible
      ) {
        return res.status(400).json({ error: 'Faltan campos por llenar' });
      }

      // Verificar si el producto existe

      restaurante = await pool.query(
        'SELECT * FROM producto WHERE id_restaurante = $1 AND nombre = $2',
        [id, nombre_prod]
      );

      if (restaurante.rowCount === 0) {
        return res.status(400).json({ error: 'El producto no existe' });
      }

      // Inhabilitar o habilitar el producto
      response = await pool.query(
        `UPDATE producto SET disponible = $1 WHERE id_restaurante = $2 AND nombre = $3 RETURNING *`,
        [disponible, id, nombre_prod]
      );

      if (estado === 'false') {
        res.json({
          message: 'Producto inhabilitado',
          response: response.rows[0],
        });
      } else {
        res.json({
          message: 'Producto habilitado',
          response: response.rows[0],
        });
      }
    } else {
      res
        .status(403)
        .json({ error: 'No tienes permiso habilitar/inhabilitar un producto' });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al inhabilitar el producto' });
  }
}

async function updateSeccionProd(req, res) {
  // Actualizar la seccion de un producto en la base de datos
  try {
    const { id } = req.user;

    let producto;
    let response;

    //obtiene el tipo de usuario

    const tipo_usuario = await pool.query(
      'SELECT tipo_usuario FROM datos_usuarios WHERE id = $1',
      [id]
    );

    const valtipo_usuario = tipo_usuario.rows[0].tipo_usuario;

    //comprueba si el usuario es un admin

    if (valtipo_usuario === 2) {
      const {
        id_restaurante,
        id_producto,
        secciones,
      } = req.body;

      // Validar que los campos no estén vacíos
      if (
        !id_restaurante ||
        !id_producto ||
        !secciones
      ) {
        return res.status(400).json({ error: 'Faltan campos por llenar' });
      }

      // Verificar si el producto existe

      producto = await pool.query(
        'SELECT * FROM producto WHERE id_restaurante = $1 AND id = $2',
        [id_restaurante, id_producto]
      );

      if (producto.rowCount === 0) {
        return res.status(400).json({ error: 'El producto no existe' });
      }

      // Eliminar las secciones anteriores
      await pool.query(
        `DELETE FROM seccion_prod WHERE id_producto = $1`,
        [producto.rows[0].id]
      );

      // Recursion para agregar el producto a varias secciones
      for (let i = 0; i < secciones.length; i++) {

        //Agregar el producto a una seccion
        await pool.query(
          `INSERT INTO seccion_prod (id_producto, id_seccion)
            VALUES ($1, $2) RETURNING *`,
          [producto.rows[0].id, secciones[i]]
        );
      }

      // Responder al cliente
      res.json({
        message: 'Seccion actualizada correctamente',
        response: response.rows[0],
      });
    } else if (valtipo_usuario === 3) {
      const {
        id_producto,
        secciones 
      } = req.body;

      // Validar que los campos no estén vacíos
      if (
        !id_producto ||
        !secciones
      ) {
        return res.status(400).json({ error: 'Faltan campos por llenar' });
      }

      // Verificar si el producto existe

      producto = await pool.query(
        'SELECT * FROM producto WHERE id_restaurante = $1 AND id = $2',
        [id, id_producto]
      );

      if (producto.rowCount === 0) {
        return res.status(400).json({ error: 'El producto no existe' });
      }

      // Eliminar las secciones anteriores

      await pool.query(
        `DELETE FROM seccion_prod WHERE id_producto = $1`,
        [producto.rows[0].id]
      );

      // Recursion para agregar el producto a varias secciones

      for (let i = 0; i < secciones.length; i++) {
          
          //Agregar el producto a una seccion
          await pool.query(
            `INSERT INTO seccion_prod (id_producto, id_seccion)
              VALUES ($1, $2) RETURNING *`,
            [producto.rows[0].id, secciones[i]]
          );
        }

      // Responder al cliente
      res.json({
        message: 'Seccion actualizada correctamente',
        response: response.rows[0],
      });
    }
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ha ocurrido un error al actualizar la seccion' });
  }
}

async function updateProd(req, res) {
  // Actualizar un producto en la base de datos
  try {
    const { id } = req.user;

    let producto;
    let response;

    //obtiene el tipo de usuario

    const tipo_usuario = await pool.query(
      'SELECT tipo_usuario FROM datos_usuarios WHERE id = $1',
      [id]
    );

    const valtipo_usuario = tipo_usuario.rows[0].tipo_usuario;

    //comprueba si el usuario es un admin

    if (valtipo_usuario === 2) {
      const {
        id_restaurante,
        id_producto,
        disponible,
        nombre,
        descripcion,
        cost_unit,
        img_product,
        secciones,
      } = req.body;

      // Validar que los campos no estén vacíos
      if (
        !id_restaurante ||
        !id_producto ||
        !disponible ||
        !nombre ||
        !descripcion ||
        !cost_unit ||
        !img_product ||
        !secciones
      ) {
        return res.status(400).json({ error: 'Faltan campos por llenar' });
      }

      // Verificar si el producto existe

      producto = await pool.query(
        'SELECT * FROM producto WHERE id_restaurante = $1 AND id = $2',
        [id_restaurante, id_producto]
      );

      if (producto.rowCount === 0) {
        return res.status(400).json({ error: 'El producto no existe' });
      }

      // Actualizar el producto
      response = await pool.query(
        `UPDATE producto SET disponible = $1, nombre = $2, descripcion = $3, cost_unit = $4, img_product = $5 WHERE id_restaurante = $6 AND id = $7 RETURNING *`,
        [disponible, nombre, descripcion, cost_unit, img_product, id_restaurante, id_producto]
      );

      // Eliminar las secciones anteriores
      await pool.query(
        `DELETE FROM seccion_prod WHERE id_producto = $1`,
        [producto.rows[0].id]
      );

      // Recursion para agregar el producto a varias secciones
      for (let i = 0; i < secciones.length; i++) {

        //Agregar el producto a una seccion
        await pool.query(
          `INSERT INTO seccion_prod (id_producto, id_seccion)
            VALUES ($1, $2) RETURNING *`,
          [producto.rows[0].id, secciones[i]]
        );
      }

      // Responder al cliente
      res.json({
        message: 'Producto actualizado correctamente',
        response: response.rows[0],
      });
    }
    
    else if (valtipo_usuario === 3) {
      const {
        id_producto,
        disponible,
        nombre,
        descripcion,
        cost_unit,
        img_product,
        secciones,
      } = req.body;

      // Validar que los campos no estén vacíos
      if (
        !id_producto ||
        !disponible ||
        !nombre ||
        !descripcion ||
        !cost_unit ||
        !img_product ||
        !secciones
      ) {
        return res.status(400).json({ error: 'Faltan campos por llenar' });
      }

      // Verificar si el producto existe
      console.log(secciones)
      producto = await pool.query(
        'SELECT * FROM producto WHERE id_restaurante = $1 AND id = $2',
        [id, id_producto]
      );

      if (producto.rowCount === 0) {
        return res.status(400).json({ error: 'El producto no existe' });
      }
      
      // Actualizar el producto
      response = await pool.query(
        `UPDATE producto SET disponible = $1, nombre = $2, descripcion = $3, cost_unit = $4, img_product = $5 WHERE id_restaurante = $6 AND id = $7 RETURNING *`,
        [disponible, nombre, descripcion, cost_unit, img_product, id, id_producto]
      );

      // Eliminar las secciones anteriores
      await pool.query(
        `DELETE FROM seccion_prod WHERE id_producto = $1`,
        [producto.rows[0].id]
      );

      // Recursion para agregar el producto a varias secciones
      for (let i = 0; i < secciones.length; i++) {

        //Agregar el producto a una seccion
        await pool.query(
          `INSERT INTO seccion_prod (id_producto, id_seccion)
            VALUES ($1, $2) RETURNING *`,
          [producto.rows[0].id, secciones[i]]
        );
      }

      // Responder al cliente
      res.json({
        message: 'Producto actualizado correctamente',
        response: response.rows[0],
      });
    }
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ha ocurrido un error al actualizar el producto' });
  }
}

module.exports = { getByResID, getByResProd, add, updateState, updateSeccionProd, updateProd};
