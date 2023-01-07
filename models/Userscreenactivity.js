const mongoose = require("mongoose");
const User = require("./User");
const moment = require("moment");

const userScreenActivitySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  screen: {
    type: String,
    required: [true, "Screen name is required."],
  },
  start: {
    type: Date,
    default: moment().format(),
  },
  end: {
    type: Date,
    default: moment().format(),
  },
});

const UserScreenActivity = mongoose.model(
  "UserScreenActivity",
  userScreenActivitySchema
);
module.exports = { UserScreenActivity };
