// Importa el pool de conexión a la base de datos
const pool = require("../config/db");

module.exports = {

  // Crea un nuevo usuario en la base de datos
  create: async ({ name, email, password, role_id }) => {
    return pool.query(
      // Inserta los datos del usuario incluyendo el rol
      "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)",
      [name, email, password, role_id]
    );
  },

  // Busca un usuario por correo (usado en login y registro)
  findByEmail: async (email) => {
    return pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
  },

  // Busca un usuario por ID (usado en /auth/me)
  findById: async (id) => {
    return pool.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
  },
};
