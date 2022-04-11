const { check } = require("express-validator");
const { Router } = require("express");

const {
  categoryGET,
  categoryPOST,
  categoryPUT,
  categoryDELETE,
} = require("../controllers/category");
const { validateJWT, hasRoles, validateFields } = require("../middlewares");
const {
  categoryExists,
  categoryInDatabase,
} = require("../helpers/db-validators");

const router = new Router();

router.get("/", categoryGET);

router.get(
  "/:id",
  [
    check("id", "El id no es válido").isMongoId(),
    check("id").custom(categoryExists), // Verifica que la categoría exista antes de devolver algo
    validateFields,
  ],
  categoryGET
);

router.post(
  "/",
  [
    validateJWT,
    check("name", "El nombre es requerido").not().isEmpty(),
    check("name").custom(categoryInDatabase),
    validateFields,
  ],
  categoryPOST
);

router.put(
  "/:id",
  [
    validateJWT,
    check("id", "El id no es válido").isMongoId(),
    check("id").custom(categoryExists),
    check("name", "El nombre es requerido").not().isEmpty(),
    validateFields,
  ],
  categoryPUT
);

router.delete(
  "/:id",
  [
    validateJWT,
    hasRoles("ADMIN_ROLE", "USER_ROLE"),
    check("id", "El id no es válido").isMongoId(),
    check("id").custom(categoryExists),
    validateFields,
  ],
  categoryDELETE
);

module.exports = router;
