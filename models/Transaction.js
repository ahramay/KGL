const { date } = require("joi");
const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;
const transactionSchema = new mongoose.Schema({
  owner: {
    type: ObjectID,
    required: true,
    ref: "User",
  },
  cartItems: [
    {
      name: String,
      quantity: {
        type: Number,
        required: true,
        min: 1,
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
  userCard: [
    {
      userName: String,
      expiry: String,
      cardNumber: Number,
      cvvcode: Number,
    },
  ],
  billingAddress1: String,
  billingAddress2: String,
  city: String,
  zipcode: Number,
  state: String,
  country: String,

  payment: {
    type: Number,
    required: true,
    default: 0,
  },
  code: {
    type: Number,
  },
  // coins: {
  //   type: Number,
  // },
  // isRedeemed: {
  //   type: Number,
  //   unique: true,
  // },
  createdAt: {
    type: Date,
    default: new Date(),
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Transaction = mongoose.model("transaction", transactionSchema);
module.exports = { Transaction };
