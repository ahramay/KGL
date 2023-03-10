const mongoose = require("mongoose");
const moment = require("moment");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },

  image: {
    type: String,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Product = mongoose.model("product", productSchema);

validateAddProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).trim(),
    description: Joi.string().trim(),
    price: Joi.number(),
  });
  return schema.validate(data);
};

module.exports = { Product, validateAddProduct };
