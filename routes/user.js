const { check } = require("express-validator");
const { Router } = require("express");
const {
  userGET,
  userPOST,
  userPUT,
  userPATCH,
  userDELETE,
} = require("../controllers/user");

const {
  isValidRole,
  emailExists,
  userExists,
} = require("../helpers/db-validators");

const {
  validateFields,
  validateJWT,
  isAdminRole,
  hasRoles,
} = require("../middlewares/index");

const router = Router();

router.get("/", userGET);

router.post(
  "/",
  [
    check("name", "Debe ingresar un nombre").not().isEmpty(),
    check("password", "La contraseña debe tener más de 6 letras").isLength({
      min: 6,
    }),
    check("email", "El correo no es válido").isEmail(),
    check("role").custom(isValidRole),
    check("email").custom(emailExists),
    validateFields,
  ],
  userPOST
);

router.put(
  "/:id",
  [
    check("id", "El id no es válido").isMongoId(),
    check("id").custom(userExists),
    validateFields,
  ],
  userPUT
);

router.patch("/", userPATCH);

router.delete(
  "/:id",
  [
    validateJWT,
    // isAdminRole,
    hasRoles("ADMIN_ROLE", "USER_ROLE"),
    check("id", "El id no es válido").isMongoId(),
    check("id").custom(userExists),
    validateFields,
  ],
  userDELETE
);

module.exports = router;
