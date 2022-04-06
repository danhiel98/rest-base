const { request } = require("express");
const { response } = require("express");
const { Category } = require("../models");

// Retorna la categoría, la validación de que exista ya se hace en el middleware
const getCategoryById = async (req = request, res = response) => {
  const { id } = req.params;

  const category = await Category.findById(id).populate("createdBy");

  res.json(category);
};

// Devuelve la lista de categorías paginada
const getAllCategories = async (req, res = response) => {
  const { start = 0, limit = 5 } = req.query;

  const query = { status: true };

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query).skip(start).limit(limit).populate("createdBy"),
  ]);

  res.json({
    start,
    limit,
    total,
    categories,
  });
};

const categoryGET = (req, res = response) => {
  const { id } = req.params;

  if (id) {
    return getCategoryById(req, res);
  } else {
    return getAllCategories(req, res);
  }
};

const categoryPOST = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();
  const { authenticatedUser } = req;

  const data = { name, createdBy: authenticatedUser._id };

  const category = new Category(data);

  await category.save();

  res.status(201).json({
    category,
  });
};

const categoryPUT = async (req, res = response) => {
  const { id } = req.params;
  const name = req.body.name.toUpperCase();

  // Valida que el nombre de la categoría no exista antes de actualizar
  const query = { name, _id: { $ne: id } };
  const dbCategory = await Category.findOne(query);

  if (dbCategory) {
    return res.status(401).json({
      msg: "No puede utilizar ese nombre de categoría porque ya fue utilizado",
    });
  }

  await Category.findByIdAndUpdate(id, { name });

  const category = await Category.findById(id);

  res.json(category);
};

const categoryDELETE = async (req, res = response) => {
  const { id } = req.params;

  const authenticatedUser = req.authenticatedUser;
  await Category.findByIdAndUpdate(id, { status: false });

  const category = await Category.findById(id);

  res.json({
    category,
    authenticatedUser,
  });
  id;
};

module.exports = {
  categoryGET,
  categoryPOST,
  categoryPUT,
  categoryDELETE,
};
