const { Schema, model } = require("mongoose");
const Role = require("../models/role");

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  email: {
    type: String,
    required: [true, "El correo electrónico es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
  // Para controlar estado de eliminado
  status: {
    type: Boolean,
    default: true,
  },
  // Para saber si el usuario fue creado por google
  google: {
    type: Boolean,
    default: false,
  },
});

// Quitar atributos password y __v al devolver el objeto del usuario
UserSchema.methods.toJSON = function () {
  const { __v, _id, password, ...user } = this.toObject();

  user.uid = _id;

  return user;
};

UserSchema.methods.populate = function (params) {
  console.log("Se ha hecho population", params);
};

module.exports = model("User", UserSchema);
