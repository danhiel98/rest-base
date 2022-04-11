const path = require("path");
const fs = require("fs");
const { request, response } = require("express");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFile } = require("../helpers");
const { User, Product } = require("../models");

const uploadFiles = async (req = request, res = response) => {
  const { files } = req;

  try {
    const fileName = await uploadFile(files, undefined, "images");

    res.json({ fileName });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const updateImage = async (req = request, res = response) => {
  const { collection, id } = req.params;

  let model = undefined;

  switch (collection) {
    case "users":
      model = await User.findById(id);

      if (!(model && model.status)) {
        return res.status(400).json({
          msg: `No existe un usuario con el id enviado`,
        });
      }
      break;
    case "products":
      model = await Product.findById(id);

      if (!(model && model.status)) {
        return res.status(400).json({
          msg: `No existe un producto con el id enviado`,
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: "Ocurrió un error inesperado",
      });
  }

  // Limpiar imágenes
  if (model.img) {
    const imagePath = path.join(__dirname, "../uploads", collection, model.img);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  const fileName = await uploadFile(req.files, undefined, collection);
  model.img = fileName;

  await model.save();

  res.json({
    model,
  });
};

const updateImageCloudinary = async (req = request, res = response) => {
  const { collection, id } = req.params;

  let model = undefined;

  switch (collection) {
    case "users":
      model = await User.findById(id);

      if (!(model && model.status)) {
        return res.status(400).json({
          msg: `No existe un usuario con el id enviado`,
        });
      }
      break;
    case "products":
      model = await Product.findById(id);

      if (!(model && model.status)) {
        return res.status(400).json({
          msg: `No existe un producto con el id enviado`,
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: "Ocurrió un error inesperado",
      });
  }

  // Limpiar imágenes
  if (model.img) {
    const arrName = model.img.split("/");
    const name = arrName.at(-1);
    const [id] = name.split(".");

    cloudinary.uploader.destroy(id);
  }

  const { tempFilePath } = req.files.file;

  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  model.img = secure_url;

  await model.save();

  res.json(model);
};

const getImage = async (req, res = response) => {
  const { id, collection } = req.params;

  let model = undefined;

  switch (collection) {
    case "users":
      model = await User.findById(id);

      if (!(model && model.status)) {
        return res.status(400).json({
          msg: `No existe un usuario con el id enviado`,
        });
      }
      break;
    case "products":
      model = await Product.findById(id);

      if (!(model && model.status)) {
        return res.status(400).json({
          msg: `No existe un producto con el id enviado`,
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: "Ocurrió un error inesperado",
      });
  }

  // Limpiar imágenes
  if (model.img) {
    const imagePath = path.join(__dirname, "../uploads", collection, model.img);

    if (fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    }
  }

  const noImagePath = path.join(__dirname, "../assets/no-image.jpg");

  return res.sendFile(noImagePath);
};

module.exports = {
  uploadFiles,
  updateImage,
  updateImageCloudinary,
  getImage,
};
