const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../database/dbConfig');
const jsonwebtoken = require('jsonwebtoken');

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
      !apellido ||
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
        null,
      ]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
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

    //TODO: Crear token de autenticación

    const token = jsonwebtoken.sign(
      {
        userID: user.rows[0].id,
      },
      process.env.JWT_SECRET
    );

    const cookieOption = {
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      path: '/',
    };

    res.cookie('JWT', token, cookieOption);
    res.json({
      status: 'ok',
      message: 'Usuario loggeado' /*,redirect: "https://rippio.netlify.app/"*/,
    });
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error al iniciar sesion' });
  }
}

module.exports = { register, login };
