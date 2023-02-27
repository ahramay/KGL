const mongoose = require("mongoose");
const moment = require("moment");

const loginCoinsSchema = new mongoose.Schema({
  amount: {
    type: Number,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expiredCoins: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: moment().format(),
  },
});

const Logincoins = mongoose.model("loginCoins", loginCoinsSchema);
module.exports = { Logincoins };
