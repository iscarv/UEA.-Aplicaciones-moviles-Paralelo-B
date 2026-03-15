// ============================================================
// IMPORTS
// ============================================================
const express = require("express");                     // Framework para rutas
const router = express.Router();                        // Router de Express
const multer = require("multer");                       // Subida de archivos
const path = require("path");                           // Manejo de rutas
const bookController = require("../controllers/book.controller"); // Lógica de libros
const authMiddleware = require("../middleware/auth.middleware");  // Middleware JWT

// ============================================================
// CONFIGURACIÓN DE MULTER (SUBIDA DE IMÁGENES)
// ============================================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // extensión original
    cb(null, Date.now() + ext);                 // nombre único
  },
});

const upload = multer({ storage });

// ============================================================
// RUTAS DE LIBROS
// ============================================================

// ---------------- CREAR LIBRO ----------------
router.post(
  "/",
  authMiddleware, // 1️⃣ Verificar token JWT

  (req, res, next) => {
    // 2️⃣ Middleware multer para manejar subida de imagen
    upload.single("image")(req, res, function (err) {
      if (err) {
        console.error("Error subiendo imagen:", err);
        return res.status(500).json({ message: "Error subiendo imagen" });
      }
      next(); // continuar al controlador
    });
  },

  bookController.createBook // 3️⃣ Controlador que guarda el libro
);

// ---------------- OBTENER LIBROS ----------------
router.get(
  "/",
  authMiddleware,        // Solo usuarios autenticados
  bookController.getBooks // Controlador que devuelve libros
);

// ---------------- ELIMINAR LIBRO ----------------
router.delete(
  "/:id",
  authMiddleware,          // Solo usuarios autenticados
  bookController.deleteBook // Controlador que elimina libro
);

// ============================================================
// EXPORTAR ROUTER
// ============================================================
module.exports = router;