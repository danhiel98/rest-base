const { check } = require("express-validator");
const { Router } = require("express");
const {
  productGET,
  productPOST,
  productPUT,
  productDELETE,
} = require("../controllers/product");
const { validateFields, validateJWT, hasRoles } = require("../middlewares");
const {
  productExists,
  productInDatabase,
  isValidCategory,
  categoryExists,
} = require("../helpers/db-validators");

const router = new Router();

router.get("/", productGET);

router.get(
  "/:id",
  [
    check("id", "El id no es válido").isMongoId(),
    check("id").custom(productExists), // Verificar que el producto exista
    validateFields,
  ],
  productGET
);

router.post(
  "/",
  [
    validateJWT,
    check("name", "El nombre es requerido").not().isEmpty(),
    check("name").custom(productInDatabase),
    check("category", "El id de la categoría no es válido").isMongoId(),
    check("category").custom(categoryExists),
    check("price", "El precio debe ser un número entre 0 y 100000")
      .isFloat({
        min: 0,
        max: 100000,
      })
      .optional({ nullable: true }),
    check(
      "description",
      "La longitud de la descripción debe tener entre 5 y 500 caracteres"
    )
      .isLength({ min: 5, max: 500 })
      .optional({ nullable: true }),

    validateFields,
  ],
  productPOST
);

router.put(
  "/:id",
  [
    validateJWT,
    hasRoles("ADMIN_ROLE", "USER_ROLE"),
    check("id", "El id no es válido").isMongoId(),
    check("id").custom(productExists),
    check("category", "El id de la categoría no es válido").isMongoId(),
    check("category").custom(categoryExists),
    check("price", "El precio debe ser un número entre 0 y 100000")
      .isFloat({
        min: 0,
        max: 100000,
      })
      .optional({ nullable: true }),
    check(
      "description",
      "La longitud de la descripción debe tener entre 5 y 500 caracteres"
    )
      .isLength({ min: 5, max: 500 })
      .optional({ nullable: true }),

    validateFields,
  ],
  productPUT
);

router.delete(
  "/:id",
  [
    validateJWT,
    hasRoles("ADMIN_ROLE", "USER_ROLE"),
    check("id", "El id no es válido").isMongoId(),
    check("id").custom(productExists),
    validateFields,
  ],
  productDELETE
);

module.exports = router;
