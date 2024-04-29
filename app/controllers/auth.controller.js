const pool = require('../db/db');
const bcrypt = require('bcrypt');

async function login(req,res){
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    if(!email || !password){
        return res.status(400).send({status:"Error",message:"Los campos estan incompletos"})
    }
    const user = await pool.query("SELECT * FROM datos_usuarios where email = $1", [email]);

    if(user.rows.length === 0){
        return res.status(401).send({status:"Error",message:"Error de inicio de sesion"})
    }

    const PasswordValid = await bcrypt.compare(password, user.rows[0].contraseña);

    if(!PasswordValid){
        return res.status(401).send({status:"Error",message:"Contraseña Incorrecta"})
    }

    console.log("Inicio de Sesion exitoso");
    
}

module.exports = {login };