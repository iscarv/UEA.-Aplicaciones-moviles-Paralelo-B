const db = require("./src/config/db");

async function test() {
  try {
    const [rows] = await db.query("SELECT 1+1 AS result");
    console.log("Conexión OK:", rows[0].result);
  } catch (err) {
    console.log("Error:", err);
  }
}

test();
