const express = require('express');
const { router } = require('./app/routes/index');
const { corsOptions } = require('./app/services/cors');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const port = process.env.PORT || 4000;

// Configuracion
app.use(express.static(path.join(__dirname, '/app/public'))); // Rutas de prueba
app.use(express.json()); // Para que express pueda entender los datos que vienen del cliente
app.use(helmet()); // Seguridad
app.use(cors(corsOptions)); // Cors

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

// Server
app.listen(port);
console.log(`Servidor corriendo en http://localhost:${port}/`);
