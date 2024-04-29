const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { pool } = require("../database/dbConfig");

async function register(req, res) {
  try {
    const {
      identificacion,
      nombre,
      apellido,
      email,
      telefono,
      contraseña,
      tipo_usuario,
    } = req.body;

    console.log(req.body);

    // Validar que los campos no estén vacíos
    if (
      !identificacion ||
      !nombre ||
      !apellido ||
      !email ||
      !telefono ||
      !contraseña ||
      !tipo_usuario
    ) {
      return res.status(400).json({
        status: "Error",
        message: "Faltan campos por llenar",
      });
    }

    // Validar que el email no esté registrado
    const emailExist = await pool.query(
      "SELECT * FROM datos_usuarios WHERE email = $1",
      [email]
    );

    if (emailExist.rows.length > 0) {
      return res.status(400).json({
        status: "Error",
        message: "El email ya está registrado",
      });
    }

    // Validar que la identificación no esté registrada
    const identificacionExist = await pool.query(
      "SELECT * FROM datos_usuarios WHERE identificacion = $1",
      [identificacion]
    );

    if (identificacionExist.rows.length > 0) {
      return res.status(400).json({
        status: "Error",
        message: "La identificación ya está registrada",
      });
    }

    // Crear un id único para el usuario
    const id = uuidv4();

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contraseña, salt);

    // Insertar el usuario en la base de datos
    await pool.query(
      "INSERT INTO datos_usuarios (id, identificacion, nombre, apellido, email, telefono, contraseña, tipo_usuario, img_icon) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
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

    res.status(201).json({
      status: "Exitoso",
      message: "Usuario registrado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Ha ocurrido un error al registrar el usuario",
    });
  }
}

module.exports = { register };
