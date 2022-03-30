const { request, response } = require("express");

const isAdminRole = async (req = request, res = response, next) => {
  const { authenticatedUser } = req;

  if (!authenticatedUser) {
    return res.status(500).json({
      msg: "No se realizó la validación correcta del usuario autenticado",
    });
  }

  if (authenticatedUser.role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `El usuario ${authenticatedUser.name} no tiene los privilegios necesarios para realizar esta acción`,
    });
  }

  next();
};

const hasRoles = (...roles) => {
  return (req, res = response, next) => {
    if (!req.authenticatedUser) {
      return res.status(500).json({
        msg: "Se requiere autenticación de usuario",
      });
    }

    if (!roles.includes(req.authenticatedUser.role)) {
      return res.status(401).json({
        msg: `El usuario autenticado requiere alguno de estor roles: ${roles}`,
      });
    }

    next();
  };
};

module.exports = {
  isAdminRole,
  hasRoles,
};
