const { pool } = require('../database/dbConfig');
const bcrypt = require('bcrypt');

async function change_data(req, res) {
  try {
    // Obtener el id del usuario despues de pasar por el middleware de autenticacion
    const { id } = req.user;

    const { nombre, apellido, telefono } = req.body;

    // Validar que los campos no estén vacíos
    if (!nombre || !apellido || !telefono) {
      return res.status(400).json({ message: 'Faltan campos por llenar' });
    }

    // Validar que el telefono no esté vinculado a otra cuenta
    const telefonoExist = await pool.query(
      'SELECT * FROM datos_usuarios WHERE telefono = $1',
      [telefono]
    );

    if (telefonoExist.rows.length > 0) {
      return res
        .status(400)
        .json({ message: 'El numero de telefono ya está en uso' });
    }

    // Actualizar informacion en la base de datos

    await pool.query(
      'UPDATE datos_usuarios SET nombre = $1 , apellido = $2 , telefono = $3 WHERE id = $4',
      [nombre, apellido, telefono, id]
    );

    res.json({ message: 'Actualizacion de datos exitosa' });
  } catch (e) {
    res
      .status(500)
      .json({ message: 'Ha ocurrido un error al modificar los datos' });
  }
}

async function change_password(req, res) {
  try {
    // Obtener el id del usuario despues de pasar por el middleware de autenticacion
    const { id } = req.user;

    const { oldpassword, newpassword, password_confirmation } = req.body;

    // Validar que los campos no estén vacíos
    if (!oldpassword || !newpassword || !password_confirmation) {
      return res.status(400).json({ message: 'Faltan campos por llenar' });
    }

    // Validar que la contraseña antigua sea correcta
    const dbuser = await pool.query(
      'SELECT * FROM datos_usuarios WHERE id = $1',
      [id]
    );

    const PasswordValid = await bcrypt.compare(
      oldpassword,
      dbuser.rows[0].contraseña
    );

    if (!PasswordValid) {
      return res
        .status(400)
        .send({ message: 'La contraseña actual es incorrecta' });
    }

    // Validar que newpassword sea igual a password_confirmation

    if (newpassword !== password_confirmation) {
      return res.status(400).json({
        message: 'La contraseña nueva debe estar igual en los dos campos',
      });
    }

    // Validar que la contraseña no sea igual a la actual

    if (oldpassword === newpassword || oldpassword === password_confirmation) {
      return res.status(400).json({
        message: 'La contraseña no puede ser la misma contraseña actual',
      });
    }

    // Hashea la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newpassword, salt);

    // Actualizar contraseña en la base de datos

    await pool.query(
      'UPDATE datos_usuarios SET contraseña = $1 WHERE id = $2',
      [hashedNewPassword, id]
    );

    res.json({ message: 'Actualizacion de contraseña exitosa' });
  } catch (e) {
    res
      .status(500)
      .json({ message: 'Ha ocurrido un error al modificar la contraseña' });
  }
}

async function add_address(req, res) {
  try {
    // Obtener el id del usuario despues de pasar por el middleware de autenticacion
    const { id } = req.user;

    const {
      departamento,
      ciudad,
      barrio,
      tipo_via,
      numero_via,
      numero_uno,
      numero_dos,
      observaciones,
    } = req.body;

    // Validar que los campos no estén vacíos
    if (
      !departamento ||
      !ciudad ||
      !barrio ||
      !tipo_via ||
      !numero_via ||
      !numero_uno ||
      !numero_dos
    ) {
      return res.status(400).json({ message: 'Faltan campos por llenar' });
    }

    // Crear nueva direccion en la base de datos
    const newAddress = await pool.query(
      'INSERT INTO direccion(departamento, ciudad, barrio, tipo_via, numero_via, numero_uno, numero_dos, observaciones) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning *',
      [
        departamento,
        ciudad,
        barrio,
        tipo_via,
        numero_via,
        numero_uno,
        numero_dos,
        observaciones,
      ]
    );
    await pool.query(
      'INSERT INTO direccion_usuario(id_usuario, id_direccion) VALUES ($1, $2)',
      [id, newAddress.rows[0].id]
    );

    res.json({ message: 'Nueva direccion agregada exitosamente' });
  } catch (e) {
    res
      .status(500)
      .json({ message: 'Ha ocurrido un error al agregar la direccion' });
  }
}

module.exports = { change_data, change_password, add_address };
