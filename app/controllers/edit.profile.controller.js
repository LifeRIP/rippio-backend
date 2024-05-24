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

    // Validar que el telefono no esté vinculado a otra cuenta, excluyendo al usuario actual
    const telefonoExist = await pool.query(
      'SELECT * FROM datos_usuarios WHERE telefono = $1 AND id != $2',
      [telefono, id]
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
    console.error(e.message);
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

async function modify_address(req, res) {
  try {
    // Obtener el id del usuario despues de pasar por el middleware de autenticacion
    const { id } = req.user;

    const {
      id_direccion,
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
      !id_direccion ||
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

    //Validar que la direccion pertenezca al usuario
    const address = await pool.query(
      'SELECT * FROM direccion_usuario WHERE id_usuario = $1 AND id_direccion = $2',
      [id, id_direccion]
    );

    if (address.rows.length === 0) {
      return res
        .status(400)
        .json({ message: 'La direccion no pertenece al usuario' });
    }

    // Validar que la direccion exista
    const addressExist = await pool.query(
      'SELECT * FROM direccion WHERE id = $1',
      [id_direccion]
    );

    if (addressExist.rows.length === 0) {
      return res.status(400).json({ message: 'La direccion no existe' });
    }

    // Actualiza direccion en la base de datos
    await pool.query(
      'UPDATE direccion SET departamento=$1, ciudad=$2, barrio=$3, tipo_via=$4, numero_via=$5, numero_uno=$6, numero_dos=$7, observaciones=$8 WHERE id = $9',
      [
        departamento,
        ciudad,
        barrio,
        tipo_via,
        numero_via,
        numero_uno,
        numero_dos,
        observaciones,
        id_direccion,
      ]
    );
    res.json({ message: 'La direccion se modificó exitosamente' });
  } catch (e) {
    res
      .status(500)
      .json({ message: 'Ha ocurrido un error al modificar la direccion' });
  }
}

async function modify_profile_image(req, res) {
  try {
    // Obtener el id del usuario despues de pasar por el middleware de autenticacion
    const { id } = req.user;

    const { image } = req.body;

    // Validar que los campos no estén vacíos

    if (!image) {
      return res.status(400).json({ message: 'Faltan campos por llenar' });
    }

    // Actualiza imagen de perfil en la base de datos
    await pool.query('UPDATE datos_usuarios SET img_icon = $1 WHERE id = $2', [
      image,
      id,
    ]);
    res.json({ message: 'La imagen de perfil se modificó exitosamente' });
  } catch (e) {
    res.status(500).json({
      message: 'Ha ocurrido un error al modificar la imagen de perfil',
    });
  }
}

async function modify_banner_restaurant(req, res) {
  try {
    // Obtener el id del restaurante despues de pasar por el middleware de autenticacion
    const { id } = req.user;

    const { image } = req.body;

    // Validar que los campos no estén vacíos

    if (!image) {
      return res.status(400).json({ message: 'Faltan campos por llenar' });
    }

    // Actualiza imagen de banner en la base de datos
    await pool.query('UPDATE restaurante SET img_banner = $1 WHERE id = $2', [
      image,
      id,
    ]);
    res.json({ message: 'La imagen de banner se modificó exitosamente' });
  } catch (e) {
    res.status(500).json({
      message: 'Ha ocurrido un error al modificar la imagen de banner',
    });
  }
}

async function add_payment_method(req, res) {
  try {
    // Obtener el id del usuario despues de pasar por el middleware de autenticacion
    const { id } = req.user;

    const {
      tipo_tarjeta,
      nombre,
      apellido,
      numero_tarjeta,
      fecha_vencimiento,
      cvv,
    } = req.body;

    // Validar que los campos no estén vacíos
    if (
      !tipo_tarjeta ||
      !nombre ||
      !apellido ||
      !numero_tarjeta ||
      !fecha_vencimiento ||
      !cvv
    ) {
      return res.status(400).json({ message: 'Faltan campos por llenar' });
    }

    // Conseguir Id del tipo de tarjeta
    const Id_tipoTarjeta = await pool.query(
      'SELECT * FROM metodo_pago WHERE nombre = $1',
      [tipo_tarjeta]
    );

    // Validar que el tipo de tarjeta exista
    if (Id_tipoTarjeta.rows.length === 0) {
      return res.status(400).json({ message: 'El tipo de tarjeta no existe' });
    }

    // Validar que la fecha de vencimiento sea valida
    const date = new Date();
    const currentYear = date.getFullYear();
    const lastTwoDigits = currentYear.toString().slice(-2);
    const currentMonth = date.getMonth() + 1;
    const [expirationMonth, expirationYear] = fecha_vencimiento.split('/');
    if (
      expirationYear < lastTwoDigits ||
      (expirationYear == currentYear && expirationMonth < currentMonth)
    ) {
      return res.status(400).json({ message: 'La tarjeta ha expirado' });
    }

    // Validar que el cvv sea un numero de 3 digitos
    if (cvv.length !== 3 || isNaN(cvv)) {
      return res
        .status(400)
        .json({ message: 'El cvv debe ser un numero de 3 digitos' });
    }

    // Validar que el numero de tarjeta tenga el formato correcto
    const cardNumber = numero_tarjeta.replace(/\s/g, '');
    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
      return res
        .status(400)
        .json({ message: 'El numero de tarjeta debe tener 16 digitos' });
    }

    const digitos = Array.from(cardNumber).map(Number);

    for (let i = digitos.length - 2; i >= 0; i -= 2) {
      digitos[i] *= 2;
      if (digitos[i] > 9) digitos[i] -= 9;
    }

    const sum = digitos.reduce((acc, val) => acc + val, 0);

    if (sum % 10 !== 0) {
      return res
        .status(400)
        .json({ message: 'El numero de tarjeta es invalido' });
    }

    // Crear nueva tarjeta en la base de datos
    await pool.query(
      'INSERT INTO detalles_metodo_pago(id_usuario, id_metodo_pago, nombre, apellido, numero, expiracion, cvv) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        id,
        Id_tipoTarjeta.rows[0].id,
        nombre,
        apellido,
        cardNumber,
        fecha_vencimiento,
        cvv,
      ]
    );

    res.json({ message: 'Nueva tarjeta agregada exitosamente' });
  } catch (e) {
    res
      .status(500)
      .json({ message: 'Ha ocurrido un error al agregar la tarjeta' });
  }
}

