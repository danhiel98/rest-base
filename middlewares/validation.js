/**
 * Middleware utilizado para realizar validaciones de los campos
 * Las restricciones de validación vienen dadas por un middleware anterior
 * Si no hay errores se continúa con la ejecución llamando el método next()
 */

const { validationResult } = require("express-validator");

const validateFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).json(errors);

  next();
};

module.exports = {
  validateFields,
};
