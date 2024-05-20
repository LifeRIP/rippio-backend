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

module.exports = { getByResID, getByResProd };
