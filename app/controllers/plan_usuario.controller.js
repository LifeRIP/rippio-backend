const express = require('express');
const router = express.Router();
const { pool } = require('../database/dbConfig');


async function getPlan(req, res) {

    const {id_plan} = req.body;
    const id_usuario = req.user.id;
    

    const fecha_inicio = new Date();
    const fecha_termino = new Date();
    fecha_termino.setUTCFullYear(fecha_inicio.getUTCFullYear() + 1);
    const estado = true;

try {
    const existe = await pool.query(
        `SELECT * FROM plan_usuario WHERE id_usuario = $1`,
        [id_usuario]
    );
     
    if (existe.rows.length > 0) {
        const response = await pool.query(
            `UPDATE plan_usuario SET id_plan = $1, estado = $2, fecha_inicio = $3, fecha_termino = $4 WHERE id_usuario = $5 RETURNING *`,
            [id_plan, estado, fecha_inicio, fecha_termino, id_usuario]
          );
          res.json(response.rows[0]);

    }else{
    
      const response = await pool.query(
        `INSERT INTO plan_usuario (id_usuario, id_plan, estado, fecha_inicio, fecha_termino)
        VALUES ($1, $2, $3, $4, $5) `,
        [id_usuario, id_plan, estado, fecha_inicio, fecha_termino]
      );}
     
    }catch (error) {
        console.error(error); // Imprime el error en la consola
      res.status(500).json({ error: 'Ha ocurrido un error al elegir la membresía' });
    }
  

  }



  
module.exports = { getPlan };