// ================= IMPORT DB =================
const db = require("../config/db");

// ================= CREAR LIBRO =================
exports.createBook = (data, callback) => {

  const sql = `
    INSERT INTO books 
    (title, author, image, user_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [data.title, data.author, data.image, data.user_id],
    callback
  );
};

// ================= OBTENER LIBROS POR USUARIO =================
exports.getBooksByUser = (userId, callback) => {

  const sql = `
    SELECT * FROM books
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [userId], callback);
};

// ================= ELIMINAR LIBRO =================
exports.deleteBook = (id, callback) => {

  const sql = `
    DELETE FROM books
    WHERE id = ?
  `;

  db.query(sql, [id], callback);
};