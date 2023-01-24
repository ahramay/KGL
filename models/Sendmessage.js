const { date } = require("joi");
const mongoose = require("mongoose");

const ObjectID = mongoose.Schema.Types.ObjectId;
const sendaMessageSchema = new mongoose.Schema({
  owner: {
    type: ObjectID,
    required: true,
    ref: "User",
  },

  phone: {
    type: String,
  },

  email: {
    type: String,
  },
  address: {
    type: String,
  },

  phone: {
    type: String,
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

const Sendmessage = mongoose.model("Sendmessage", sendaMessageSchema);
module.exports = { Sendmessage };
