// ================= IMPORT MODEL =================

const db = require("../config/db"); // o tu conexión a la BD


// ============================================
// OBTENER TODOS LOS USUARIOS
// ============================================

exports.getAllUsers = async (req, res) => {

  try {

    // ============================================
    // VERIFICAR SI ES ADMIN
    // ============================================

    if (!req.user || req.user.role !== 2) {

      return res.status(403).json({
        message: "Acceso solo para administradores"
      });

    }

    // ============================================
    // CONSULTA USUARIOS
    // ============================================

    const [users] = await db.query(`
      SELECT id, name, email, role_id
      FROM users
      ORDER BY id
    `);

    res.json(users);

  } catch (error) {

    console.error("❌ Error obteniendo usuarios:", error);

    res.status(500).json({
      message: "Error obteniendo usuarios"
    });

  }

};