const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");
const fileUpload = require("express-fileupload");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      usersRoute: "/api/users",
      authRoute: "/api/auth",
      categoriesRoute: "/api/categories",
      productsRoute: "/api/products",
      searchRoute: "/api/search",
      uploads: "/api/uploads",
    };

    // Crear conexión con DB
    this.connectDB();

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

    // Carga de archivos
    this.app.use(
      fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
        createParentPath: true,
        tempFileDir: "/tmp/",
        useTempFiles: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.authRoute, require("../routes/auth"));
    this.app.use(this.paths.usersRoute, require("../routes/user"));
    this.app.use(this.paths.categoriesRoute, require("../routes/category"));
    this.app.use(this.paths.productsRoute, require("../routes/product"));
    this.app.use(this.paths.searchRoute, require("../routes/search"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
    });
  }

  async connectDB() {
    await dbConnection();
  }
}

module.exports = Server;
