const mongoose = require("mongoose");
const User = require("./User");
const moment = require("moment");

const userSessionSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ip: {
    type: String,
  },
  long: {
    type: String,
  },
  lat: {
    type: String,
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  device: {
    type: String,
  },
  start: {
    type: Date,
    default: moment().format(),
  },
  end: {
    type: Date,
    // default: Date.now(),
  },
});

const UserSession = mongoose.model("UserSession", userSessionSchema);
module.exports = { UserSession };
