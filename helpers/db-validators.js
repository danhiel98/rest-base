const { Category, Product } = require("../models");
const Role = require("../models/role");
const User = require("../models/user");

const isValidRole = async (role) => {
  const existsRole = await Role.findOne({ role });

  if (!existsRole) {
    throw new Error(`El rol '${role}' no existe`);
  }
};

const emailExists = async (email) => {
  // Verificar si el correo ya existe en la BD
  const existsEmail = await User.findOne({ email });

  if (existsEmail) {
    throw new Error(`El correo ya existe`);
  }
};

const userExists = async (id) => {
  const user = await User.findById(id);

  if (!(user && user.status)) {
    throw new Error("El usuario no existe");
  }
};

// Cuando se hace GET de una categoría
const categoryExists = async (id) => {
  const category = await Category.findById(id);

  if (!(category && category.status)) {
    throw new Error("La categoría no existe");
  }
};

// Devuelve error si la categoría ya existe
// Es para controlar cuando se quiere crear una nueva categoría
const categoryInDatabase = async (name) => {
  name = name.toUpperCase();

  const category = await Category.findOne({ name });

  if (category) {
    throw new Error(`La categoría ${name} ya fue creada anteriormente`);
  }
};

// Para verificar que la categoría exista antes de crear un producto
const isValidCategory = async (name) => {
  name = name.toUpperCase();

  const category = await Category.findOne({ name });

  if (!category) {
    throw new Error("La categoría no existe");
  }
};

const productExists = async (id) => {
  const product = await Product.findById(id);

  if (!(product && product.status)) {
    throw new Error("El producto no existe");
  }
};

const productInDatabase = async (name) => {
  const product = await Product.findOne({ name });

  if (product) {
    throw new Error(`El producto ${name} ya fue creado anteriormente`);
  }
};

const allowedCollections = async (collection, list = []) => {
  const includes = list.includes(collection);

  if (!includes) {
    throw new Error(
      `La colección ${collection} no es válida. Solo se permite: ${list}`
    );
  }
};

module.exports = {
  allowedCollections,
  categoryExists,
  categoryInDatabase,
  emailExists,
  isValidCategory,
  isValidRole,
  productExists,
  productInDatabase,
  userExists,
};
