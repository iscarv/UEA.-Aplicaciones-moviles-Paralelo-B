// Importa Express
const express = require("express");

// Crea el router para definir rutas del módulo auth
const router = express.Router();

// Importa el controlador de autenticación
const controller = require("../controllers/auth.controller");

// Importa el middleware que valida el token JWT
const authMiddleware = require("../middleware/auth.middleware");

// Ruta para registrar usuarios
router.post("/register", controller.register);

// Ruta para iniciar sesión
router.post("/login", controller.login);

// Ruta protegida para obtener datos del usuario autenticado
// Primero pasa por authMiddleware y luego ejecuta controller.me
router.get("/me", authMiddleware, controller.me);

// Ruta para validar si un correo ya existe (validación asíncrona desde frontend)
router.get("/check-email/:email", controller.checkEmail);

// Exporta el router para usarlo en index.js
module.exports = router;
