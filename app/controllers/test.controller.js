const { pool } = require('../database/dbConfig');

async function masivedata(req, res) {
  //modificar con un for para crear varias secciones
  try {
    const { id } = req.user;
    const { nombre_seccion, nombre, descripcion, cost_unit, img_product } =
      req.body;

    for (let i = 0; i < 1000; i++) {
      const response = await pool.query(
        `INSERT INTO seccion (id_restaurante, nombre)
                        VALUES ($1, $2) RETURNING id`,
        [id, nombre_seccion]
      );

      // Recursion para agregar el producto a la seccion creada

      for (let i = 0; i < 1000; i++) {
        //Crear un producto y agregarlo a la seccion
        const response2 = await pool.query(
          `INSERT INTO producto ( id_restaurante, disponible, nombre, descripcion, cost_unit, img_product,estado)
                        VALUES ($1, $2, $3, $4, $5 ,$6 , $7) RETURNING *`,
          [id, true, nombre, descripcion, cost_unit, img_product, true]
        );

        //Agregar el producto a la seccion
        const response3 = await pool.query(
          `INSERT INTO seccion_prod (id_seccion, id_producto)
                        VALUES ($1, $2)`,
          [response.rows[0].id, response2.rows[0].id]
        );
      }
    }
    //response success
    res.json({ message: 'Succesfull' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ha ocurrido un error al agregar la sección' });
  }
}

module.exports = { masivedata };
