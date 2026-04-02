// ================= IMPORT DB =================
const db = require("../config/db");


// ================= CREAR LIBRO =================
exports.createBook = async (data) => {

  const sql = `
    INSERT INTO books 
    (title, author, image, user_id, favorite)
    VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(sql, [
    data.title,
    data.author,
    data.image,
    data.user_id,
    data.favorite ?? 0
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

  // ====================================================
  // CASO 1: SOLO ACTUALIZAR FAVORITO
  // ====================================================
  if (data.favorite !== undefined && !data.title && !data.author && !data.image) {

    sql = `
      UPDATE books
      SET favorite = ?
      WHERE id = ?
    `;

    params = [data.favorite, id];

  }

  // ====================================================
  // CASO 2: ACTUALIZAR CON IMAGEN
  // ====================================================
  else if (data.image) {

    sql = `
      UPDATE books
      SET title = ?, author = ?, image = ?, favorite = ?
      WHERE id = ?
    `;

    params = [
      data.title,
      data.author,
      data.image,
      data.favorite ?? 0,
      id
    ];

  }

  // ====================================================
  // CASO 3: ACTUALIZAR SIN IMAGEN
  // ====================================================
  else {

    sql = `
      UPDATE books
      SET title = ?, author = ?, favorite = ?
      WHERE id = ?
    `;

    params = [
      data.title,
      data.author,
      data.favorite ?? 0,
      id
    ];

  }

  const [result] = await db.query(sql, params);

  return result;

};