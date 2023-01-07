const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;
const orderSchema = new mongoose.Schema({
  owner: {
    type: ObjectID,
    required: true,
    ref: "User",
  },
  cartitems: [
    {
      itemId: {
        type: ObjectID,
        ref: "Product",
        required: true,
      },
      name: String,
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity can not be less then 1."],
        default: 1,
      },
      price: Number,

      description: String,
      subtotal: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],

  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: ["In processing", "In transit"],
    default: "In processing",
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = { Order };
