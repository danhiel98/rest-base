const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");

const userGET = async (req = request, res = response) => {
  const { start = 0, limit = 5 } = req.query;

  const query = { status: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(start).limit(limit),
  ]);

  res.json({
    start,
    limit,
    total,
    users,
  });
};

const userPOST = async (req, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // Hashear contraseña
  const salt = bcryptjs.genSaltSync(10);
  user.password = bcryptjs.hashSync(password, salt);

  await user.save();

  res.json({
    user,
  });
};

const userPUT = async (req, res = response) => {
  const { id } = req.params;
  const { _id, email, password, google, ...rest } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync(10);
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, rest);

  res.json({
    user,
  });
};

const userPATCH = (req, res = response) => {
  res.json({
    msg: "PATCH api - controller",
  });
};

const userDELETE = async (req, res = response) => {
  const { id } = req.params;

  console.log("Pasamos a la opción de eliminar");
  // Obtener el uid del usuario autenticado
  const { uid, authenticatedUser } = req;

  // Borrar usuario físicamente (No recomendado)
  // const user = await User.findByIdAndDelete(id);

  // Actualizar estado del usuario

  const user = await User.findByIdAndUpdate(id, { status: false });

  res.json({
    user,
    authenticatedUser,
  });
};

module.exports = {
  userGET,
  userPOST,
  userPUT,
  userPATCH,
  userDELETE,
};
