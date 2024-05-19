const express = require('express');
const { router } = require('./app/routes/index');
const path = require('path');
const cors = require('cors');

// Server
const app = express();
const port = process.env.PORT || 4000;
app.listen(port);
console.log(`Servidor corriendo en http://localhost:${port}/`);

// Configuracion
app.use(express.static(path.join(__dirname, '/app/public'))); // Rutas de prueba
app.use(express.json()); // Para que express pueda entender los datos que vienen del cliente

// Cors
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:4000',
      'https://rippio-api.vercel.app',
      'http://localhost:5173',
      'https://rippio.netlify.app',
    ];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed'), false);
    }
  },
};

app.use(cors(corsOptions));

// Rutas API
app.use('/api', router);

// Rutas de pruebas para el login
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/app/pages/login.html'))
);
app.get('/forgot-password', (req, res) =>
  res.sendFile(path.join(__dirname, '/app/pages/forgot-password.html'))
);
app.get('/reset-password', (req, res) =>
  res.sendFile(path.join(__dirname, '/app/pages/reset-password.html'))
);
app.get('/login', (req, res) =>
  res.sendFile(path.join(__dirname, '/app/pages/login.html'))
);