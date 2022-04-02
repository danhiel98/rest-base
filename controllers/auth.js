const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, email, img } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        email,
        password: "XD",
        img,
        google: true,
        role: "USER_ROLE",
      };

      user = new User(data);

      await user.save();
    } else {
      // Hace falta la lógica cuando ya existe el usuario
      console.log("El usuario ya existe");
    }

    console.log(user);

    // Creo que sería mejor que haya validación cuando
    // el usuario está "eliminado" y cuando está bloqueado
    if (!user.status) {
      return res.status(401).json({
        msg: "Este usuario está bloqueado",
      });
    }

    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "El token no se pudo verificar",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
