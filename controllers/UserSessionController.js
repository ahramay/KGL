const express = require("express");
const router = express.Router();
const paths = global.PATHS;
const { admin, auth } = require("../middlewares/authorize");

const { UserSession } = require("../models/Usersession");
// const services = require(paths.services);
const moment = require("moment");
const errorHandler = require("../services/apiError");
const constants = require("../constants");
router.post("/", auth, async (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    res.status(500).json({ message: constants.AUTH_ERROR });
  }
  const { device, long, lat, country, state, city, start, ip } = req.body;

  const sessionInfo = {
    device,
    long,
    lat,
    country,
    state,
    city,
    start,
    ip,
    owner: user._id,
  };
  //.toObjectId(),
  await UserSession.create(sessionInfo)
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
    res.status(500).json({ message: "Session id is required" });
  }
  //   const screenActivityEnd = { end, screen, owner: user._id.toObjectId() };
  await UserSession.findOne({ _id }).then((sessionEnd) => {
    const now = moment().format();
    // console.log("now------->>>>>>", screenActivityEnd);
    sessionEnd.end = now;
    sessionEnd
      .save()
      .then((saved) => {
        res
          .status(200)
          .json({ message: "Session end time has been noted.", saved });
      })
      .catch((e) => {
        res.status(400).json({ errors: e });
      });
  });
});

module.exports = router;
