const { generateResetToken, getExpirationTime, sendResetEmail } = require("../services/mailService");
const { pool } = require("../database/dbConfig");
const bcrypt = require("bcrypt");

async function forgotPassword (req, res) {
  try {
    const { email } = req.body;

    // Verifica si el correo existe en la base de datos
    const user = await pool.query(
      "SELECT * FROM datos_usuarios WHERE email = $1",
      [email]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Correo electrónico no registrado" });
    }

    // Genera un token de recuperación y una marca de tiempo de expiración
    const resetToken = generateResetToken();
    const tokenExpiration = getExpirationTime();
    const id = user.rows[0].id;

    const tokenExist = await pool.query(
      "SELECT id FROM restablecer_pass WHERE id = $1",
      [id]
    );

    // Si no existe un token en la base de datos, lo crea
    if (tokenExist.rows.length === 0) {
      await pool.query(
        "INSERT INTO restablecer_pass (id, token, expira) VALUES ($1, $2, $3)",
        [id, resetToken, tokenExpiration]
      );
      sendResetEmail(email, resetToken); // Enviar correo con el token
      return res.json({
        message:
          "Se ha enviado un correo con instrucciones para restablecer tu contraseña",
      });
    }

    // Si ya existe un token en la base de datos, lo actualiza
    await pool.query(
      "UPDATE restablecer_pass SET token = $1, expira = $2 WHERE id = $3",
      [resetToken, tokenExpiration, id]
    );
    sendResetEmail(email, resetToken); // Enviar correo con el token

    res.json({ message: "Se ha enviado un correo con instrucciones para restablecer tu contraseña" });
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error al restablecer la contraseña" });
  }
}

async function resetPassword(req, res) {
  try {
    const { newPassword } = req.body;
    const token = req.query.token;

    // Verifica si la nueva contraseña no está vacía
    if (!newPassword) {
      return res.status(400).json({ message: "Faltan campos por llenar"});
    }

    // Verifica si el token es válido y no ha expirado
    const user = await pool.query(
      "SELECT * FROM restablecer_pass WHERE token = $1 AND expira > $2",
      [token, new Date()]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    // Hashea la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualiza la contraseña en la base de datos
    await pool.query(
      "UPDATE datos_usuarios SET contraseña = $1 WHERE id = $2",
      [hashedPassword, user.rows[0].id]
    );

    // Elimina el token de la base de datos
    await pool.query("DELETE FROM restablecer_pass WHERE id = $1", [
      user.rows[0].id,
    ]);

    res.status(205).json({ message: "Contraseña restablecida exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error al restablecer la contraseña" });
  }
}

module.exports = { forgotPassword, resetPassword };
