const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  playstore_id: {
    type: String,
  },
});
const Game = mongoose.model("Game", gameSchema);

module.exports = { Game };
