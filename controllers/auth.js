const { response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const { generateJWT } = require("../helpers/generate-jwt");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar si el correo existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "Usuario / Password incorrecto(s) - email",
      });
    }

    // Verificar que el usuario se encuentre activo

    if (!user.status) {
      return res.status(400).json({
        msg: "Usuario / Password incorrecto(s) - status",
      });
    }

    // Verificar la contraseña

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password incorrecto(s) - password",
      });
    }

    // Generar el JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error interno",
    });
  }
};

module.exports = {
  login,
};