async function modify_payment_method(req, res) {
  try {
    // Obtener el id del usuario despues de pasar por el middleware de autenticacion
    const { id } = req.user;

    const {
      id_metodo_pago,
      tipo_tarjeta,
      nombre,
      apellido,
      numero_tarjeta,
      fecha_vencimiento,
      cvv,
    } = req.body;

    // Validar que los campos no estén vacíos
    if (
      !id_metodo_pago ||
      !tipo_tarjeta ||
      !nombre ||
      !apellido ||
      !numero_tarjeta ||
      !fecha_vencimiento ||
      !cvv
    ) {
      return res.status(400).json({ message: 'Faltan campos por llenar' });
    }

    // Validar que la tarjeta exista
    const cardExist = await pool.query(
      'SELECT * FROM detalles_metodo_pago WHERE id = $1',
      [id_metodo_pago]
    );

    if (cardExist.rows.length === 0) {
      return res.status(400).json({ message: 'La tarjeta no existe' });
    }

    // Conseguir Id del tipo de tarjeta
    const Id_tipoTarjeta = await pool.query(
      'SELECT * FROM metodo_pago WHERE nombre = $1',
      [tipo_tarjeta]
    );

    // Validar que el tipo de tarjeta exista
    if (Id_tipoTarjeta.rows.length === 0) {
      return res.status(400).json({ message: 'El tipo de tarjeta no existe' });
    }

    // Validar que la tarjeta pertenezca al usuario
    const card = await pool.query(
      'SELECT * FROM detalles_metodo_pago WHERE id_usuario = $1 AND id = $2',
      [id, id_metodo_pago]
    );

    if (card.rows.length === 0) {
      return res
        .status(400)
        .json({ message: 'La tarjeta no pertenece al usuario' });
    }

    // Validar que la fecha de vencimiento sea valida
    const date = new Date();
    const currentYear = date.getFullYear();
    const lastTwoDigits = currentYear.toString().slice(-2);
    const currentMonth = date.getMonth() + 1;
    const [expirationMonth, expirationYear] = fecha_vencimiento.split('/');
    if (
      expirationYear < lastTwoDigits ||
      (expirationYear == currentYear && expirationMonth < currentMonth)
    ) {
      return res.status(400).json({ message: 'La tarjeta ha expirado' });
    }

    // Validar que el cvv sea un numero de 3 digitos
    if (cvv.length !== 3 || isNaN(cvv)) {
      return res
        .status(400)
        .json({ message: 'El cvv debe ser un numero de 3 digitos' });
    }

    // Validar que el numero de tarjeta tenga el formato correcto
    const cardNumber = numero_tarjeta.replace(/\s/g, '');
    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
      return res
        .status(400)
        .json({ message: 'El numero de tarjeta debe tener 16 digitos' });
    }

    const digitos = Array.from(cardNumber).map(Number);

    for (let i = digitos.length - 2; i >= 0; i -= 2) {
      digitos[i] *= 2;
      if (digitos[i] > 9) digitos[i] -= 9;
    }

    const sum = digitos.reduce((acc, val) => acc + val, 0);

    if (sum % 10 !== 0) {
      return res
        .status(400)
        .json({ message: 'El numero de tarjeta es invalido' });
    }

    // Actualiza tarjeta en la base de datos
    await pool.query(
      'UPDATE detalles_metodo_pago SET id_metodo_pago=$1, nombre=$2, apellido=$3, numero=$4, expiracion=$5, cvv=$6 WHERE id = $7',
      [
        Id_tipoTarjeta.rows[0].id,
        nombre,
        apellido,
        cardNumber,
        fecha_vencimiento,
        cvv,
        id_metodo_pago,
      ]
    );
    res.json({ message: 'La tarjeta se modificó exitosamente' });
  } catch (e) {
    res
      .status(500)
      .json({ message: 'Ha ocurrido un error al modificar la tarjeta' });
  }
}

module.exports = {
  change_data,
  change_password,
  add_address,
  modify_address,
  modify_profile_image,
  modify_banner_restaurant,
  add_payment_method,
  modify_payment_method,
};
