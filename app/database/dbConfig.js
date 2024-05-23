const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

pool.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos', err.stack);
  } else {
    console.error('Conexión a la base de datos exitosa');
  }
});

module.exports = { pool };
