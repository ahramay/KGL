const express = require("express");
const router = express.Router();
const { UserScreenActivity } = require("../models/Userscreenactivity");
// const services = require(paths.services);
const errorHandler = require("../services/apiError");
const constants = require("../constants");
const moment = require("moment");
const { admin, auth } = require("../middlewares/authorize");

router.post("/", auth, async (req, res) => {
  const user = req.session.user;
  
  console.log("=======> screenactivities", user);

  if (!user) {
    res.status(500).json({ message: constants.AUTH_ERROR });
  }
  const { end, start, screen } = req.body;
  const activityCreator = {
    end,
    start,
    screen,
    owner: user._id,
  };
  //.toObjectId(),
  UserScreenActivity.create(activityCreator)
    .then((created) => {
      res.status(200).json(created);
    })
    .catch((e) => {
      const errors = errorHandler(e);
      res.status(400).json({ errors: errors });
    });
});

router.post("/end", auth, async (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    res.status(500).json({ message: constants.AUTH_ERROR });
  }
  const { _id } = req.body;
  if (!_id) {
    res.status(500).json({ message: "Screen activity id is required" });
  }
  //   const screenActivityEnd = { end, screen, owner: user._id.toObjectId() };
  await UserScreenActivity.findOne({ _id }).then((screenActivityEnd) => {
    const now = moment().format();
    // console.log("now------->>>>>>", screenActivityEnd);
    screenActivityEnd.end = now;
    screenActivityEnd
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
