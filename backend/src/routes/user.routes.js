// ================= IMPORTS =================

// Express
const express = require("express");

// Router
const router = express.Router();

// Controller de usuarios
const userController = require("../controllers/user.controller");

// Middleware de autenticación
const authMiddleware = require("../middleware/auth.middleware");


// ============================================
// OBTENER TODOS LOS USUARIOS (SOLO ADMIN)
// ============================================

router.get(
  "/",
  authMiddleware, // valida JWT
  (req, res, next) => {

    // Verificar rol administrador
    if (req.user.role !== 2) {
      return res.status(403).json({
        message: "Acceso denegado: solo administradores"
      });
    }

    next(); // continuar al controlador
  },
  userController.getAllUsers
);


// ================= EXPORT =================
module.exports = router;