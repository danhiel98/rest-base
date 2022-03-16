const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    // Crear conexión a base de datos
    await mongoose.connect(process.env.MONGO_CNN);

    console.log("Base de datos online");
  } catch (error) {
    console.log("Error al inicializar la base de datos", error);
  }
};

module.exports = {
  dbConnection,
};
