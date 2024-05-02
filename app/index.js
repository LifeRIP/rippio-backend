const express = require("express");
const { router } = require("./routes/routes.js");

// Server
const app = express();
app.set("port", 4000);
app.listen(app.get("port"));
console.log(`Servidor corriendo en http://localhost:${app.get("port")}/`);

// Configuracion
app.use(express.static(__dirname + "/public")); // Pruebas para el login
app.use(express.json()); // Para que express pueda entender los datos que vienen del cliente

// Rutas API
app.use("/api", router);

// Rutas de pruebas para el login
app.get("/", (req, res) => res.sendFile(__dirname + "/pages/login.html"));
app.get("/login", (req, res) => res.sendFile(__dirname + "/pages/login.html"));
