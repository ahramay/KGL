const Joi = require("joi");
const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;
const testtransactionSchema = new mongoose.Schema({
  owner: {
    type: ObjectID,
    required: true,
    ref: "User",
  },
  payment: {
    type: Number,
    required: true,
    default: 0,
  },
  code: {
    type: String,
  },
  coins: {
    type: String,
  },

  // isRedeemed: {
  //   type: Boolean,
  //   default: false,
  // },
  createdAt: {
    type: Date,
    default: new Date(),
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Testtransaction = mongoose.model(
  "testtransaction",
  testtransactionSchema
);

validateTesttransaction = (data) => {
  const schema = Joi.object({
    payment: Joi.number().min(5).required(),
    code: Joi.number(),
    coins: Joi.number(),
  });
  return schema.validate(data);
};

module.exports = { Testtransaction, validateTesttransaction };
