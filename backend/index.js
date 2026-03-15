// ================= CARGA DE ENTORNO =================
// Cargar variables de entorno desde el archivo .env
require("dotenv").config();

// ================= IMPORTS =================
const express = require("express");       // Framework del servidor
const cors = require("cors");             // Permite solicitudes desde el frontend
const path = require("path");             // Manejo de rutas de archivos

const authRoutes = require("./src/routes/auth.routes");   // Rutas de autenticación
const bookRoutes = require("./src/routes/book.routes");   // Rutas de libros


// ================= INICIALIZACIÓN DEL SERVIDOR =================
const app = express();

// Puerto del servidor
const PORT = process.env.PORT || 3000;


// ================= MIDDLEWARES =================

/*
====================================================
CORS
====================================================

Permite que el frontend (Expo / Web)
pueda comunicarse con el backend.

Esto evita errores de tipo:

AxiosError
Network Error
Blocked by CORS
*/

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


/*
====================================================
BODY PARSER
====================================================

Permite recibir:

✔ JSON
✔ form-data (cuando subimos imágenes)
*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/*
====================================================
SERVIR CARPETA DE IMÁGENES
====================================================

Esto permite acceder a las imágenes subidas
con Multer desde el navegador o la app.

Ejemplo de acceso:

http://192.168.100.10:3000/uploads/imagen.jpg
*/

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ================= RUTAS =================

/*
Prefijo para rutas de autenticación

Ejemplo:
POST /api/auth/login
POST /api/auth/register
*/
app.use("/api/auth", authRoutes);


/*
Prefijo para rutas de libros

Ejemplo:
GET /api/books
POST /api/books
DELETE /api/books/:id
*/
app.use("/api/books", bookRoutes);


// ================= RUTA DE PRUEBA =================

/*
Sirve para verificar rápidamente
si el servidor está funcionando.
*/

app.get("/", (req, res) => {
  res.json({ message: "BookNotes API funcionando 🚀" });
});


// ================= HEALTH CHECK =================

/*
Ruta útil para verificar
si el servidor está activo.
*/

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date()
  });
});


// ================= INICIAR SERVIDOR =================

app.listen(PORT, () => {

  console.log("=======================================");
  console.log("🚀 BookNotes API iniciada");
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`📚 API: http://localhost:${PORT}/api`);
  console.log("=======================================");

});