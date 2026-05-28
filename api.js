const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 8080;
const cors = require("cors");

const url =
  "mongodb+srv://oscpalma_db_user:soyLaPass123456@cluster0.a60lnid.mongodb.net/actividad_fullstackIII?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(url)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(PORT, () => console.log(`App listen at port ${PORT} 💻`));
  })
  .catch((error) => console.error("Error al conectar a MongoDB:", error));

// Middleware
app.use(express.json());
app.use(cors());

// Importar rutas
const userRoutes = require("./src/routes/user.routes");
// Rutas
app.use(`/api/v1/user`, userRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  // Errores de autenticación de express-jwt
  if (err.name === "UnauthorizedError") {
    return res
      .status(401)
      .json({ message: "No estás autorizado. Token inválido o ausente." });
  }

  console.error("Error no controlado:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint no encontrado" });
});

/*
El problema era que Node.js tiene su propio resolvedor DNS interno que no usa el DNS configurado en Windows.

Cuando cambias el DNS en la configuración de red de Windows a 8.8.8.8, eso afecta al sistema operativo y los navegadores, pero Node.js resuelve DNS de forma independiente usando las librerías del sistema de bajo nivel, que en tu caso seguían apuntando al DNS de tu red (probablemente del router o ISP) que no soporta registros SRV.

El protocolo mongodb+srv:// necesita hacer una consulta DNS especial llamada SRV record para descubrir las IPs del cluster. Tu DNS local la rechazaba (ECONNREFUSED).

Al agregar esto al inicio del código:


dns.setServers(['8.8.8.8', '8.8.4.4'])
Forzamos a Node.js a usar el DNS de Google directamente, que sí soporta registros SRV, y la consulta funcionó correctamente.
*/
