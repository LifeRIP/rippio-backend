const { generateResetToken, getExpirationTime, sendResetEmail } = require("./services/mailService");
const { pool } = require("./database/dbConfig");
const bcrypt = require("bcrypt");

async function forgotPassword (req, res) {
  try {
    const { email } = req.body;

    // Verifica si el correo existe en la base de datos
    const user = await pool.query(
      "SELECT * FROM datos_usuarios WHERE email = $1",
      [email]
    );
    console.log(user.rows[0].email);

    const id = user.rows[0].id;

    if (user.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Correo electrónico no registrado" });
    }

    // Genera un token de recuperación

    const resetToken = generateResetToken();
    const tokenExpiration = getExpirationTime();
    console.log(tokenExpiration);

    const tokenExist = await pool.query(
      "SELECT id FROM datos_usuarios WHERE id = $1",
      [id]
    );
    if (tokenExist.rows.length > 0) {
      await pool.query(
        "UPDATE restablecer_pass SET token = $1, expira = $2 WHERE id = $3",
        [resetToken, tokenExpiration, id]
      );
      sendResetEmail(email, resetToken);
      return res.json({
        message:
          "Se ha enviado un correo con instrucciones para restablecer tu contraseña",
      });
    }

    // Guarda el token en la base de datos junto con la marca de tiempo de expiración
    await pool.query(
      "INSERT into  restablecer_pass ( id, token, expira) VALUES ($1,$2,$3)",
      [id, resetToken, tokenExpiration]
    );

    // Envía el correo con el token de recuperación
    //sendResetEmail(email, resetToken);

    res.json({
      message:
        "Se ha enviado un correo con instrucciones para restablecer tu contraseña",
    });
  } catch (error) {
    res.send(404);
  }
}

async function resetPassword(req, res) {
  try {
    const { newPassword } = req.body;
    const token = req.query.token;
    console.log(token);

    if (!newPassword) {
      return res.status(400).json({
        status: "Error",
        message: "Faltan campos por llenar",
      });
    }

    // Verifica si el token es válido y no ha expirado
    const user = await pool.query(
      "SELECT * FROM restablecer_pass WHERE token = $1 AND expira > $2",
      [token, new Date()]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    //const user = await pool.query('SELECT * FROM datos_usuarios WHERE reset_token = $1 AND reset_token_expires > $2', [token, new Date()]);

    // Hashea la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualiza la contraseña en la base de datos
    //await pool.query('UPDATE datos_usuarios SET contraseña = $1, reset_token = NULL, reset_token_expires = NULL WHERE email = $2', [hashedPassword, user.rows[0].email]);
    await pool.query(
      "UPDATE datos_usuarios SET contraseña = $1  WHERE id = $2",
      [hashedPassword, user.rows[0].id]
    );
    await pool.query("DELETE FROM datos_usuarios  WHERE id = $1", [
      user.rows[0].id,
    ]);

    res.json({ message: "Contraseña restablecida exitosamente" });
  } catch (error) {
    res.send(404);
  }
}

module.exports = { forgotPassword, resetPassword };
