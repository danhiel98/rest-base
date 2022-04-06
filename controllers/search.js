const { request, response } = require("express");
const { User, Category, Product } = require("../models");
const { ObjectId } = require("mongoose").Types;

const allowedCollections = ["categories", "products", "users", "roles"];

const searchUsers = async (term = "", res = response) => {
  // Si envían un mongoID
  if (ObjectId.isValid(term)) {
    const user = await User.findById(term);
    return res.json({
      total: user && user.status ? 1 : 0,
      results: user && user.status ? [user] : [],
    });
  }

  // Buscar usuarios que contengan el término de búsqueda en el nombre
  // Acepta mayúsculas y minúsculas en búsqueda
  const regex = new RegExp(term, "i");

  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }],
  });

  return res.json({ total: users.length, results: users });
};

const searchCategories = async (term, res = response) => {
  if (ObjectId.isValid(term)) {
    const category = await Category.findById(term);

    if (category && category.status) {
      await Category.populate(category, { path: "createdBy" });
    }

    return res.json({
      total: category && category.status ? 1 : 0,
      results: category && category.status ? [category] : [],
    });
  }

  const regex = new RegExp(term, "i");

  const categories = await Category.find({
    $and: [{ name: regex }, { status: true }],
  }).populate("createdBy");

  return res.json({
    total: categories.length,
    results: categories,
  });
};

const searchProducts = async (term, res = response) => {
  if (ObjectId.isValid(term)) {
    const product = await Product.findById(term);

    if (product && product.status) {
      await Product.populate(product, [
        { path: "category" },
        { path: "createdBy" },
      ]);
    }

    return res.json({
      total: product && product.status ? 1 : 0,
      results: product && product.status ? [product] : [],
    });
  }

  const regex = new RegExp(term, "i");

  const products = await Product.find({
    $or: [{ name: regex }, { price: regex }, { description: regex }],
    $and: [{ status: true }],
  })
    .populate("category")
    .populate("createdBy");

  return res.json({
    total: products.length,
    results: products,
  });
};

const search = async (req = request, res = response) => {
  const { collection, terms } = req.params;

  if (!allowedCollections.includes(collection)) {
    return res.status(403).json({
      msg: `La colección ${collection} no es permitida`,
    });
  }

  switch (collection) {
    case "categories":
      searchCategories(terms, res);
      break;
    case "products":
      searchProducts(terms, res);
      break;
    case "users":
      searchUsers(terms, res);
      break;
    default:
      break;
  }
};

module.exports = {
  search,
};
