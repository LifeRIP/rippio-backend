const express = require("express");
const { router } = require("./routes/routes.js");
const path = require("path");

// Server
const app = express();
app.set("port", 4000);
app.listen(app.get("port"));
console.log(`Servidor corriendo en http://localhost:${app.get("port")}/`);

// Configuracion
app.use(express.static(path.join(__dirname, "public"))); // Rutas de prueba
app.use(express.json()); // Para que express pueda entender los datos que vienen del cliente

// Rutas API
app.use("/api", router);

// Rutas de pruebas para el login
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/pages/login.html")));
app.get("/forgot-password", (req, res) => res.sendFile(path.join(__dirname, "/pages/forgot-password.html")));
app.get("/reset-password", (req, res) => res.sendFile(path.join(__dirname, "/pages/reset-password.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "/pages/login.html")));
