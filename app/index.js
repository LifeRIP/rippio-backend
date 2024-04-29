const Express = require('express');
const authentication = require('./controllers/auth.controller');

//server

const app = Express();
app.set("port", 4000);
app.listen(app.get("port"));
console.log("servidor corriendo en el puerto", app.get("port"));

//Configuracion
app.use(Express.static(__dirname + "/public"));
app.use(Express.json());

//Rutas
app.get("/login",(req,res)=> res.sendFile(__dirname + "/pages/login.html"))
app.post("/api/login",authentication.login);