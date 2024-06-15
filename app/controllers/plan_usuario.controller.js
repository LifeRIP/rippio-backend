const express = require('express');
const router = express.Router();
const { pool } = require('../database/dbConfig');

async function getById(req, res) {
  try {
    const { id } = req.user;
    const response = await pool.query(
      `SELECT
      p.nombre, p.descripcion,
      pu.*
      FROM plan_usuario pu
      inner join plan p on p.id = pu.id_plan
      WHERE id_usuario = $1`,
      [id]
    );
    res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error); // Imprime el error en la consola
    res.status(500).json({ error: 'Ha ocurrido un error al obtener el plan' });
  }
}


async function cancelPlan(req, res) {
  try {
    const { id } = req.user;
    const response = await pool.query(
      `UPDATE plan_usuario SET estado = false WHERE id_usuario = $1 RETURNING *`,
      [id]
    );
    res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error); // Imprime el error en la consola
    res.status(500).json({ error: 'Ha ocurrido un error al cancelar el plan' });
  }

}

async function getPlan(req, res) {
  try {
    const {id_plan, metodo_pago} = req.body;
    const {id} = req.user;

    // Validar campos vacíos
    if (!id_plan || !metodo_pago) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verifica si la tarjeta de crédito ya está registrada
    const tarjeta = await pool.query(
      `SELECT * FROM detalles_metodo_pago WHERE id_usuario = $1 AND id = $2`,
      [id, metodo_pago]
    );

    if (tarjeta.rows.length === 0) {
      return res.status(400).json({ error: 'La tarjeta de crédito no está registrada' });
    }

    
    const fecha_hoy = new Date();
    const fecha_fin = new Date(fecha_hoy.getTime());
    fecha_fin.setMonth(fecha_hoy.getMonth() + 1);
    const estado = true;

    const existe = await pool.query(
        `SELECT * FROM plan_usuario WHERE id_usuario = $1`,
        [id]
    );

    // Si el usuario ya tiene un plan y está dentro de la fecha de vigencia se le notifica
    if (existe.rows.length > 0) {
      const plan = existe.rows[0];
      if (plan.fecha_termino > fecha_hoy && existe.rows[0].estado === true) {
        return res.status(400).json({ error: 'Ya tienes un plan activo' });
      }}

    //validar si el usuario ya existe en la tabla plan_usuario, si es así, lo actualiza
    if (existe.rows.length > 0) {
        const response = await pool.query(
            `UPDATE plan_usuario SET id_plan = $1, estado = $2, fecha_inicio = $3, fecha_termino = $4 WHERE id_usuario = $5 RETURNING *`,
            [id_plan, estado, fecha_hoy, fecha_fin, id]
          );
          res.json(response.rows[0]);
    }else{
    //si da false el if, se inserta un nuevo registro
       const insertResponse = await pool.query(
        `INSERT INTO plan_usuario (id_usuario, id_plan, estado, fecha_inicio, fecha_termino)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [id, id_plan, estado, fecha_hoy, fecha_fin]
      );
      res.json(insertResponse.rows[0]);
    }
    
    }catch (error) {
        console.error(error); // Imprime el error en la consola
      res.status(500).json({ error: 'Ha ocurrido un error al elegir la membresía' });
    }
  }

module.exports = { getPlan, getById, cancelPlan };