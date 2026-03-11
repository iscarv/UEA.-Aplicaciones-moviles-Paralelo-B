// ================= CARGA DE ENTORNO =================
// Cargar variables de entorno desde el archivo .env
require("dotenv").config();

// ================= IMPORTS =================
const express = require("express");       // Servidor web
const cors = require("cors");             // Permite solicitudes desde el frontend
const authRoutes = require("./src/routes/auth.routes"); // Rutas de autenticación

// ================= INICIALIZACIÓN DEL SERVIDOR =================
const app = express();
const PORT = process.env.PORT || 3000;   // Puerto configurable desde .env o 3000 por defecto

// ================= MIDDLEWARES =================
// Habilitar CORS para todas las rutas
app.use(cors());

// Permite parsear JSON en las solicitudes entrantes
app.use(express.json());

// ================= RUTAS =================
// Prefijo para todas las rutas de autenticación
app.use("/api/auth", authRoutes);

// Ruta raíz de prueba para verificar que la API funciona
app.get("/", (req, res) => {
  res.json({ message: "BookNotes API funcionando 🚀" });
});

// Ruta de health check (útil para evidencias del taller o monitoreo)
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// ================= INICIO DEL SERVIDOR =================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Acceso desde navegador: http://localhost:${PORT}`);
});