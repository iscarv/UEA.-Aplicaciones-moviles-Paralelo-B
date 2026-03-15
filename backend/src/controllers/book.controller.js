// ============================================================
// IMPORT MODEL
// ============================================================

const Book = require("../models/book.model");


/*
====================================================
CONTROLADOR DE LIBROS
====================================================

Funciones disponibles:

✔ createBook
✔ getBooks
✔ deleteBook
*/


// ============================================================
// CREAR LIBRO
// ============================================================

exports.createBook = (req, res) => {

  console.log("Petición createBook recibida");

  try {

    const { title, author } = req.body;

    const user_id = req.user.id;


    // ================= VALIDACIÓN =================

    if (!title || !author) {

      return res.status(400).json({
        message: "Título y autor son obligatorios"
      });

    }


    // ================= IMAGEN =================

    let imagePath = null;

    if (req.file) {

      imagePath = "/uploads/" + req.file.filename;

      console.log("Imagen subida:", imagePath);

    }


    // ================= GUARDAR LIBRO =================

    Book.createBook(

      {
        title,
        author,
        image: imagePath,
        user_id
      },

      (err, result) => {

        if (err) {

          console.error("Error DB:", err);

          return res.status(500).json({
            message: "Error en base de datos"
          });

        }


        // ================= RESPUESTA =================

        res.status(201).json({
          message: "Libro creado correctamente",
          id: result.insertId,
          image: imagePath
        });

      }

    );

  } catch (error) {

    console.error("Error en createBook:", error);

    res.status(500).json({
      message: "Error interno del servidor"
    });

  }

};



// ============================================================
// OBTENER LIBROS
// ============================================================

exports.getBooks = (req, res) => {

  const user_id = req.user.id;

  console.log("Obteniendo libros del usuario:", user_id);


  Book.getBooksByUser(user_id, (err, books) => {

    if (err) {

      console.error("Error obteniendo libros:", err);

      return res.status(500).json({
        message: "Error obteniendo libros"
      });

    }


    /*
    =====================================================
    CORRECCIÓN SEGURA PARA IMÁGENES
    =====================================================

    Creamos un nuevo arreglo con URLs completas
    sin modificar los datos originales.
    */

    const host = req.protocol + "://" + req.headers.host;

    const booksFormatted = books.map((book) => ({

      ...book,

      image: book.image
        ? host + book.image
        : null

    }));


    res.json(booksFormatted);

  });

};



// ============================================================
// ELIMINAR LIBRO
// ============================================================

exports.deleteBook = (req, res) => {

  const { id } = req.params;

  console.log("Eliminando libro ID:", id);


  Book.deleteBook(id, (err) => {

    if (err) {

      console.error("Error eliminando libro:", err);

      return res.status(500).json({
        message: "Error eliminando libro"
      });

    }

    res.json({
      message: "Libro eliminado correctamente"
    });

  });

};