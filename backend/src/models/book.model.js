// ================= IMPORT DB =================
const db = require("../config/db");

// ================= CREAR LIBRO =================
exports.createBook = async (data) => {
  const sql = `
    INSERT INTO books 
    (title, author, image, user_id, favorite, pages_total, pages_read, status, rating, personal_notes, chapter_notes, genres)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(sql, [
    data.title,
    data.author,
    data.image,
    data.user_id,
    data.favorite ?? 0,
    data.pages_total ?? 0,
    data.pages_read ?? 0,
    data.status ?? "Por leer",
    data.rating ?? 0,
    data.personal_notes ?? "",
    data.chapter_notes ? JSON.stringify(data.chapter_notes) : "{}",
    data.genres ? JSON.stringify(data.genres) : "[]"
  ]);

  return result;
};

// ================= OBTENER LIBROS POR USUARIO =================
exports.getBooksByUser = async (userId) => {
  const sql = `
    SELECT * FROM books
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;
  const [rows] = await db.query(sql, [userId]);

  // Parsear JSON de chapter_notes y genres antes de retornar
  return rows.map((row) => ({
    ...row,
    chapter_notes: row.chapter_notes ? JSON.parse(row.chapter_notes) : {},
    genres: row.genres ? JSON.parse(row.genres) : []
  }));
};

// ================= ELIMINAR LIBRO =================
exports.deleteBook = async (id) => {
  const sql = `
    DELETE FROM books
    WHERE id = ?
  `;
  const [result] = await db.query(sql, [id]);
  return result;
};

// ================= ACTUALIZAR LIBRO =================
exports.updateBook = async (id, data) => {
  const fields = [];
  const values = [];

  // ================= FILTRAR CAMPOS DEFINIDOS =================
  for (const key of [
    "title",
    "author",
    "favorite",
    "pages_total",
    "pages_read",
    "status",
    "rating",
    "personal_notes",
    "chapter_notes",
    "genres",
    "image",
    "updated_at"  // ✅ Aseguramos que se actualice
  ]) {
    if (data[key] !== undefined && data[key] !== null) {
      // Serializar JSON de campos que lo requieren
      if (key === "chapter_notes") values.push(JSON.stringify(data[key] || {}));
      else if (key === "genres") values.push(JSON.stringify(data[key] || []));
      else if (key === "updated_at") values.push(data[key]); // Date o ISO string directo
      else values.push(data[key]);
      fields.push(`${key} = ?`);
    }
  }

  if (fields.length === 0) return; // nada que actualizar

  const sql = `UPDATE books SET ${fields.join(", ")} WHERE id = ?`;
  values.push(id);

  const [result] = await db.query(sql, values);
  return result;
};

// ============================================================
// OBTENER ÚLTIMAS LECTURAS
// ============================================================
exports.getRecentBooks = async (user_id, limit = 5) => {
  try {
    const [rows] = await db.execute(
      `SELECT * 
       FROM books 
       WHERE user_id = ? 
       ORDER BY updated_at DESC 
       LIMIT ?`,
      [user_id, limit]
    );
    // Parsear JSON de chapter_notes y genres
    return rows.map((row) => ({
      ...row,
      chapter_notes: row.chapter_notes ? JSON.parse(row.chapter_notes) : {},
      genres: row.genres ? JSON.parse(row.genres) : []
    }));
  } catch (err) {
    console.error("❌ Error getRecentBooks en modelo:", err);
    return [];
  }
};