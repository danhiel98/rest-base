const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersRoute = "/api/users";

    // Cargar los middlewares
    this.middlewares();

    // Establecer las rutas
    this.routes();
  }

  middlewares() {
    // Carpeta de archivos estáticos
    this.app.use(express.static("public"));

    // Lectura y parseo de parámetros
    this.app.use(express.json());

    // CORS
    this.app.use(cors());
  }

  routes() {
    this.app.use(this.usersRoute, require("../routes/user"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
    });
  }
}

module.exports = Server;
