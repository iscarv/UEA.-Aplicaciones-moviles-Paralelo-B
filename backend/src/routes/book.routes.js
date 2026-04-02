// ============================================================
// IMPORTS
// ============================================================

const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const bookController = require("../controllers/book.controller");
const authMiddleware = require("../middleware/auth.middleware");


// ============================================================
// CONFIGURACIÓN MULTER (SUBIDA DE IMÁGENES)
// ============================================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));

  }

});

const upload = multer({ storage });


// ============================================================
// MIDDLEWARE PARA MANEJAR ERRORES DE MULTER
// ============================================================

const uploadImage = (req, res, next) => {

  upload.single("image")(req, res, function (err) {

    if (err) {

      console.error("❌ Error subiendo imagen:", err);

      return res.status(500).json({
        message: "Error subiendo imagen"
      });

    }

    next();

  });

};


// ============================================================
// RUTAS DE LIBROS
// ============================================================


// ============================================================
// CREAR LIBRO
// ============================================================

router.post(
  "/",
  authMiddleware,
  uploadImage,
  bookController.createBook
);


// ============================================================
// OBTENER LIBROS
// ============================================================

router.get(
  "/",
  authMiddleware,
  bookController.getBooks
);


// ============================================================
// ACTUALIZAR LIBRO (EDITAR + FAVORITOS)
// ============================================================

router.put(
  "/:id",
  authMiddleware,
  uploadImage,
  bookController.updateBook
);


// ============================================================
// ELIMINAR LIBRO
// ============================================================

router.delete(
  "/:id",
  authMiddleware,
  bookController.deleteBook
);


// ============================================================
// EXPORTAR ROUTER
// ============================================================

module.exports = router;