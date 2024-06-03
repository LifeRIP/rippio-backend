const express = require('express');
const { router } = require('./app/routes/index');
const { corsOptions } = require('./app/services/cors');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const { connectToDb } = require('./app/database/dbConfig');
const app = express();
const port = process.env.PORT || 4000;

// Configuracion
app.use(express.json()); // Para que express pueda entender los datos que vienen del cliente
app.use(helmet()); // Seguridad
app.use(cors(corsOptions));
connectToDb();

// Rutas API
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/app/pages/index.html'))
);
app.use('/api', router);
app.get('/healthCheck', (req, res) => {
  res.json({ status: 'OK' });
});
app.use('*', (req, res) => {
  res.status(404).json({ error: 'URL_NOT_FOUND' });
});

// Server
app.listen(port);
console.log(`Servidor corriendo en http://localhost:${port}/`);
