const nodemailer = require('nodemailer');
const crypto = require('crypto');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

// Funcion para generar un token de recuperacion
function generateResetToken() {
  return crypto.randomBytes(20).toString('hex');
}

function sendEmail(email, subject, payload, template) {
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

  console.log(path.join(path.resolve(), '/app/services/mail', template));
  // Plantilla de correo
  const source = fs.readFileSync(
    path.join(path.resolve(), '/app/services/mail', template),
    'utf8'
  );
  const compiledTemplate = handlebars.compile(source);

  const mailOptions = {
    from: `Rippio <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: compiledTemplate(payload),
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
