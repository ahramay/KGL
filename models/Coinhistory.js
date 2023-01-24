const { date } = require("joi");
const mongoose = require("mongoose");

const ObjectID = mongoose.Schema.Types.ObjectId;
const coinHistorySchema = new mongoose.Schema({
  owner: {
    type: ObjectID,
    required: true,
    ref: "User",
  },
  addCoins: {
    type: String,
    default: "0",
  },
  subtractionCoins: {
    type: String,
    default: "0",
  },

  totalCoins: {
    type: String,
    default: "0",
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

const Coinhistory = mongoose.model("Coinhistory", coinHistorySchema);
module.exports = { Coinhistory };
