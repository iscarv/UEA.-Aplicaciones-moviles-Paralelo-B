// ================= IMPORT DB =================
const db = require("../config/db");


// ================= CREAR LIBRO =================
exports.createBook = async (data) => {

  const sql = `
    INSERT INTO books 
    (title, author, image, user_id)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db.query(sql, [
    data.title,
    data.author,
    data.image,
    data.user_id
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

  return rows;
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

  let sql;
  let params;

  // Si hay nueva imagen
  if (data.image) {

    sql = `
      UPDATE books
      SET title = ?, author = ?, image = ?
      WHERE id = ?
    `;

    params = [data.title, data.author, data.image, id];

  } else {

    sql = `
      UPDATE books
      SET title = ?, author = ?
      WHERE id = ?
    `;

    params = [data.title, data.author, id];

  }

  const [result] = await db.query(sql, params);

  return result;
};