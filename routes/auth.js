const { check } = require("express-validator");
const { Router } = require("express");
const { login } = require("../controllers/auth");
const { validateFields } = require("../middlewares/validation");

const router = Router();

router.post(
  "/login",
  [
    check("email", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validateFields,
  ],
  login
);

module.exports = router;
