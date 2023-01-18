const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;
const cartSchema = new mongoose.Schema({
  owner: {
    type: ObjectID,
    required: true,
    ref: "User",
  },
  items: [
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

  bill: {
    type: Number,
    required: true,
    default: 0,
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

const Cart = mongoose.model("Cart", cartSchema);
module.exports = { Cart };
