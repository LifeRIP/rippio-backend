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
    const nombre = req.body.nombre;
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

async function AggProd(req, res) { // Agregar un menú a un restaurante en la base de datos
  try {

      const { id } = req.user;
      
      //obtiene el tipo de usuario
      const tipo_usuario = await pool.query('SELECT tipo_usuario FROM datos_usuarios WHERE id = $1', [id]);
      const valtipo_usuario = tipo_usuario.rows[0].tipo_usuario;

      //comprueba si el usuario es un admin
      
      if (valtipo_usuario === 2) {
          //si es admin, verifica si el restaurante existe
          const { id_restaurante } = req.body;

              let restaurante;
              let response;
          if (!id_restaurante) {
              return res.status(400).json({ error: 'Debes proporcionar el id del restaurante' });
              
          } else {
                  restaurante = await pool.query(
                  'SELECT * FROM producto WHERE id_restaurante = $1',
                  [id_restaurante]
              );
          }

          if (restaurante.rowCount === 0) {
              return res.status(400).json({ error: 'El restaurante no existe' });
              
          } else {
              const {id_restaurante, estado, nombre, descripcion, cost_unit, img_product} = req.body;
              response = await pool.query(
              `INSERT INTO producto ( id_restaurante, estado, nombre, descripcion, cost_unit, img_product)
              VALUES ($1, $2, $3, $4, $5 ,$6) RETURNING *`,
               [id_restaurante, estado, nombre, descripcion, cost_unit,img_product]
              );
          }
          
          res.json({ message: 'Menu agregado correctamente', response:response.rows[0] });
      } else if (valtipo_usuario === 3) {
          //si es usuario no es admin, verifica si es el propio restaurante
              const { estado, nombre, descripcion, cost_unit, img_product} = req.body;
              const response = await pool.query(
              `INSERT INTO producto (id_restaurante, estado, nombre, descripcion, cost_unit, img_product)
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
              [id , estado, nombre, descripcion, cost_unit, img_product]
          );
          res.json({ message: 'Menu agregado correctamente', response: response.rows[0] });
      } else {
          res.status(403).json({ error: 'No tienes permiso para agregar un menú' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ha ocurrido un error al agregar el menu' });
  }
}

async function InhabProd(req, res) { // Inhabilitar y habilitar un producto a un restaurante en la base de datos
  
  const id_restaurante = req.user.id;
  
  const tipo_usuario = req.user.tipo_usuario;

  try {
      //comprueba si el usuario es un restaurante
      if (tipo_usuario === 3) {
          
          
          const { nombre } = req.body;
          const {estado} = req.body;

              let producto;
              let response;
              //console.log("rr");
          if (!id_restaurante) {
              return res.status(400).json({ error: 'No tiene permitido hacer esa función' });
              
          } else {
                  producto = await pool.query(
                  `SELECT * FROM producto WHERE id_restaurante = $1 AND nombre = $2`,
                  [id_restaurante, nombre]
              );
          }

          if (producto.rowCount === 0) {
              return res.status(400).json({ error: 'El producto no existe' });
              
          } else {
              
              response = await pool.query(
                  `UPDATE producto SET estado = $1 WHERE id_restaurante = $2 AND nombre = $3 RETURNING *`,
                  [estado, id_restaurante, nombre]
              );
          }
          if (estado === "false") {
              res.json({ message: 'Menú inhabilitado', response:response.rows[0] });
          } else {
              res.json({ message: 'Menú habilitado', response:response.rows[0] });
          }
          
      } else  {
          
          res.status(403).json({ error: 'No tienes permiso para agregar un menú' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ha ocurrido un error al inhabilitar el menú' });
  }
}

module.exports = { getByResID, getByResProd,AggProd,InhabProd };
