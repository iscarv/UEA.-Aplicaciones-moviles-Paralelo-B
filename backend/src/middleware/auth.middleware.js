// Importa la librería JWT para validar tokens
const jwt = require("jsonwebtoken");

// Carga las variables de entorno desde el archivo .env
require("dotenv").config();

// Middleware de autenticación
module.exports = (req, res, next) => {

  // Obtiene el header Authorization enviado desde el frontend
  const authHeader = req.headers.authorization;

  // Si no existe el header, se bloquea el acceso
  if (!authHeader) return res.status(401).json({ message: "Token requerido" });

  // Extrae únicamente el token (Bearer TOKEN)
  const token = authHeader.split(" ")[1];

  try {
    // Verifica el token usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guarda el id del usuario dentro del request
    req.user = { id: decoded.id };

    // Permite continuar hacia el controlador
    next();

  } catch {
    // Si el token es inválido o expiró
    return res.status(401).json({ message: "Token inválido" });
  }
};
