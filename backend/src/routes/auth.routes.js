// ================= IMPORTS =================

// Express para crear rutas
const express = require("express");

// Middleware que valida JWT
const authMiddleware = require("../middleware/auth.middleware");

// Controller con toda la lógica de Auth
const authController = require("../controllers/auth.controller");

// ================= ROUTER =================
const router = express.Router();

/*
================= RUTA DE REGISTRO =================

- Llama directamente a authController.register
- Este controlador se encarga de:
  ✔ Validar campos
  ✔ Verificar si el email existe
  ✔ Hashear la contraseña
  ✔ Insertar usuario en la base de datos
  ✔ Devolver mensaje al frontend
*/
router.post("/register", authController.register);

/*
================= RUTA DE LOGIN =================

- Llama directamente a authController.login
- Este controlador se encarga de:
  ✔ Buscar usuario por email
  ✔ Comparar contraseña con bcrypt
  ✔ Generar token JWT
  ✔ Devolver token y datos del usuario al frontend
*/
router.post("/login", authController.login);

/*
================= RUTA DE VALIDACIÓN DE EMAIL =================

- Llama a authController.checkEmail
- Permite validar de forma asincrónica si un correo ya está registrado
- Devuelve { exists: true/false } para el frontend
*/
router.get("/check-email/:email", authController.checkEmail);

/*
================= RUTA PROTEGIDA /me =================

- Requiere JWT en header Authorization
- authMiddleware verifica token
- authController.me devuelve datos del usuario logueado
*/
router.get("/me", authMiddleware, authController.me);

// ================= EXPORT =================
module.exports = router;