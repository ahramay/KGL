const { date } = require("joi");
const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;
const redeemedSchema = new mongoose.Schema({
  owner: {
    type: ObjectID,
    required: true,
    ref: "User",
  },
  code: {
    type: Number,
    unique: true,
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

const Redeemed = mongoose.model("redeemed", redeemedSchema);
module.exports = { Redeemed };
