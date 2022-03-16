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

module.exports = {
  isValidRole,
  emailExists,
  userExists,
};
