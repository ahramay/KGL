const express = require("express");
const router = express.Router();
const { Game } = require("../models/Game");
const { auth } = require("../middlewares/authorize");
const errorHandler = require("../services/apiError");
const constants = require("../constants");

router.post("/", auth, async (req, res, next) => {
  const user = req.session.user;
  console.log(req.session.user);

  if (!user) {
    res.status(500).json({ message: constants.AUTH_ERROR });
  }
  const { name, playstore_id } = req.body;
  const gameCreator = {
    name,
    playstore_id,
  };
  Game.create(gameCreator)
    .then((created) => {
      res.status(200).json(created);
    })
    .catch((e) => {
      const errors = errorHandler(e);
      res.status(400).json({ errors: errors });
    });
});
module.exports = router;
