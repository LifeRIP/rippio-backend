const { pool } = require('../database/dbConfig');
const bcrypt = require('bcrypt');
const { now, min } = require('moment');
const {
  generateResetToken,
  sendEmail,
} = require('../services/mail/mailService');
const clientURL = process.env.CLIENT_URL;

async function forgotPassword(req, res) {
  try {
    const { email, fecha } = req.body;

    // Verifica que los campos no estén vacíos
    if (!email || !fecha) {
      return res.status(400).json({ message: 'Faltan campos por llenar' });
    }

    // Verifica si el correo existe en la base de datos
    const user = await pool.query(
      'SELECT * FROM datos_usuarios WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'Correo electrónico no registrado' });
    }

    // Genera un token de recuperación
    const resetToken = generateResetToken();

    // Separar la fecha en dia, mes y año hora, minuto, segundo para sumarle 15 minutos
    const tokenExpiration = new Date(fecha);
    tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 15);

    const name = user.rows[0].nombre;
    const id = user.rows[0].id;
    const link = `${clientURL}/reset-password?token=${resetToken}`;

    const tokenExist = await pool.query(
      'SELECT id FROM restablecer_pass WHERE id = $1',
      [id]
    );
    // Si no existe un token en la base de datos, lo crea
    if (tokenExist.rows.length === 0) {
      await pool.query(
        'INSERT INTO restablecer_pass (id, token, expira) VALUES ($1, $2, $3)',
        [id, resetToken, tokenExpiration]
      );
      console.log(email, name, link);
      // Envia el correo con el link de restablecimiento
      sendEmail(email, 'Restablecer tu contraseña', name, link);
      return res.json({
        message:
          'Se ha enviado un correo con instrucciones para restablecer tu contraseña',
      });
    } else {
      await pool.query(
        'UPDATE restablecer_pass SET token = $1, expira = $2 WHERE id = $3',
        [resetToken, tokenExpiration, id]
      );
    }

    console.log(email, name, link);
    // Envia el correo con el link de restablecimiento
    sendEmail(email, 'Restablecer tu contraseña', name, link);

    res.json({
      message:
        'Se ha enviado un correo con instrucciones para restablecer tu contraseña',
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Ha ocurrido un error al restablecer la contraseña' });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, newPassword, confirmNewPassword, time } = req.body;

    // Verifica si la nueva contraseña no está vacía
    if (!token || !newPassword || !time || !confirmNewPassword) {
      return res.status(400).json({ message: 'Faltan campos por llenar' });
    }

    // Verifica si las contraseñas coinciden
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }

    // Verifica si el token es válido y no ha expirado
    const user = await pool.query(
      'SELECT * FROM restablecer_pass WHERE token = $1 AND expira > $2',
      [token, time]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Link expirado' });
    }

    // Hashea la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualiza la contraseña en la base de datos
    await pool.query(
      'UPDATE datos_usuarios SET contraseña = $1 WHERE id = $2',
      [hashedPassword, user.rows[0].id]
    );

    // Elimina el token de la base de datos
    await pool.query('DELETE FROM restablecer_pass WHERE id = $1', [
      user.rows[0].id,
    ]);

    res.status(201).json({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Ha ocurrido un error al restablecer la contraseña' });
  }
}

module.exports = { forgotPassword, resetPassword };
