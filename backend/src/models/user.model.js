const pool = require("../config/db");

module.exports = {
  create: async ({ name, email, password, role_id }) => {
    return pool.query(
      "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)",
      [name, email, password, role_id]
    );
  },

  findByEmail: async (email) => {
    return pool.query("SELECT * FROM users WHERE email = ?", [email]);
  },

  findById: async (id) => {
    return pool.query("SELECT * FROM users WHERE id = ?", [id]);
  },
};
