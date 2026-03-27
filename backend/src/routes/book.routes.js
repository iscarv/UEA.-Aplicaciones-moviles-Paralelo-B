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
    cb(null, "uploads/"); // Carpeta de almacenamiento
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Nombre único
  },
});

const upload = multer({ storage });


// ============================================================
// RUTAS DE LIBROS
// ============================================================

// ---------------- CREAR LIBRO ----------------
router.post(
  "/",
  authMiddleware,

  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err) {
        console.error("❌ Error subiendo imagen:", err);
        return res.status(500).json({ message: "Error subiendo imagen" });
      }
      next();
    });
  },

  bookController.createBook
);


// ---------------- OBTENER LIBROS ----------------
router.get(
  "/",
  authMiddleware,
  bookController.getBooks
);


// ---------------- ELIMINAR LIBRO ----------------
router.delete(
  "/:id",
  authMiddleware,
  bookController.deleteBook
);


// ---------------- ACTUALIZAR LIBRO (🔥 NUEVO) ----------------
router.put(
  "/:id",
  authMiddleware,

  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err) {
        console.error("❌ Error subiendo imagen:", err);
        return res.status(500).json({ message: "Error subiendo imagen" });
      }
      next();
    });
  },

  bookController.updateBook
);


// ============================================================
// EXPORTAR ROUTER
// ============================================================
module.exports = router;