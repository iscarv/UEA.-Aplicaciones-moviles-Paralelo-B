// ============================================================
// IMPORTS
// ============================================================

// Librería para trabajar con JWT (tokens)
const jwt = require("jsonwebtoken");

// Cargar variables de entorno (.env)
require("dotenv").config();


/*
====================================================
MIDDLEWARE DE AUTENTICACIÓN
====================================================

Este middleware protege rutas privadas verificando el JWT.

Flujo:
1. Lee el header Authorization
2. Verifica que exista y tenga formato "Bearer TOKEN"
3. Extrae el token
4. Valida el token con JWT_SECRET
5. Si es válido → agrega req.user
6. Si falla → responde 401
*/


function authMiddleware(req, res, next) {

  // ============================================================
  // OBTENER HEADER
  // ============================================================

  const authHeader = req.headers.authorization;

  // DEBUG CLAVE (ver si llega desde el frontend)
  console.log("HEADER AUTH:", authHeader);


  // ============================================================
  // VALIDAR HEADER
  // ============================================================

  if (!authHeader || !authHeader.startsWith("Bearer ")) {

    console.log("❌ No llegó token o formato incorrecto");

    return res.status(401).json({
      message: "No autorizado: Token requerido"
    });

  }


  // ============================================================
  // EXTRAER TOKEN
  // ============================================================

  const token = authHeader.split(" ")[1];


  // ============================================================
  // VERIFICAR TOKEN
  // ============================================================

  try {

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // DEBUG (ver si el token es válido)
    console.log("✅ TOKEN VÁLIDO:", payload);


    // Guardar usuario en request
    req.user = { id: payload.id };


    // Continuar al controlador
    next();

  } catch (error) {

    console.log("❌ Token inválido o expirado:", error.message);

    return res.status(401).json({
      message: "Token inválido o expirado"
    });

  }

}


// ============================================================
// EXPORT
// ============================================================

module.exports = authMiddleware;