const mongoose = require("mongoose");
const User = require("./User");
const Game = require("./Game");
const moment = require("moment");

const userGameplaySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
  },
  start: {
    type: Date,
    default: moment().format(),
  },
  end: {
    type: Date,
  },
});

const UserGameplay = mongoose.model("UserGameplay", userGameplaySchema);
module.exports = { UserGameplay };
