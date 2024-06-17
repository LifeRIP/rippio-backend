function resetPassword(name, link) {
  return `<!DOCTYPE html>
<html>

<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
    rel="stylesheet">
  <meta charset="utf-8">
  <title>Rippio - Restablecer contraseña</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      margin: 0;
      padding: 0;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 20px auto;
      /* Centrado horizontal */
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 20px;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
    }

    .header {
      text-align: center;
      padding: 10px 0;
    }

    .header img {
      max-width: 100%;
      height: auto;
    }

    .content {
      padding: 20px;
      text-align: center;
    }

    .content h1 {
      color: #01cbc3;
    }

    .content p {
      font-size: 16px;
      line-height: 1.5;
      color: #666666;
    }

    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #01cbc3;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
    }

    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #999999;
    }

    @media screen and (max-width: 600px) {
      .content p {
        font-size: 14px;
      }

      .container {
        padding: 10px;
      }
    }
  </style>
</head>

<!DOCTYPE html>
<html>

<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
    rel="stylesheet">
  <meta charset="utf-8">
  <title>Rippio - Restablecer contraseña</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      margin: 0;
      padding: 0;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 20px auto;
      /* Centrado horizontal */
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 20px;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
    }

    .header {
      text-align: center;
      padding: 10px 0;
    }

    .header img {
      max-width: 100%;
      height: auto;
    }

    .content {
      padding: 20px;
      text-align: center;
    }

    .content h1 {
      color: #01cbc3;
    }

    .content p {
      font-size: 16px;
      line-height: 1.5;
      color: #666666;
    }

    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #01cbc3;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
    }

    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #999999;
    }

    @media screen and (max-width: 600px) {
      .content p {
        font-size: 14px;
      }

      .container {
        padding: 10px;
      }
    }
  </style>
</head>

<body>
  <table width="100%" height="100%" style="margin:0;padding:0;width:100%;height:100%;border-collapse:collapse;">
    <tr>
      <td style="vertical-align:middle;text-align:center;">
        <table class="container" style="margin:0 auto;">
          <tr>
            <td>
              <div class="header">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/rippio.appspot.com/o/icons%2Frippiofood.png?alt=media&token=3a5253e4-3033-4e9e-8412-a32e53d0358a"
                  alt="Rippio Logo">
              </div>
              <div class="content">
                <h1>Restablecer tu contraseña</h1>
                <p>Hola ${name},</p>
                <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para
                  continuar
                  con
                  el proceso:</p>
                <a href="${link}" class="button">Restablecer contraseña</a>
                <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
                <p>Gracias,<br>El equipo de Rippio</p>
              </div>
              <div class="footer">
                <p>© 2024 Rippio Inc. All Rights Reserved</p>
                <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>

</html>`;
}

module.exports = resetPassword;
