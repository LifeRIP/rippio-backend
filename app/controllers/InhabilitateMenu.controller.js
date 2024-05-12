const { pool } = require('../database/dbConfig');

async function InhabMenu(req, res) { // Inhabilitar un menú a un restaurante en la base de datos
    
    const id_restaurante = req.user.id;
    
    const tipo_usuario = req.user.tipo_usuario;

    try {
        //comprueba si el usuario es un admin
        if (tipo_usuario === 3) {
            
            //const { id_restaurante } = req.body;
            const { nombre } = req.body;
            const {estado} = req.body;

                let producto;
                let response;
                //console.log("rr");
            if (!id_restaurante) {
                return res.status(400).json({ error: 'No tiene permitido hacer esa función' });
                
            } else {
                    producto = await pool.query(
                    `SELECT * FROM producto WHERE id_restaurante = $1 AND nombre = $2`,
                    [id_restaurante, nombre]
                );
            }

            if (producto.rowCount === 0) {
                return res.status(400).json({ error: 'El producto no existe' });
                
            } else {
                
                response = await pool.query(
                    `UPDATE producto SET estado = $1 WHERE id_restaurante = $2 AND nombre = $3 RETURNING *`,
                    [estado, id_restaurante, nombre]
                );
            }
            if (estado === "false") {
                res.json({ message: 'Menú inhabilitado', response:response.rows[0] });
            } else {
                res.json({ message: 'Menú habilitado', response:response.rows[0] });
            }
            
        } else  {
            
            res.status(403).json({ error: 'No tienes permiso para agregar un menú' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ha ocurrido un error al inhabilitar el menú' });
    }
}

module.exports = { InhabMenu };