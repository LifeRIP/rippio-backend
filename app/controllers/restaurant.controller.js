const { pool } = require('../database/dbConfig');

async function getAll(req, res) {
  try {
    //TODO: si se quita el atributo tipo_usuario, hacer join de restaurantes y datos_usuarios
    const response = await pool.query(
      `SELECT * 
      FROM datos_usuarios 
      WHERE tipo_usuario = 3`
    );
    res.json(response.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener los restaurantes' });
  }
}

async function getTopByCity(req, res) {
  try {
    const ciudad = req.query.ciudad;
    const response = await pool.query(
      `SELECT r.id, du.img_icon, r.calificacion
      FROM restaurante r
      JOIN direccion_restaurante dr ON r.id = dr.id_restaurante
      JOIN direccion d ON dr.id_direccion = d.id
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

async function getRestaurantInfoById(req, res) {
  try {
    const id = req.params.id;
    const response = await pool.query(
      `SELECT r.id as resId, r.calificacion, r.img_banner,
      du.nombre resNom, du.img_icon,
      h.dia_semana, h.hora_apertura, h.hora_cierre,
      d.barrio, d.tipo_via, d.numero_via, d.numero_uno, d.numero_dos, d.observaciones 
      FROM restaurante r 
      inner join datos_usuarios du on r.id = du.id
      inner join direccion_restaurante dr on r.id = dr.id_restaurante
      inner join direccion d on dr.id_direccion = d.id
      inner join horario h on r.id = h.id_restaurante
      WHERE r.id = $1`, [id]
    );

    const rows = response.rows;
    const restaurant = {
      id: rows[0].resid,
      nombre: rows[0].resnom,
      img_banner: rows[0].img_banner,
      img_icon: rows[0].img_icon,
      direccion: `${rows[0].tipo_via} ${rows[0].numero_via} #${rows[0].numero_uno} ${rows[0].numero_dos} ${rows[0].barrio}`,
      calificacion: rows[0].calificacion,
      horario: []
    };

    for (let row of rows) {
      restaurant.horario.push({
        day: row.dia_semana,
        open: row.hora_apertura,
        close: row.hora_cierre
      });
    }

    res.json(restaurant);
  }
  catch (error) {
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al obtener el restaurante' });
  }
}
async function getAllProductsInSectionsByRestaurantId(req, res) {
  try {
    const { id } = req.params;
    const response = await pool.query(
      `SELECT 
          p.nombre, p.estado, p.descripcion, p.cost_unit, p.img_product,
          sp.id_seccion, sp.id_producto,
          s.nombre as sect_nombre
          From producto p
              inner join seccion_prod sp on p.id = sp.id_producto
              inner join seccion s on s.id = sp.id_seccion
          where s.id_restaurante=$1`,
      [id]
    );
    const rows = response.rows;
    const sections = [];
    for (let row of rows) {
      const section = sections.find(s => s.id === row.id_seccion);
      if (!section) {
        sections.push({
          id: row.id_seccion,
          nombre: row.sect_nombre,
          productos: [{
            id: row.id_producto,
            nombre: row.nombre,
            descripcion: row.descripcion,
            costo_unit: row.cost_unit,
            img_product: row.img_product,
            estado: row.estado
          }]
        });
      }
      else {
        section.productos.push({
          id: row.id_producto,
          nombre: row.nombre,
          descripcion: row.descripcion,
          costo_unit: row.cost_unit,
          img_product: row.img_product,
          estado: row.estado
        });
      }
    }
    res.status(200).json(sections);
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ha ocurrido un error al obtener los productos' });
  }
}

module.exports = { getAll, getTopByCity, getRestaurantInfoById, getAllProductsInSectionsByRestaurantId };
