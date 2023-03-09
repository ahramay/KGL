const mongoose = require("mongoose");
const { isEmail } = require("validator");
const moment = require("moment");
const Joi = require("joi");

// const userRoles = {
//   User: "User",
//   ADMIN: "ADMIN",
// };
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email."],
    unique: [true, "This email is already in use."],
    lowercase: true,
    validate: [isEmail, "Please enter a valid email."],
  },
  firstName: {
    type: String,
    required: [true, "Please enter a First Name."],
  },
  lastName: {
    type: String,
    required: [true, "Please enter a Last Name."],
  },

  username: {
    type: String,
    required: [true, "Please enter a Username."],
    unique: [true, "This Username is already in use."],
    minlength: [3, "The password should be at least 3 chars."],
  },
  password: {
    type: String,
    // required: [true, 'Please enter a password.'],
    minlength: [6, "The password should be at least 6 chars."],
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    enum: ["ENABLED", "DISABLED", "PANIC"],
    default: "ENABLED",
  },
  coins: {
    type: String,
    default: "0",
  },
  code: {
    type: Number,
  },
  phoneno: {
    type: Number,
  },
  lastlogin: {
    type: Date,
  },
  // role: {
  //   type: String,
  //   default: userRoles.User,
  // },
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

const User = mongoose.model("user", userSchema);

// coins: {
//   //  freeCoins: {
//   //     type: Number,
//   //     default: "500",
//   //   },
//   paidCoins: {
//     type: Number,
//     default: "0",
//   },
// },
function validateChangePassword(data) {
  const schema = Joi.object({
    password: Joi.string().min(5).max(30).required(),
    currentpassword: Joi.string().min(5).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  });
  return schema.validate(data);
}

function validateUpdateUser(data) {
  const schema = Joi.object({
    firstName: Joi.string().min(1).lowercase(),
    username: Joi.string().min(1).lowercase(),
    phoneno: Joi.number(),
    email: Joi.string().min(5).max(50).allow("", null).lowercase(),
  });
  return schema.validate(data);
}

function validateDeleteUserPassword(data) {
  const schema = Joi.object({
    password: Joi.string().min(5).max(30).required(),
  });
  return schema.validate(data);
}
function addCoinsByEmail(data) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(50).required().trim(),
  });
  return schema.validate(data);
}
module.exports = {
  User,
  validateUpdateUser,
  validateChangePassword,
  validateDeleteUserPassword,
  addCoinsByEmail,
};
