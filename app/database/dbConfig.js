const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (error) => {
  console.error('Error inesperado en PostgreSQL:', error.code || error.message);
});

async function connectToDb() {
  try {
    await pool.query('SELECT 1');
    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('Error al conectarse a la base de datos:', error.code || error.message);
  }
}

module.exports = { pool, connectToDb };
