// Importa el modelo de usuario para acceder a la base de datos
const User = require("../models/user.model");

// Librería para encriptar y comparar contraseñas
const bcrypt = require("bcryptjs");

// Librería para generar tokens JWT
const jwt = require("jsonwebtoken");

// ================= REGISTRO =================
exports.register = async (req, res) => {
  try {
    // Extrae los datos enviados desde el frontend
    let { name, email, password, role_id } = req.body;

    // Elimina espacios en blanco al inicio y final
    name = name?.trim();
    email = email?.trim();

    // Valida que los campos obligatorios estén completos
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verifica si el correo ya existe en la base de datos
    const [existing] = await User.findByEmail(email);
    if (existing.length) {
      return res.status(400).json({ message: "Correo ya registrado" });
    }

    // Encripta la contraseña antes de guardarla
    const hash = bcrypt.hashSync(password, 8);

    // Crea el usuario en la base de datos con el rol recibido del frontend
    await User.create({
      name,
      email,
      password: hash,
      role_id: role_id || 1, // Si no llega rol, se asigna Usuario por defecto
    });

    // Respuesta exitosa al frontend
    res.status(201).json({ message: "Usuario registrado correctamente" });

  } catch (err) {
    // Muestra el error en consola
    console.error(err);

    // Envía mensaje genérico de error
    res.status(500).json({ message: "Error del servidor" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    // Obtiene correo y contraseña enviados
    const { email, password } = req.body;

    // Busca el usuario por correo
    const [rows] = await User.findByEmail(email);

    // Si no existe el usuario
    if (!rows.length) {
      return res.status(401).json({ message: "Correo o contraseña incorrecta" });
    }

    // Compara la contraseña ingresada con la encriptada
    const valid = bcrypt.compareSync(password, rows[0].password);

    // Si no coincide la contraseña
    if (!valid) {
      return res.status(401).json({ message: "Correo o contraseña incorrecta" });
    }

    // Genera el token JWT con el id del usuario
    const token = jwt.sign(
      { id: rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Devuelve el token al frontend
    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// ================= PERFIL (ME) =================
exports.me = async (req, res) => {
  try {
    // Busca al usuario usando el id obtenido del token
    const [rows] = await User.findById(req.user.id);

    // Si no se encuentra el usuario
    if (!rows.length) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Construye el objeto de respuesta sin incluir contraseña
    const user = {
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      role_id: rows[0].role_id,
    };

    // Envía los datos del usuario al frontend
    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// ================= VALIDACIÓN ASÍNCRONA DE CORREO =================
exports.checkEmail = async (req, res) => {
  // Obtiene el correo desde los parámetros de la URL
  const email = req.params.email;

  // Busca si existe un usuario con ese correo
  const [rows] = await User.findByEmail(email);

  // Devuelve true si existe, false si no
  res.json({ exists: rows.length > 0 });
};

