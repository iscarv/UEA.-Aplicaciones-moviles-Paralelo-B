// Carga las variables de entorno desde el archivo .env
require('dotenv').config();
// Importa la librería mysql2 para conectarse a MySQL
const mysql = require("mysql2");
// Crea un pool de conexiones a la base de datos
const pool = mysql.createPool({
  // Host de la base de datos (ej: localhost)
  host: process.env.DB_HOST,
  // Usuario de la base de datos
  user: process.env.DB_USER,
   // Contraseña del usuario
  password: process.env.DB_PASSWORD,
  // Nombre de la base de datos
  database: process.env.DB_NAME,
  // Puerto de MySQL (por defecto 3306)
  port: process.env.DB_PORT || 3306,
  // Permite esperar si no hay conexiones disponibles
  waitForConnections: true,
  // Número máximo de conexiones simultáneas
  connectionLimit: 10,
  // Límite de peticiones en cola (0 = ilimitado)
  queueLimit: 0
});
// Exporta el pool usando promesas para poder usar async/await
module.exports = pool.promise();
