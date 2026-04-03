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

    if (!user_id) {
      console.log("❌ Usuario no autenticado");
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    if (!title || !author) {
      return res.status(400).json({ message: "Título y autor son obligatorios" });
    }

    let imagePath = null;
    if (req.file) {
      imagePath = "/uploads/" + req.file.filename;
      console.log("🖼 Imagen subida:", imagePath);
    }

    const result = await Book.createBook({
      title,
      author,
      image: imagePath,
      user_id,
      favorite: 0,
      pages_total,
      pages_read,
      status,
      rating,
      personal_notes,
      chapter_notes,
      genres
    });

    return res.status(201).json({
      success: true,
      message: "Libro creado correctamente",
      id: result.insertId,
      image: imagePath,
      favorite: 0
    });

  } catch (error) {
    console.error("❌ Error createBook:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
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
    return res.status(500).json({ message: "Error obteniendo libros" });
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

    return res.json({ success: true, message: "Libro eliminado correctamente" });

  } catch (err) {
    console.error("❌ Error deleteBook:", err);
    return res.status(500).json({ message: "Error eliminando libro" });
  }
};

// ============================================================
// ACTUALIZAR LIBRO
// ============================================================
exports.updateBook = async (req, res) => {
  console.log("✏️ updateBook request");

  try {
    const { id } = req.params;

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
    if (!user_id) {
      console.log("❌ Usuario no autenticado");
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    let imagePath = null;
    if (req.file) {
      imagePath = "/uploads/" + req.file.filename;
      console.log("🖼 Nueva imagen:", imagePath);
    }

    // ====================================================
    // Construir objeto dinámico solo con campos definidos
    // ====================================================
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author;
    if (favorite !== undefined) updateData.favorite = favorite;
    if (pages_total !== undefined) updateData.pages_total = pages_total;
    if (pages_read !== undefined) updateData.pages_read = pages_read;
    if (status !== undefined) updateData.status = status;
    if (rating !== undefined) updateData.rating = rating;
    if (personal_notes !== undefined) updateData.personal_notes = personal_notes;
    if (chapter_notes !== undefined) updateData.chapter_notes = chapter_notes;
    if (genres !== undefined) updateData.genres = genres;
    if (imagePath) updateData.image = imagePath;

    // ====================================================
    // Actualizar updated_at automáticamente
    // ====================================================
    updateData.updated_at = new Date(); // ✅ Esto asegura que se actualice la columna

    await Book.updateBook(id, updateData);

    return res.json({ success: true, message: "Libro actualizado correctamente" });

  } catch (error) {
    console.error("❌ Error updateBook:", error);
    return res.status(500).json({ message: "Error actualizando libro" });
  }
};

// ============================================================
// OBTENER LIBROS ORDENADOS (para historial)
// ============================================================
exports.getRecentBooks = async (req, res) => {
  try {
    const user_id = req.user?.id;
    console.log("📚 Obteniendo lecturas recientes del usuario:", user_id);

    const limit = parseInt(req.query.limit) || 5;
    const books = await Book.getRecentBooks(user_id, limit);

    console.log(`📦 Últimas ${limit} lecturas encontradas:`, books.length);
    return res.json(books);

  } catch (err) {
    console.error("❌ Error getRecentBooks:", err);
    return res.status(500).json({ message: "Error obteniendo lecturas recientes" });
  }
};