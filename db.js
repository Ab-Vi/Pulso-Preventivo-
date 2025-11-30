const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});




conexion.connect((err) => {
  if (err) {
    console.error("Error en la conexión con MySQL", err);
    return;
  }
  console.log("Conexión exitosa con MySQL");
});

module.exports = conexion;

