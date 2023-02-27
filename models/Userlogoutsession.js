const mongoose = require("mongoose");
const moment = require("moment");
const { Joi } = require("joi");

const userLogoutSessionSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  usersessions: {
    type: Object,
  },

  isLoggout: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: moment().format(),
  },
});

const UserLogoutSession = mongoose.model(
  "userLogoutSession",
  userLogoutSessionSchema
);
module.exports = { UserLogoutSession };
