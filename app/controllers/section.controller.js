const { pool } = require('../database/dbConfig');

async function AggSect(req, res) {
    try {
        const { id } = req.user;
        const { id_producto, nombre_seccion } = req.body;
        await pool.query(
            `INSERT INTO seccion (id_restaurante, nombre)
            VALUES ($1, $2)`,
            [id, nombre_seccion]
        );
        res.status(200).json({ message: 'Sección agregada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ha ocurrido un error al agregar la sección' });
    }
}

async function DelSect(req, res) {
    try {
        const { id_seccion } = req.body;
        const response = await pool.query(
            `DELETE FROM seccion WHERE id = $1`,
            [id_seccion]
        );
        res.status(200).json({ message: 'Sección eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ha ocurrido un error al eliminar la sección' });
    }
}

async function ModSect(req, res) {
    try {
        const { id_seccion, nombre_seccion } = req.body;
        const response = await pool.query(
            `UPDATE seccion SET nombre = $1 WHERE id = $2`,
            [nombre_seccion, id_seccion]
        );
        res.status(200).json({ message: 'Sección modificada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ha ocurrido un error al modificar la sección' });
    }
}

async function getSectionsByRestaurantId(req, res) {
    try {
        const { id } = req.user;
        const response = await pool.query(
            `SELECT nombre, id
            FROM seccion WHERE id_restaurante = $1`,
            [id]
        );
        res.status(200).json(response.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ha ocurrido un error al obtener las secciones' });
    }
}

module.exports = { AggSect, DelSect, ModSect, getSectionsByRestaurantId };