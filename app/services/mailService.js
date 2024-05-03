const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port: 465,
    secure: true,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/*export async function enviarMail(email, token){
    transporter.sendMail({
        from: "Kevin <kevin.gil@correounivalle.edu.co>",
        to: email,
        subject: "Restablecer contraseña",
        html: "`Para restablecer tu contraseña, haz clic en el siguiente enlace: http://localhost:4000/recovry/${token}`,",

    })
};
*/

//Recovery


function generateResetToken() {
    return crypto.randomBytes(20).toString('hex');
  };
  
  function getExpirationTime() {
    const now = new Date();
    now.setTime(now.getTime() + 3600000);
    return now; // 1 hora a partir de ahora
  };
  
  function sendResetEmail(email, token) {
    const mailOptions = {
      from: "Kevin <kevin.gil@correounivalle.edu.co>",
      to: email,
      subject: "Restablecer contraseña",
      html: `Para restablecer tu contraseña, haz clic en el siguiente enlace: http://localhost:4000/reset-password?token=${token}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Correo enviado: ' + info.response);
      }
    })}

  module.exports = {
    generateResetToken,
    getExpirationTime,
    sendResetEmail,
  };
  