const express = require("express");
const router = express.Router();
const paths = global.PATHS;
const { UserGameplay } = require("../models/Usergameplay");
// const services = require(paths.services);
const moment = require("moment");
const errorHandler = require("../services/apiError");
const constants = require("../constants");
const { admin, auth } = require("../middlewares/authorize");

router.post("/", auth, async (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    res.status(500).json({ message: constants.AUTH_ERROR });
  }
  const { game } = req.body;
  const activityCreator = {
    game,
    owner: user._id,
  };
  // .toObjectId(),
  UserGameplay.create(activityCreator)
    .then((created) => {
      res.status(200).json(created);
    })
    .catch((e) => {
      const errors = errorHandler(e);
      res.status(400).json({ errors: errors });
    });
});

router.post("/end", async (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    res.status(500).json({ message: constants.AUTH_ERROR });
  }
  const { _id } = req.body;
  if (!_id) {
    res.status(500).json({ message: "Gameplay screen id is required" });
  }
  //   const screenActivityEnd = { end, screen, owner: user._id.toObjectId() };
  await UserGameplay.findOne({ _id }).then((gamePlayEnd) => {
    const now = moment().format();
    // console.log("now------->>>>>>", gamePlayEnd);
    gamePlayEnd.end = now;
    gamePlayEnd
      .save()
      .then((saved) => {
        res
          .status(200)
          .json({ message: "Screen end time has been noted.", saved });
      })
      .catch((e) => {
        res.status(400).json({ errors: e });
      });
  });
});
module.exports = router;
