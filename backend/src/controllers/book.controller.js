// ============================================================
// IMPORT MODEL
// ============================================================

const Book = require("../models/book.model");


// ============================================================
// CREAR LIBRO
// ============================================================

exports.createBook = async (req, res) => {

  console.log("📩 Petición createBook recibida");
  console.log("REQ.USER:", req.user);
  console.log("BODY:", req.body); // para debug

  try {

    // ========================================================
    // LEER TODOS LOS CAMPOS QUE ENVÍA EL FRONTEND
    // ========================================================

    const {
      title,
      author,
      pages_total,
      pages_read,
      status,
      rating,
      personal_notes,
      chapter_notes,
      genres // ✅ NUEVO CAMPO (géneros del libro)
    } = req.body;

    const user_id = req.user?.id;

    // ========================================================
    // VALIDAR USUARIO
    // ========================================================

    if (!user_id) {
      console.log("❌ Usuario no autenticado");
      return res.status(401).json({
        message: "Usuario no autenticado"
      });
    }

    // ========================================================
    // VALIDAR CAMPOS OBLIGATORIOS
    // ========================================================

    if (!title || !author) {
      return res.status(400).json({
        message: "Título y autor son obligatorios"
      });
    }

    // ========================================================
    // MANEJO DE IMAGEN
    // ========================================================

    let imagePath = null;

    if (req.file) {
      imagePath = "/uploads/" + req.file.filename;
      console.log("🖼 Imagen subida:", imagePath);
    }

    // ========================================================
    // CREAR LIBRO EN BASE DE DATOS
    // ========================================================

    const result = await Book.createBook({
      title,
      author,
      image: imagePath,
      user_id,
      favorite: 0,

      // CAMPOS EXISTENTES
      pages_total,
      pages_read,
      status,
      rating,
      personal_notes,
      chapter_notes,

      // ✅ NUEVO CAMPO
      genres
    });

    // ========================================================
    // RESPUESTA
    // ========================================================

    return res.status(201).json({
      success: true,
      message: "Libro creado correctamente",
      id: result.insertId,
      image: imagePath,
      favorite: 0
    });

  } catch (error) {

    console.error("❌ Error createBook:", error);

    return res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};


// ============================================================
// OBTENER LIBROS
// ============================================================

exports.getBooks = async (req, res) => {

  try {

    const user_id = req.user?.id;

    console.log("📚 Obteniendo libros del usuario:", user_id);

    const books = await Book.getBooksByUser(user_id);

    console.log("📦 Libros encontrados:", books.length);

    return res.json(books);

  } catch (err) {

    console.error("❌ Error getBooks:", err);

    return res.status(500).json({
      message: "Error obteniendo libros"
    });
  }
};


// ============================================================
// ELIMINAR LIBRO
// ============================================================

exports.deleteBook = async (req, res) => {

  try {

    const { id } = req.params;

    console.log("🗑 Eliminando libro ID:", id);

    await Book.deleteBook(id);

    return res.json({
      success: true,
      message: "Libro eliminado correctamente"
    });

  } catch (err) {

    console.error("❌ Error deleteBook:", err);

    return res.status(500).json({
      message: "Error eliminando libro"
    });
  }
};


// ============================================================
// ACTUALIZAR LIBRO
// ============================================================

exports.updateBook = async (req, res) => {

  console.log("✏️ updateBook request");

  try {

    const { id } = req.params;

    // ========================================================
    // CAMPOS QUE PUEDE ACTUALIZAR
    // ========================================================

    const {
      title,
      author,
      favorite,
      pages_total,
      pages_read,
      status,
      rating,
      personal_notes,
      chapter_notes,
      genres // ✅ NUEVO CAMPO
    } = req.body;

    const user_id = req.user?.id;

    // ========================================================
    // VALIDAR USUARIO
    // ========================================================

    if (!user_id) {
      console.log("❌ Usuario no autenticado");

      return res.status(401).json({
        message: "Usuario no autenticado"
      });
    }

    // ========================================================
    // MANEJO DE NUEVA IMAGEN
    // ========================================================

    let imagePath = null;

    if (req.file) {
      imagePath = "/uploads/" + req.file.filename;
      console.log("🖼 Nueva imagen:", imagePath);
    }

    // ========================================================
    // ACTUALIZAR LIBRO EN BD
    // ========================================================

    await Book.updateBook(id, {
      title,
      author,
      favorite,
      pages_total,
      pages_read,
      status,
      rating,
      personal_notes,
      chapter_notes,
      genres, 
      image: imagePath
    });

    return res.json({
      success: true,
      message: "Libro actualizado correctamente"
    });

  } catch (error) {

    console.error("❌ Error updateBook:", error);

    return res.status(500).json({
      message: "Error actualizando libro"
    });
  }
};