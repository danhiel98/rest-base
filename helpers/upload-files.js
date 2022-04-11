const path = require("path");
const { v4: uuidv4 } = require("uuid");

const defaultExtensions = ["png", "jpg", "jpeg", "gif"];

const uploadFile = async (
  files,
  validExtensions = defaultExtensions,
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;

    const splitted = file.name.split(".");
    const fileExtension = splitted[splitted.length - 1];

    console.log("Extension:", fileExtension);

    if (!validExtensions.includes(fileExtension)) {
      return reject(
        `La extensión ${fileExtension} no es permitida. Solo se permiten: ${validExtensions}`
      );
    }

    const tempName = `${uuidv4()}.${fileExtension}`;
    const uploadPath = path.join(__dirname, "../uploads/", folder, tempName);

    file.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(tempName);
    });
  });
};

module.exports = {
  uploadFile,
};
