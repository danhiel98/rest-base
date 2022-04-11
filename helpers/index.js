const dbValidator = require("./db-validators");
const generateJwt = require("./generate-jwt");
const googleVerify = require("./google-verify");
const uploadFiles = require("./upload-files.js");

module.exports = {
  ...dbValidator,
  ...generateJwt,
  ...googleVerify,
  ...uploadFiles,
};
