const { pool } = require('../database/dbConfig');

async function getAll(req, res) {
    try {
        const response = await pool.query(
            `
            SELECT * FROM public.categoria
            ORDER BY nombre ASC  
            `
        );

        if (response.rows.length === 0) {
            return res.status(404).json('No hay categorias en la base de datos');
        }

        return res.status(200).json(response.rows);

    } catch (err) {
        console.log(err);
    }
}

module.exports = { getAll };
