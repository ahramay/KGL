const mongoose = require("mongoose");
const moment = require("moment");
const Joi = require("joi");
const { boolean } = require("joi");

const ObjectID = mongoose.Schema.Types.ObjectId;
const subscribedemailSchema = new mongoose.Schema({
  owner: {
    type: ObjectID,
    required: true,
    ref: "User",
  },

  email: {
    type: String,
  },
  subscribe: {
    type: Boolean,
    default: true,
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

const Subscribedemail = mongoose.model(
  "subscribedemail",
  subscribedemailSchema
);

validateSubscribeEmail = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(3).trim(),
    subscribe: Joi.boolean(),
  });
  return schema.validate(data);
};
module.exports = { Subscribedemail, validateSubscribeEmail };
