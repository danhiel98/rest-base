const { response, request } = require("express");
const { Product, Category } = require("../models");

const getProductById = async (id, res = response) => {
  const product = await Product.findById(id)
    .populate("category")
    .populate("createdBy");

  res.json(product);
};

const getAllProducts = async (req = request, res = response) => {
  const { start = 0, limit = 5 } = req.query;

  const query = { status: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .skip(start)
      .limit(limit)
      .populate("createdBy")
      .populate("category"),
  ]);

  res.json({
    start,
    limit,
    total,
    products,
  });
};

const productGET = (req = request, res = response) => {
  const { id } = req.params;

  if (id) {
    getProductById(id, res);
  } else {
    getAllProducts(req, res);
  }
};

const productPOST = async (req = request, res = response) => {
  const { name, price, description, category } = req.body;
  const { authenticatedUser } = req;

  const data = {
    name,
    category,
    createdBy: authenticatedUser._id,
    price,
    description,
  };

  const product = new Product(data);

  await product.save();

  await Product.populate(product, [
    { path: "category" },
    { path: "createdBy" },
  ]);

  res.status(201).json({
    product,
  });
};

const productPUT = async (req = request, res = response) => {
  const { id } = req.params;

  const { status, createdBy, ...rest } = req.body;

  if (rest.name) {
    const query = { name: rest.name, _id: { $ne: id } };
    const dbProduct = await Product.findOne(query);

    if (dbProduct) {
      return res.status(401).json({
        msg: "No puede utilizar este nombre de producto porque ya fue utilizado",
      });
    }
  }

  await Product.findByIdAndUpdate(id, rest);

  const product = await Product.findById(id)
    .populate("category")
    .populate("createdBy");

  res.json(product);
};

const productDELETE = async (req = request, res = response) => {
  const { id } = req.params;

  await Product.findByIdAndUpdate(id, { status: false });

  const product = await Product.findById(id)
    .populate("category")
    .populate("createdBy");

  res.json(product);
};

module.exports = {
  productGET,
  productPOST,
  productPUT,
  productDELETE,
};
