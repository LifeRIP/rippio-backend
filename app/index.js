const express = require("express");
const { register, login } = require("./controllers/auth.controller");

// Server

const app = express();
app.set("port", 4000);
app.listen(app.get("port"));
console.log(`Servidor corriendo en http://localhost:${app.get("port")}/`);

// Configuracion
app.use(express.static(__dirname + "/public"));
app.use(express.json()); // Para que express pueda entender los datos que vienen del cliente

// Rutas
app.get("/", (req, res) => res.sendFile(__dirname + "/pages/login.html"));
app.get("/login", (req, res) => res.sendFile(__dirname + "/pages/login.html"));
app.post("/api/login", login);
app.post("/api/register", register);
