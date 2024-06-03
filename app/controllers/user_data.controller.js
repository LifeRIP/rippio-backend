const { pool } = require('../database/dbConfig');

async function getAll(req, res) {
  try {
    const response = await pool.query(
      `SELECT * 
      FROM datos_usuarios`
    );
    res.json(response.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los usuarios' });
  }
}

async function getAllByRol(req, res) {
  try {
    const tipo_usuario = req.params.tipo_usuario;
    const response = await pool.query(
      `SELECT * 
      FROM datos_usuarios 
      WHERE tipo_usuario = $1`,
      [tipo_usuario]
    );
    res.json(response.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los usuarios' });
  }
}

async function getById(req, res) {
  try {
    const id = req.params.id;

    // Obtener el tipo del usuario
    const tipo_usuario = await pool.query(
      `SELECT tipo_usuario
      FROM datos_usuarios
      WHERE id = $1`,
      [id]
    );

    // Si no encuentra el usuario
    if (tipo_usuario.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró el usuario' });
    }

    // Si el usuario es un cliente
    if (tipo_usuario.rows[0].tipo_usuario === 1) {
      const response = await pool.query(
        `SELECT id, identificacion, nombre, apellido, email, telefono, tipo_usuario, img_icon, estado, creditos 
        FROM datos_usuarios
        WHERE id = $1`,
        [id]
      );
      return res.json(response.rows);
    }

    // Si el usuario es un administrador
    if (tipo_usuario.rows[0].tipo_usuario === 2) {
      const response = await pool.query(
        `SELECT du.id, du.identificacion, du.nombre, du.apellido, du.email, du.telefono, du.tipo_usuario, du.img_icon, du.estado, du.creditos, 
        a.id_direccion
		    FROM datos_usuarios du
		    INNER JOIN administrador a ON du.id = a.id
        WHERE du.id = $1`,
        [id]
      );
      return res.json(response.rows);
    }

    // Si el usuario es un restaurante
if (tipo_usuario.rows[0].tipo_usuario === 3) {
      const response = await pool.query(
        `SELECT du.id, du.identificacion, du.nombre, du.apellido, du.email, du.telefono, du.tipo_usuario, du.img_icon, du.estado, du.creditos, 
        r.calificacion, r.img_banner,
        dir.departamento, dir.ciudad, dir.barrio, dir.tipo_via, dir.numero_via, dir.numero_uno, dir.numero_dos, dir.observaciones,
        cr.id_categoria    
        FROM datos_usuarios du
        LEFT JOIN restaurante r ON du.id = r.id
        LEFT JOIN direccion dir ON r.id_direccion = dir.id
        LEFT JOIN categoria_res cr ON cr.id_restaurante = r.id
        WHERE du.id = $1`,
        [id]
      );

      //como retorna dos tuplas donde lo unico que cambia es la categoria, se debe hacer un arreglo con las categorias

      let categorias = [];
      response.rows.forEach((element) => {
        categorias.push(element.id_categoria);
      });

      response.rows[0].id_categoria = categorias;
      res.json(response.rows);

      return;
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener el usuario' });
  }
}

module.exports = { getAll, getById, getAllByRol };
