const nodemailer = require('nodemailer');
const crypto = require('crypto');
const resetPassword = require('./templates/resetPassword');

// Funcion para generar un token de recuperacion
function generateResetToken() {
  return crypto.randomBytes(20).toString('hex');
}

function sendEmail(email, subject, name, link) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `Rippio <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: resetPassword(name, link),
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
  sendEmail,
};
