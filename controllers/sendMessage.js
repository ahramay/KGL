const express = require("express");
const router = express.Router();
const { SendUsMessage } = require("../services/mailer");
const { subscribedEmail } = require("../services/mailer");
const { Sendmessage, validateSendMessage } = require("../models/Sendmessage");
const {
  Subscribedemail,
  validateSubscribeEmail,
} = require("../models/Subscribedemail");
const { auth, admin } = require("../middlewares/authorize");
router.post("/", auth, async (req, res) => {
  const owner = res.id;
  let { value, error } = validateSendMessage(req.body); //need to add the req.body
  console.log("========>value", value);
  if (error) {
    res.status(400).send({
      success: false,
      message: error.details[0].message,
    });
  }
  SendUsMessage(
    value
    // to: "alibaloch405060@gmail.com",
  );
  value.owner = owner;
  const createMessage = await Sendmessage(value).save();
  if (!createMessage) {
    return res.status(400).json({
      success: false,
      message: "your message is not send to Lion Prides",
    });
  }
  return res.status(200).json({
    success: true,
    message: " Send Successfully",
  });
});

router.post("/subscribedemail", auth, async (req, res) => {
  const owner = res.id;
  const email = req.body.email;
  let { value, error } = validateSubscribeEmail(req.body); //need to add the req.body
  console.log("========>value", value);
  console.log("========>email", email);

  if (error) {
    res.status(400).send({
      success: false,
      message: error.details[0].message,
    });
  }
  const previousUser = await Subscribedemail.findOne({ email });
  console.log(previousUser);
  if (previousUser) {
    return res.status(400).json({
      message: "Email Already exist.",
    });
  }
  subscribedEmail(
    value
    // to: "alibaloch405060@gmail.com",
  );
  value.owner = owner;
  const createMessage = await Subscribedemail(value).save();
  if (!createMessage) {
    return res.status(400).json({
      success: false,
      message: "Email is not subcribed",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Email is subcribed",
  });
});
module.exports = router;
