// ================= USER MODEL =================
// Modelo de usuario para MySQL
// ============================================

// Importa pool de conexión a MySQL
const pool = require("../config/db");

module.exports = {

  /**
   * Crea un nuevo usuario en la base de datos
   * @param {Object} param0
   * @param {string} param0.name - Nombre del usuario
   * @param {string} param0.email - Correo electrónico del usuario
   * @param {string} param0.password - Contraseña hasheada (ya viene desde el controlador)
   * @param {number} param0.role_id - Rol del usuario (1=Usuario por defecto)
   * @returns {Promise<any>} Resultado de la inserción en MySQL
   */
  create: async ({ name, email, password, role_id }) => {
    try {
      // Inserta el usuario en la tabla 'users'
      // pool.query devuelve [rows, fields]; aquí devolvemos solo rows
      const [rows] = await pool.query(
        "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)",
        [name, email, password, role_id]
      );
      return rows;
    } catch (err) {
      console.error("Error en create:", err);
      throw err; // Lanzamos error para que el controlador lo maneje
    }
  },

  /**
   * Busca usuarios por correo electrónico
   * Usado en login y checkEmail
   * @param {string} email - Correo a buscar
   * @returns {Promise<Array>} Array de usuarios encontrados (vacío si no existe)
   */
  findByEmail: async (email) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      return Array.isArray(rows) ? rows : [];
    } catch (err) {
      console.error("Error en findByEmail:", err);
      return []; // Evita que la app crashee
    }
  },

  /**
   * Busca usuarios por ID
   * Usado en /auth/me para obtener perfil del usuario
   * @param {number} id - ID del usuario
   * @returns {Promise<Array>} Array con el usuario encontrado (vacío si no existe)
   */
  findById: async (id) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM users WHERE id = ?",
        [id]
      );
      return Array.isArray(rows) ? rows : [];
    } catch (err) {
      console.error("Error en findById:", err);
      return [];
    }
  },

};