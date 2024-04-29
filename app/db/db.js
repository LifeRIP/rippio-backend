const {Pool} = require('pg');

const config = {
    user: 'postgres',
    hots: 'localhost',
    port: 5432,
    password: "1234",
    database: 'rippio',
};

const pool = new Pool(config);

module.exports = pool;