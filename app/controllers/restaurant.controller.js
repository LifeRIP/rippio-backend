const { pool } = require('../database/dbConfig');

async function getTopByCity(req, res) {
  try {
    const ciudad = req.query.ciudad;
    const response = await pool.query(
      `SELECT r.id, du.img_icon, r.calificacion
      FROM restaurante r
      JOIN direccion d ON r.id_direccion = d.id
      JOIN datos_usuarios du ON du.id = r.id
      WHERE d.ciudad = '${[ciudad]}'
      ORDER BY r.calificacion DESC
      LIMIT 20`
    );
    res.json(response.rows);
  } catch (error) {
    //console.error('Error en la consulta', error.message);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los restaurantes' });
  }
}

async function getCatAndProdByResId(req, res) {
  try {
    const { id } = req.params;
    const response = await pool.query(
      `SELECT 
      p.nombre, p.disponible, p.descripcion, p.cost_unit, p.img_product,
      s.id as id_seccion, sp.id_producto,
      s.nombre as sect_nombre
      FROM seccion s
      LEFT JOIN seccion_prod sp ON s.id = sp.id_seccion
      LEFT JOIN producto p ON p.id = sp.id_producto
      WHERE s.id_restaurante=$1
      AND (p.estado IS NULL OR p.estado=true)`,
      [id]
    );
    const rows = response.rows;
    const sections = [];
    for (let row of rows) {
      const section = sections.find((s) => s.id === row.id_seccion);
      if (!section) {
        sections.push({
          id: row.id_seccion,
          nombre: row.sect_nombre,
          productos: row.id_producto
            ? [
                {
                  id: row.id_producto,
                  nombre: row.nombre,
                  descripcion: row.descripcion,
                  costo_unit: row.cost_unit,
                  img_product: row.img_product,
                  disponible: row.disponible,
                },
              ]
            : [],
        });
      } else {
        if (row.id_producto) {
          section.productos.push({
            id: row.id_producto,
            nombre: row.nombre,
            descripcion: row.descripcion,
            costo_unit: row.cost_unit,
            img_product: row.img_product,
            disponible: row.disponible,
          });
        }
      }
    }
    res.status(200).json(sections);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los productos' });
  }
}

async function getInfoById(req, res) {
  try {
    const id = req.params.id;

    const response = await pool.query(
      `SELECT 
      du.id,
      du.nombre,
      du.img_icon,
      du.estado,
      r.calificacion,
      r.img_banner,
      d.departamento,
      d.ciudad,
      d.barrio,
      d.tipo_via,
      d.numero_via,
      d.numero_uno,
      d.numero_dos,
      d.observaciones,
      h.dia_semana,
      h.hora_apertura,
      h.hora_cierre
      FROM datos_usuarios du
      left join restaurante r on r.id = du.id
      left join direccion d on d.id = r.id_direccion
      left join horario h on h.id_restaurante = r.id
      where du.id= $1`,
      [id]
    );

    const rows = response.rows;
    const restaurant = {
      id: rows[0].id,
      nombre: rows[0].nombre,
      img_icon: rows[0].img_icon,
      estado: rows[0].estado,
      calificacion: rows[0].calificacion,
      img_banner: rows[0].img_banner,
      direccion: `${rows[0].tipo_via} ${rows[0].numero_via} #${rows[0].numero_uno} ${rows[0].numero_dos} ${rows[0].barrio} ${rows[0].ciudad} ${rows[0].departamento}`,
      horario: [],
    };

    for (let row of rows) {
      restaurant.horario.push({
        day: row.dia_semana,
        open: row.hora_apertura,
        close: row.hora_cierre,
      });
    }
    const daysOfWeek = {
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
      Domingo: 7,
    };

    restaurant.horario.sort((a, b) => daysOfWeek[a.day] - daysOfWeek[b.day]);

    res.status(200).json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Ha ocurrido un error al obtener la información del restaurante',
    });
  }
}

async function getByCategory(req, res) {
  try {
    const { id_category } = req.params;
    const response = await pool.query(
      `SELECT Du.id, Du.nombre, Du.img_icon, Du.estado
      FROM categoria Cat 
      join categoria_res Catres on Cat.id = Catres.id_categoria 
      join datos_usuarios Du on Catres.id_restaurante = Du.id
      WHERE Cat.id = $1`,
      [id_category]
    );

    res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los productos' });
  }
}

async function PageRestaurant(req, res) {
  try {
    // Datos de filtrado
    const city = req.query.ciudad;
    const category = req.query.categoria;
    const rating = req.query.calificacion;

    //Validar ciudad requerida
    if (!city) {
      return res.status(400).json({ error: 'El campo ciudad es requerido' });
    }

    //Validar categoria requerida
    if (!category && !rating) {
      response = await pool.query(
        `SELECT r.img_banner, du.img_icon, du.nombre, r.calificacion
      FROM restaurante r JOIN direccion d ON r.id_direccion = d.id
	        JOIN datos_usuarios du ON r.id = du.id
	        JOIN categoria_res cr ON cr.id_restaurante = r.id 
	        JOIN categoria c ON c.id = cr.id_categoria
      WHERE d.ciudad = $1
      ORDER BY r.calificacion desc`,
        [city]
      );
    } else if (category && !rating) {
      response = await pool.query(
        `SELECT r.img_banner, du.img_icon, du.nombre, r.calificacion
        FROM restaurante r JOIN direccion d ON r.id_direccion = d.id
              JOIN datos_usuarios du ON r.id = du.id
              JOIN categoria_res cr ON cr.id_restaurante = r.id 
              JOIN categoria c ON c.id = cr.id_categoria
        WHERE d.ciudad = $1 AND c.nombre = $2
        ORDER BY r.calificacion desc`,
        [city, category]
      );
    } else if (!category && rating) {
      response = await pool.query(
        `SELECT r.img_banner, du.img_icon, du.nombre, r.calificacion
        FROM restaurante r JOIN direccion d ON r.id_direccion = d.id
              JOIN datos_usuarios du ON r.id = du.id
              JOIN categoria_res cr ON cr.id_restaurante = r.id 
              JOIN categoria c ON c.id = cr.id_categoria
        WHERE d.ciudad = $1 AND r.calificacion BETWEEN $2 AND $3
        ORDER BY r.calificacion desc`,
        [city, 0, rating]
      );
    } else {
      response = await pool.query(
        `SELECT r.img_banner, du.img_icon, du.nombre, r.calificacion
        FROM restaurante r JOIN direccion d ON r.id_direccion = d.id
              JOIN datos_usuarios du ON r.id = du.id
              JOIN categoria_res cr ON cr.id_restaurante = r.id 
              JOIN categoria c ON c.id = cr.id_categoria
        WHERE d.ciudad = $1 AND c.nombre = $2 AND r.calificacion BETWEEN $3 AND $4
        ORDER BY r.calificacion desc`,
        [city, category, 0, rating]
      );
    }
    res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los restaurantes' });
  }
}

module.exports = {
  getTopByCity,
  getCatAndProdByResId,
  getInfoById,
  getByCategory,
  PageRestaurant,
};
