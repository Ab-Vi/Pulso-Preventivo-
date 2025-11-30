const express = require("express");
const cors = require("cors");
const db = require("./db.js");

const app = express();
app.use(express.json());
app.use(cors());
// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "../Frontend/public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/public", "Menu.html")); 
});



// Logger 
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

//Index Login 
app.post("/api/Login", (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ error: "Usuario y contraseña son requeridos" });
  }

  db.query(
    "SELECT * FROM Login WHERE usuario = ? AND password = ?",
    [usuario, password],
    (err, resultado) => {
      if (err) {
        console.error("Error en la consulta:", err);
        return res.status(500).json({ error: "Error en la base de datos" });
      }

      if (resultado.length > 0) {
        // Usuario válido
        return res.json({ acceso: true, usuario: resultado[0].usuario });
      }
      // Usuario no encontrado
      return res.status(401).json({ acceso: false, mensaje: "Credenciales incorrectas" });
    }
  );
});

// Usuarios 
app.get("/api/Usuarios", (req, res) => {
  db.query("SELECT * FROM Login", (err, resultado) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }
    res.json(resultado);
  });
});

// AgendaPrev
app.post("/api/agenda", (req, res) => {
  const {
    lineaProduccion,
    equipo,
    tipoMantenimiento,
    descripcionTarea,
    tiempoEstimado,
    prioridad,
    tecnico,
    fecha
  } = req.body;

  // Validación 
  if (
    !lineaProduccion || !equipo || !tipoMantenimiento || !descripcionTarea ||
    !tiempoEstimado || !prioridad || !tecnico || !fecha
  ) {
    return res.status(400).json({ mensaje: "Todos los campos son requeridos" });
  }

  const sql = `
    INSERT INTO Agenda
    (lineaProduccion, equipo, tipoMantenimiento, descripcionTarea,
     tiempoEstimado, prioridad, tecnico, fecha)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const valores = [
    lineaProduccion, equipo, tipoMantenimiento, descripcionTarea,
    tiempoEstimado, prioridad, tecnico, fecha
  ];

  db.query(sql, valores, (err, resultado) => {
    if (err) {
      console.error("Error al insertar agenda:", err);
      return res.status(500).json({ mensaje: "Error en la base de datos" });
    }
    res.json({ mensaje: "Agenda registrada correctamente ", id: resultado.insertId });
  });
});

// Registro
app.post("/api/Registro", (req, res) => {
  const {
    lineaProduccion,
    equipo,
    tipoMantenimiento,
    descripcionTarea,
    tiempoUtilizado,
    estatus,
    tecnico,
    fecha,
    observaciones
  } = req.body;

  // Validación 
  if (
    !lineaProduccion || !equipo || !tipoMantenimiento || !descripcionTarea ||
    !tiempoUtilizado || !estatus || !tecnico || !fecha || !observaciones
  ) {
    return res.status(400).json({ mensaje: "Todos los campos son requeridos" });
  }

  const sql = `
    INSERT INTO Registro
    (lineaProduccion, equipo, tipoMantenimiento, descripcionTarea,
     tiempoUtilizado, estatus, tecnico, fecha, observaciones)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const valores = [
    lineaProduccion, equipo, tipoMantenimiento, descripcionTarea,
    tiempoUtilizado, estatus, tecnico, fecha, observaciones
  ];

  db.query(sql, valores, (err, resultado) => {
    if (err) {
      console.error("Error al insertar registro:", err.sqlMessage || err.message);
      return res.status(500).json({ mensaje: "Error en la base de datos", detalle: err.sqlMessage || err.message });
    }
    res.json({ mensaje: "Registro guardado correctamente ", id: resultado.insertId });
  });
});

// Historial
app.get("/api/Historial", (req, res) => {
  db.query("SELECT * FROM Registro ORDER BY fecha DESC", (err, resultado) => {
    if (err) {
      console.error("Error al consultar historial:", err.sqlMessage || err.message);
      return res.status(500).json({ mensaje: "Error en la base de datos" });
    }
    res.json(resultado);
  });
});
app.get("/api/test-db", (req, res) => {
  db.query("SELECT 1 + 1 AS resultado", (err, results) => {
    if (err) {
      console.error(" Error en la consulta de prueba:", err.message);
      return res.status(500).json({ error: "Error en la base de datos", detalle: err.message });
    }
    res.json({ mensaje: "Conexión exitosa con Railway", resultado: results[0].resultado });
  });
});

// Iniciar servidor
const path = require("path");

//app.get("/", (req, res) => {
  //res.sendFile(path.join(__dirname, "public", "index.html"));
//});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});






