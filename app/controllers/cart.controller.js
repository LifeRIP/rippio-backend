const { pool } = require('../database/dbConfig');

async function add(req, res) {
  try {
    const id_usuario = req.user.id; // ID del usuario autenticado
    const { id_producto, cantidad_prod, observacion } = req.body;

    if (!id_producto || !cantidad_prod) {
      return res.status(400).json({ message: 'Faltan campos por llenar' });
    }

    // Verificar si el producto ya está en el carrito y actualizar cantidad
    const product = await pool.query(
      'SELECT * FROM carrito WHERE id_usuario = $1 AND id_producto = $2 AND observacion = $3',
      [id_usuario, id_producto, observacion]
    );

    if (product.rows.length > 0) {
      await pool.query(
        'UPDATE carrito SET cantidad_prod = $1 WHERE id_usuario = $2 AND id_producto = $3 AND observacion = $4',
        [cantidad_prod, id_usuario, id_producto, observacion]
      );
      return res.json({ message: 'Producto actualizado en el carrito' });
    }

    // Agregar producto al carrito si no existe
    await pool.query(
      'INSERT INTO carrito (id_usuario, id_producto, cantidad_prod, observacion) VALUES ($1, $2, $3, $4)',
      [id_usuario, id_producto, cantidad_prod, observacion]
    );
    res.json({ message: 'Producto agregado al carrito' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error al agregar producto al carrito' });
  }
}

async function get(req, res) {
  try {
    const id_usuario = req.user.id; // ID del usuario autenticado
    const cart = await pool.query(
      `SELECT c.*,
      p.*,
      du.nombre as nombre_restaurante
      FROM carrito c
      inner join producto p on c.id_producto = p.id
      inner join datos_usuarios du on du.id = p.id_restaurante
      WHERE id_usuario = $1`,
    [id_usuario]
    );

    // Verificar si el carrito tiene productos
    if (cart.rowCount === 0) {
      return res.status(200).json({ message: 'Carrito vacío' });
    }

    res.json(cart.rows);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error al obtener carrito' });
  }
}

async function removeByProdId(req, res) {
  try {
    const id_usuario = req.user.id; // ID del usuario autenticado
    const { id_producto, observacion, all } = req.body;

    if (!id_producto) {
      return res.status(400).json({ message: 'Faltan campos por llenar' });
    }

    if (all) {
      const result = await pool.query(
        'DELETE FROM carrito WHERE id_usuario = $1 AND id_producto = $2',
        [id_usuario, id_producto]
      );

      // Verificar si el producto existe en el carrito
      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ message: 'Producto no encontrado en el carrito' });
      }

      return res.json({ message: 'Producto eliminado del carrito' });
    }

    const result = await pool.query(
      'DELETE FROM carrito WHERE id_usuario = $1 AND id_producto = $2 AND observacion = $3',
      [id_usuario, id_producto, observacion]
    );

    // Verificar si el producto existe en el carrito
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: 'Producto no encontrado en el carrito' });
    }

    res.json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error al eliminar producto del carrito' });
  }
}

async function empty(req, res) {
  try {
    const id_usuario = req.user.id;
    const result = await pool.query(
      'DELETE FROM carrito WHERE id_usuario = $1',
      [id_usuario]
    );

    // Verificar si el carrito tiene productos
    if (result.rowCount === 0) {
      return res.status(200).json({ message: 'Carrito vacío' });
    }

    res.json({ message: 'Carrito vaciado' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error al eliminar carrito' });
  }
}

module.exports = { add, get, removeByProdId, empty };
