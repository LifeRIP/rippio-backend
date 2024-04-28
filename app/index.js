const Express = require('express');

//server

const app = Express();
app.set("port", 4000);
app.listen(app.get("port"));
console.log("servidor corriendo en el puerto", app.get("port"));

//Rutas
app.get("/login",(req,res)=> res.sendFile(__dirname + "/pages/login.html"))