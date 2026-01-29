const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    let { name, email, password, role_id } = req.body;

    // Limpiar espacios
    name = name?.trim();
    email = email?.trim();

    // Validar campos
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar correo existente
    const [existing] = await User.findByEmail(email);
    if (existing.length) {
      return res.status(400).json({ message: "Correo ya registrado" });
    }

    // Encriptar contraseña
    const hash = bcrypt.hashSync(password, 8);

    // Crear usuario con rol desde frontend
    await User.create({
      name,
      email,
      password: hash,
      role_id: role_id || 1, // 👈 recibe Picker (default Usuario)
    });

    res.status(201).json({ message: "Usuario registrado correctamente" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await User.findByEmail(email);
    if (!rows.length) {
      return res.status(401).json({ message: "Correo o contraseña incorrecta" });
    }

    const valid = bcrypt.compareSync(password, rows[0].password);
    if (!valid) {
      return res.status(401).json({ message: "Correo o contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// ================= ME =================
exports.me = async (req, res) => {
  try {
    const [rows] = await User.findById(req.user.id);

    if (!rows.length) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = {
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      role_id: rows[0].role_id,
    };

    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
};


