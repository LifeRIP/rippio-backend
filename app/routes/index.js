const express = require('express');
const router = express.Router();
const fs = require('node:fs');
const path = require('node:path');

const files = fs.readdirSync(__dirname); // Lee los archivos de la carpeta actual

// Filtra los archivos que no sean el actual y crea las rutas dinamicas
files.forEach((file) => {
  const name = path.basename(file, '.js');
  if (name === 'index') return;
  router.use(`/${name}`, require(`./${file}`)); // Importa las rutas de los archivos
});

module.exports = { router };
