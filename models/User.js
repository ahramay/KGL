const mongoose = require("mongoose");
const { isEmail } = require("validator");
const moment = require("moment");
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
    enum: ["USER", "ADMIN", "SUPER_ADMIN"],
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
  lastlogin: {
    type: Date,
  },
  created: {
    type: Date,
    default: moment().format(),
    required: true,
  },
});

module.exports.User = mongoose.model("user", userSchema);
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
