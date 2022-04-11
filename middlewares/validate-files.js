const validateFiles = (req, res, next) => {
  const { files } = req;

  if (!files || Object.keys(files).length === 0 || !files.file) {
    return res.status(400).json({
      msg: "No hay archivos que subir",
    });
  }

  next();
};

module.exports = {
  validateFiles,
};
