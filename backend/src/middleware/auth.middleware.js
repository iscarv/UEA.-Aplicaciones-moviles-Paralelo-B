// Importa la librería JWT para verificar tokens
const jwt = require("jsonwebtoken");

// Carga las variables de entorno definidas en el archivo .env
require("dotenv").config();

/*
================= MIDDLEWARE DE AUTENTICACIÓN =================

Este middleware protege rutas privadas verificando el JWT enviado
por el cliente. Se usa en rutas que requieren usuario autenticado.

Flujo:
1. Verifica que exista el header Authorization y comience con "Bearer "
2. Extrae el token
3. Verifica el token con la clave secreta definida en .env
4. Si es válido, agrega el payload a req.user
5. Si falla, responde 401 con mensaje de error
*/
function authMiddleware(req, res, next) {
  // Obtiene el header Authorization enviado desde el frontend
  // Ejemplo esperado: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;

  // Si no existe el header o no inicia con "Bearer " → acceso denegado
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No autorizado: Token requerido" });
  }

  // Extrae únicamente el token eliminando la palabra "Bearer"
  const token = authHeader.split(" ")[1];

  try {
    // Verifica el token usando la clave secreta definida en .env
    // Si el token es válido devuelve el payload
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Guarda el payload del usuario dentro del request
    // Esto permite que los controladores sepan qué usuario está autenticado
    req.user = { id: payload.id }; // solo almacenamos el id por seguridad

    // Permite continuar hacia la siguiente función (controlador o middleware)
    next();
  } catch (error) {
    // Si el token es inválido, expiró o fue alterado
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

// Exporta el middleware para usarlo en rutas privadas
module.exports = authMiddleware;