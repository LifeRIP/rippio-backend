const express = require('express');
const router = express.Router();
const { pool } = require('../database/dbConfig');

async function addSchedule(req, res) {
    try {  
        const { id } = req.user;
        
        const {
            dias,
            hora_inicio,
            hora_fin
        } = req.body;

        // Validar que los campos no estén vacíos
        if (
            !dias ||
            !hora_inicio ||
            !hora_fin
        ) {
            return res.status(400).json({ error: 'Por favor complete todos los campos' });
        }
        
        // Recursion para agregar horario
        
        for (let i = 0; i < dias.length; i++) {
            // Agregar el horario
            await pool.query(
             'INSERT INTO horario (id_restaurante, dia_semana, hora_apertura, hora_cierre) VALUES ($1, $2, $3, $4)',
             [id, dias[i], hora_inicio, hora_fin]
            );
        }
        
        res.json({ message: 'Horario agregado correctamente' });

    } catch (error) {
        res.status(500).json({ error: 'Ha ocurrido un error al agregar el horario' });
    }
}

async function getSchedule(req, res) {
    try {
        const { id } = req.user;

        const response = await pool.query(
            `SELECT * FROM horario WHERE id_restaurante = $1`,
            [id]
        );

        res.status(200).json(response.rows);

    } catch (error) {
        res.status(500).json({ error: 'Ha ocurrido un error al obtener el horario' });
    }
}

async function updateSchedule(req, res) {
    try {
        const { id } = req.user;

        const {
            dias,
            hora_inicio,
            hora_fin
        } = req.body;

        // Validar que los campos no estén vacíos
        if (
            !dias ||
            !hora_inicio ||
            !hora_fin
        ) {
            return res.status(400).json({ error: 'Por favor complete todos los campos' });
        }

        // Actualizar el horario

        for (let i = 0; i < dias.length; i++) {
            await pool.query(
                `UPDATE horario SET hora_apertura = $1, hora_cierre = $2 WHERE id_restaurante = $3 and dia_semana = $4`,
                [hora_inicio, hora_fin, id, dias[i]]
            );
        }

        res.json({ message: 'Horario actualizado correctamente' });

    } catch (error) {
        res.status(500).json({ error: 'Ha ocurrido un error al actualizar el horario' });
    }
}

async function deleteSchedule(req, res) {
    try {
        const { id } = req.user;

        const { dia } = req.body;

        // Validar que los campos no estén vacíos
        if (!dia) {
            return res.status(400).json({ error: 'Por favor complete todos los campos' });
        }

        // Eliminar el horario
        await pool.query(
            `DELETE FROM horario WHERE id_restaurante = $1 and dia_semana = $2`,
            [id, dia]
        );

        res.json({ message: 'Horario eliminado correctamente' });

    } catch (error) {
        res.status(500).json({ error: 'Ha ocurrido un error al eliminar el horario' });
    }
}

module.exports = { addSchedule, getSchedule, updateSchedule, deleteSchedule };