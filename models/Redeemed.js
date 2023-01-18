const { date, string } = require("joi");
const mongoose = require("mongoose");
const moment = require("moment");
const ObjectID = mongoose.Schema.Types.ObjectId;
const redeemedSchema = new mongoose.Schema({
  owner: {
    type: ObjectID,
    required: true,
    ref: "User",
  },
  code: {
    type: String,
    required: true,
    // unique: true,
  },
  coins: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: moment().format(),
    required: true,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Redeemed = mongoose.model("redeemed", redeemedSchema);
module.exports = { Redeemed };
