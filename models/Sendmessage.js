const mongoose = require("mongoose");
const moment = require("moment");
const Joi = require("joi");

const ObjectID = mongoose.Schema.Types.ObjectId;
const sendaMessageSchema = new mongoose.Schema({
  owner: {
    type: ObjectID,
    required: true,
    ref: "User",
  },

  name: {
    type: String,
  },

  email: {
    type: String,
  },
  address: {
    type: String,
  },

  phone: {
    type: Number,
  },
  message: {
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

validateSendMessage = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).trim(),
    email: Joi.string().trim(),
    phone: Joi.number(),
    address: Joi.string().trim(),
    message: Joi.string().trim(),
  });
  return schema.validate(data);
};
module.exports = { Sendmessage, validateSendMessage };
