const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

pool.on('error', (err, client) => {
  console.error('Error inesperado en cliente inactivo', err);
  process.exit(-1);
});

let firstConnection = true;

function connectToDb() {
  pool.connect((err, client, done) => {
    if (err) throw err;
    if (firstConnection) {
      console.log('Conexión exitosa a la base de datos');
      firstConnection = false;
    }
    client.on('end', connectToDb); // Reintentar la conexión si se pierde
    client.on('error', connectToDb); // Reintentar la conexión si hay un error
  });
}

connectToDb();

module.exports = { pool };
