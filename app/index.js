const express = require("express");
const { register } = require("./controllers/auth.controller");

//server

const app = express();
app.set("port", 4000);
app.listen(app.get("port"));
console.log(`Servidor corriendo en http://localhost:${app.get("port")}/`);

app.use(express.json()); // Para que express pueda entender los datos que vienen del cliente

//Rutas
app.get("/", (req, res) => res.sendFile(__dirname + "/pages/login.html"));
app.post("/api/register", register);
