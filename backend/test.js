// Importa la conexión a la base de datos
const db = require("./src/config/db");

// Función asíncrona para probar la conexión a la base de datos
async function test() {
  try {
    // Ejecuta una consulta simple para verificar que la conexión funciona
    const [rows] = await db.query("SELECT 1+1 AS result");

    // Si todo va bien, imprime el resultado
    console.log("Conexión OK:", rows[0].result);
  } catch (err) {
    // Si hay un error, mostrarlo en consola
    console.log("Error:", err);
  }
}

// Ejecuta la función de prueba
test();

