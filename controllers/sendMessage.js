const express = require("express");
const router = express.Router();
const { SendUsMessage } = require("../services/mailer");
const { SendMessage } = require("../models/SendMessage");
router.post("/", async (req, res) => {
  const owner = res.id;
  const { value, error } = req.body;
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
  const createMessage = await SendMessage(value).save();
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

module.exports = router;
