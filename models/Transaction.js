const { date } = require("joi");
const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;
const transactionSchema = new mongoose.Schema({
  owner: {
    type: ObjectID,
    required: true,
    ref: "User",
  },

  transactionId: {
    type: String,
    required: true,
  },

  // card: {
  //   number: String,
  //   exp_month: String,
  //   cvc: String,
  //   exp_year: String,
  // },

  payment: {
    type: Number,
    required: true,
    default: 0,
  },
  code: {
    type: String,
    unique: true,
    required: true,
  },

  isRedeemed: {
    type: Boolean,
    default: false,
  },
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
//  // userCard: [
//   {
//     userName: String,
//     expiry: String,
//     cardNumber: Number,
//     cvvcode: Number,
//   },
// ],
// billingAddress1: String,
// billingAddress2: String,
// city: String,
// zipcode: Number,
// state: String,
// country: String,
