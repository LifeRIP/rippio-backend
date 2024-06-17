const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Funcion para generar un token de recuperacion
function generateResetToken() {
  return crypto.randomBytes(20).toString('hex');
}

function sendResetEmail(email, token) {
  const mailOptions = {
    from: `Rippio <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Restablecer contraseña',

    // Reestructurar función para que el enlace sea dinámico
    html: `Para restablecer tu contraseña, haz clic en el siguiente enlace: http://localhost:4000/api/recovery/reset-password?token=${token}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });
}

module.exports = {
  generateResetToken,
  sendResetEmail,
};
