const { pool } = require('../database/dbConfig');

async function AggMenu(req, res) { // Agregar un menú a un restaurante en la base de datos
    
    const id_usuario = req.user.id;
    
    const tipo_usuario = req.user.tipo_usuario;

    try {
        //comprueba si el usuario es un admin
        console.log(tipo_usuario);
        if (tipo_usuario === 2) {
            
            const { id_restaurante } = req.body;

                let restaurante;
                let response;
            if (!id_restaurante) {
                return res.status(400).json({ error: 'Debes proporcionar el id del restaurante' });
                
            } else {
                    restaurante = await pool.query(
                    `SELECT * FROM producto WHERE id_restaurante = $1`,
                    [id_restaurante]
                );
            }

            if (restaurante.rowCount === 0) {
                return res.status(400).json({ error: 'El restaurante no existe' });
                
            } else {
                const {id_restaurante, estado, nombre, descripcion, cost_unit} = req.body;
                response = await pool.query(
                `INSERT INTO producto ( id_restaurante, estado, nombre, descripcion, cost_unit)
                VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                 [id_restaurante, estado, nombre, descripcion, cost_unit]
                );
            }
            
            res.json({ message: 'Menu agregado correctamente', response:response.rows[0] });
        } else if (tipo_usuario === 3) {
            //si es usuario no es admin, verifica si es el propio restaurante
                const { estado, nombre, descripcion, cost_unit } = req.body;
                const response = await pool.query(
                `INSERT INTO producto (id_restaurante, estado, nombre, descripcion, cost_unit)
                VALUES ($1, $2, $3, $4) RETURNING *`,
                [id_restaurante, estado, nombre, descripcion, cost_unit]
            );
            res.json({ message: 'Menu agregado correctamente', response: response.rows[0] });
        } else {
            res.status(403).json({ error: 'No tienes permiso para agregar un menú' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ha ocurrido un error al agregar el menu' });
    }
}

module.exports = { AggMenu };

/*Notas: Se debe convertir en autoincrementada la columna id en la tabla producto. De esta forma: 
CREATE SEQUENCE producto_id_seq;
SELECT setval('producto_id_seq', COALESCE((SELECT MAX(id)+1 FROM producto), 1), false);
ALTER TABLE producto ALTER COLUMN id SET DEFAULT nextval('producto_id_seq');
se debe realizar una por una en un script de Postgrest*/