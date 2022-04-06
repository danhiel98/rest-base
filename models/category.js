const { Schema, model } = require("mongoose");
const { User } = require(".");

const CategorySchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

CategorySchema.methods.toJSON = function () {
  const {
    __v: c_v,
    _id: c_id,
    status: c_status,
    ...category
  } = this.toObject();
  const {
    __v: u_v,
    _id: u_id,
    status: u_status,
    password,
    ...createdBy
  } = category.createdBy;

  category.id = c_id;

  // El atributo existe solo si se llamó la función populate
  if (password) {
    createdBy.id = u_id;
    category.createdBy = createdBy;
  }

  return category;
};

module.exports = model("Category", CategorySchema);
