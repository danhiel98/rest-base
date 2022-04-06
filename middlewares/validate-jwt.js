const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Validar que se envíe un token y obtener uid para enviar en petición
const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No se envió el token",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_JWT);

    req.uid = uid;

    const authenticatedUser = await User.findById(uid);

    if (!authenticatedUser.status) {
      return res.status(401).json({
        msg: "Token no válido - status",
      });
    }

    // Asignar usuario autenticado en la petición
    req.authenticatedUser = authenticatedUser;

    next();
  } catch (error) {
    res.status(401).json({
      msg: "Token no válido",
    });
  }
};

module.exports = {
  validateJWT,
};
