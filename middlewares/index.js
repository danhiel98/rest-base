const validateFields = require("./validate-fields");
const validateFiles = require("./validate-files");
const validateJWT = require("./validate-jwt");
const validateRoles = require("./validate-roles");

module.exports = {
  ...validateFields,
  ...validateFiles,
  ...validateJWT,
  ...validateRoles,
};
