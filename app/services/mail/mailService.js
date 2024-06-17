const nodemailer = require('nodemailer');
const crypto = require('crypto');
const resetPassword = require('./templates/resetPassword');

// Funcion para generar un token de recuperacion
function generateResetToken() {
  return crypto.randomBytes(20).toString('hex');
}

async function sendEmail(email, subject, name, link) {
  try {
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

    // Envuelve el método sendMail en una promesa
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          reject(error); // Rechaza la promesa si hay un error
        } else {
          console.log(`Correo enviado: ${name} ${email} ${link}`);
          resolve(info); // Resuelve la promesa si el correo se envía correctamente
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw error; // Lanza el error para que pueda ser capturado por el código que llama a esta función
  }
}

module.exports = {
  generateResetToken,
  sendEmail,
};
