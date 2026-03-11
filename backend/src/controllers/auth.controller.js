// ================= AUTH CONTROLLER =================
// Controlador de autenticación y gestión de usuarios

const User = require("../models/user.model"); // Modelo de usuario
const bcrypt = require("bcryptjs");           // Para encriptar y comparar contraseñas
const jwt = require("jsonwebtoken");          // Para generar JWT

// ================= REGISTRO =================
exports.register = async (req, res) => {
  try {
    let { name, email, password, role_id } = req.body;

    // Elimina espacios en blanco
    name = name?.trim();
    email = email?.trim();

    // Validación de campos obligatorios
    if (!name || !email || !password) {
      console.warn("Campos obligatorios faltantes:", { name, email, password });
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verifica si el correo ya existe
    console.log("Verificando si el correo ya existe:", email);
    const existing = await User.findByEmail(email); // Devuelve array de usuarios
    if (Array.isArray(existing) && existing.length > 0) {
      console.warn("Correo ya registrado:", email);
      return res.status(400).json({ message: "Correo ya registrado" });
    }

    // Encripta la contraseña de manera asíncrona (no bloquea el event loop)
    console.log("Encriptando contraseña...");
    const hash = await bcrypt.hash(password, 8);

    // Crea el usuario en la base de datos
    console.log("Creando usuario en la base de datos...");
    await User.create({
      name,
      email,
      password: hash,      // contraseña ya hasheada
      role_id: role_id || 1, // rol por defecto si no se envía
    });

    console.log("Usuario registrado correctamente:", email);

    // Devuelve mensaje de éxito para que el frontend redirija a login
    res.status(201).json({
      message: "Usuario registrado correctamente. Por favor inicie sesión."
    });

  } catch (err) {
    console.error("Error en register:", err);
    res.status(500).json({ message: "Error interno del servidor", error: err.message });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Intentando login para:", email);

    // Busca el usuario por correo
    const rows = await User.findByEmail(email);
    const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!user) {
      console.warn("Usuario no encontrado:", email);
      return res.status(401).json({ message: "Correo o contraseña incorrecta" });
    }

    // Compara contraseña ingresada con la almacenada
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.warn("Contraseña incorrecta para:", email);
      return res.status(401).json({ message: "Correo o contraseña incorrecta" });
    }

    // Genera token JWT
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    console.log("Login exitoso:", email);

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id
      }
    });

  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error interno del servidor", error: err.message });
  }
};

// ================= PERFIL (ME) =================
exports.me = async (req, res) => {
  try {
    console.log("Obteniendo perfil del usuario ID:", req.user?.id);

    const rows = await User.findById(req.user?.id);
    const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!user) {
      console.warn("Usuario no encontrado ID:", req.user?.id);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Devuelve datos sin contraseña
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role_id: user.role_id
    });

  } catch (err) {
    console.error("Error en me:", err);
    res.status(500).json({ message: "Error interno del servidor", error: err.message });
  }
};

// ================= VALIDACIÓN DE CORREO =================
exports.checkEmail = async (req, res) => {
  try {
    const email = req.params.email;
    console.log("Comprobando existencia de correo:", email);

    const rows = await User.findByEmail(email);
    const exists = Array.isArray(rows) && rows.length > 0;

    res.json({ exists });
  } catch (err) {
    console.error("Error en checkEmail:", err);
    res.status(500).json({ message: "Error al comprobar correo", error: err.message });
  }
};