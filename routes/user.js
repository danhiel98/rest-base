const { check } = require("express-validator");
const { Router } = require("express");
const {
  userGET,
  userPOST,
  userPUT,
  userPATCH,
  userDELETE,
} = require("../controllers/user");
const { validateFields } = require("../middlewares/validation");

const {
  isValidRole,
  emailExists,
  userExists,
} = require("../helpers/db-validators");

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
    // check("role", "El rol no es válido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
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
    check("id", "El id no es válido").isMongoId(),
    check("id").custom(userExists),
    validateFields,
  ],
  userDELETE
);

module.exports = router;
