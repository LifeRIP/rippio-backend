const { createApp } = require('./app/server');
const { connectToDb } = require('./app/database/dbConfig');

const { server } = createApp();
const port = process.env.PORT || 4000;
connectToDb();
server.listen(port, () => console.log('Servidor corriendo en http://localhost:' + port + '/'));
