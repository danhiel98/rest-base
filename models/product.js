const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
    unique: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  img: {
    type: String,
  },
  available: {
    type: Boolean,
    default: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

ProductSchema.methods.toJSON = function () {
  const { __v: p_v, _id: p_id, status, ...product } = this.toObject();
  const {
    __v: c_v,
    _id: c_id,
    status: c_status,
    ...category
  } = product.category;
  const {
    __v: u_v,
    _id: u_id,
    password,
    status: u_status,
    ...createdBy
  } = product.createdBy;

  product.id = p_id;

  if (category.name) {
    category.id = c_id;
    product.category = category;
  }

  if (createdBy.email) {
    createdBy.id = u_id;
    product.createdBy = createdBy;
  }

  return product;
};

module.exports = model("Product", ProductSchema);
