const { Router } = require("express");
const { check } = require("express-validator");
const {
  uploadFiles,
  updateImageCloudinary,
  getImage,
} = require("../controllers/uploads");
const { allowedCollections } = require("../helpers");
const { validateFields, validateFiles } = require("../middlewares");

const router = Router();

router.post("/", uploadFiles);

router.put(
  "/:collection/:id",
  [
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "products"])
    ),
    check("id", "El id no es válido").isMongoId(),
    validateFiles,
    validateFields,
  ],
  updateImageCloudinary
);

router.get(
  "/:collection/:id",
  [
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "products"])
    ),
    check("id", "El id no es válido").isMongoId(),

    validateFields,
  ],
  getImage
);

module.exports = router;
