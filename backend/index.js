// Cargar variables de entorno desde el archivo .env
require("dotenv").config();

// Importar Express para crear el servidor
const express = require("express");

// Importar CORS para permitir peticiones desde el frontend
const cors = require("cors");

// Importar rutas de autenticación
const authRoutes = require("./src/routes/auth.routes");

// Inicializar la aplicación Express
const app = express();

// Habilitar CORS para todas las rutas
app.use(cors());

// Permitir recibir y parsear JSON en el body de las solicitudes
app.use(express.json());

// Registrar rutas de autenticación bajo el prefijo /api/auth
app.use("/api/auth", authRoutes);

// Ruta raíz para verificar que la API está funcionando
app.get("/", (req, res) => {
  res.json({ message: "BookNotes API funcionando 🚀" });
});

// Iniciar el servidor en el puerto definido en el .env
app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto " + process.env.PORT);
});
