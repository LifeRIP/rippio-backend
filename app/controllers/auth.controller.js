const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../database/dbConfig');
const jwt = require('jsonwebtoken');
const expiresIn = 30 * 24 * 60 * 60; // Expiracion del token en segundos (30 dias)

async function register(req, res) {
  try {
    const {
      identificacion,
      nombre,
      apellido,
      email,
      telefono,
      password,
      tipo_usuario,
    } = req.body;

    // Validar que los campos no estén vacíos
    if (
      !identificacion ||
      !nombre ||
      (tipo_usuario != 3 && !apellido) ||
      !email ||
      !telefono ||
      !password ||
      !tipo_usuario
    ) {
      return res.status(400).json({ message: 'Faltan campos por llenar' });
    }

    // Validar que el email no esté registrado
    const emailExist = await pool.query(
      'SELECT * FROM datos_usuarios WHERE email = $1',
      [email]
    );

    if (emailExist.rows.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Validar que la identificación no esté registrada
    const identificacionExist = await pool.query(
      'SELECT * FROM datos_usuarios WHERE identificacion = $1',
      [identificacion]
    );

    if (identificacionExist.rows.length > 0) {
      return res
        .status(400)
        .json({ message: 'La identificación ya está registrada' });
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

    // Crear un id único para el usuario
    const id = uuidv4();

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Insertar el usuario en la base de datos
    await pool.query(
      'INSERT INTO datos_usuarios (id, identificacion, nombre, apellido, email, telefono, contraseña, tipo_usuario, img_icon) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [
        id,
        identificacion,
        nombre,
        apellido,
        email,
        telefono,
        hash,
        tipo_usuario,
        'https://firebasestorage.googleapis.com/v0/b/rippio.appspot.com/o/RestaurantIcon%2FDefaultUserIcon.jpg?alt=media&token=ffb4eaaf-b8e4-42b6-829e-d0398410d95f',
      ]
    );

    // Crear token
    const token = await jwt.sign(
      {
        id,
        tipo_usuario,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: expiresIn, // 30 dias en segundos
      }
    );

    res.status(201).json({
      token,
      id,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Ha ocurrido un error al registrar el usuario' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validar que los campos no estén vacíos
    if (!email || !password) {
      return res.status(400).json({ message: 'Los campos estan incompletos' });
    }

    // Validar que el usuario exista
    const user = await pool.query(
      'SELECT * FROM datos_usuarios WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res
        .status(401)
        .send({ status: 'Error', message: 'Error de inicio de sesion' });
    }

    // Validar la contraseña
    const PasswordValid = await bcrypt.compare(
      password,
      user.rows[0].contraseña
    );

    if (!PasswordValid) {
      return res.status(401).send({ message: 'Contraseña Incorrecta' });
    }

    // Crear token
    const token = await jwt.sign(
      {
        userID: user.rows[0].id,
        tipo_usuario: user.rows[0].tipo_usuario,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: expiresIn, // 30 dias en segundos
      }
    );
    /* 
    // Opciones de la cookie
    const cookieOption = {
      httpOnly: true,
      expires: new Date(Date.now() + expiresIn * 1000), // 30 dias en milisegundos
      path: '/',
      sameSite: 'none',
      secure: true,
    };

    // Enviar cookie
    res.cookie('JWT', token, cookieOption); */
    res.json({
      token,
      id: user.rows[0].id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ha ocurrido un error al iniciar sesion' });
  }
}

module.exports = { register, login };
