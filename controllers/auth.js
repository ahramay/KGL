const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const makeTokens = require("../services/maketokens");
const { User } = require("../models/User");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotallyabcSecretKey");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890", 6);
const { auth, admin } = require("../middlewares/authorize");
const { resetPasswordEmail } = require("../services/mailer");

router.post("/signup", async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  const previousUser = await User.find({ email });
  console.log(previousUser);
  if (previousUser.length) {
    return res.status(400).json({
      message: "User already exists.",
    });
  }

  let salt = await bcrypt.genSalt();
  const passwordHashed = await bcrypt.hash(password, salt);
  User.create({
    firstName,
    lastName,
    username,
    email,
    password: passwordHashed,
  })
    .then((created) => {
      return res.status(200).json({
        success: "signup in successfully.",
        user: created,
      });
    })
    .catch((error) => {
      return res.status(400).json({
        errors: error,
      });
    });
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Email is required." });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }
  User.findOne({ username })
    .then((user) => {
      req.session.user = user;

      console.log("the req.cookie ======", req.cookies);
      console.log("the req.session======", req.session);

      if (!user) {
        return res.status(400).json({ message: "Account does't exists." });
      } else {
        bcrypt.compare(password, user.password, async (err, auth) => {
          if (!auth) {
            return res.status(400).json({ message: "Invalid credentials." });
          } else {
             
            token = makeTokens(user._id);
            return res
            .send({ token:  token.token,user:user, message: "logged in successfully" })
           
              .status(200)
             
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong." });
    });
});
router.get("/logout", auth, (req, res) => {
  req.session.destroy((err) => {
    return res.status(400).json({
      success: false,
      message: "Something went wrong.",
    });
  });
  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

router.post("/request_reset_password", async (req, res) => {

  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found.",
    });
  }
  let code = nanoid();
  console.log("========>code", code);
  const cipher = cryptr.encrypt(code);
  console.log("========>cipher", cipher);
  user.code = code;
  await user.save();

  await setTimeout(async () => {
    user.code = null;
    await user.save();
  }, "180000");
  const link = `https://google.com/${cipher}`;
  resetPasswordEmail({
    to: "muhammad.usman@zeikh.com",
    link,
  });

  return res.status(200).json({
    success: true,
    message:
      "A verification email is sent to your email account. Please check your inbox.",
  });
});

router.post("/reset_password/:code", async (req, res) => {
  const { code } = req.params;
  const { email, password } = req.body;
  const decryptedString = cryptr.decrypt(code);
  const user = await User.findOne({ email });
  if (!user) {
    res.status(200).json({
      success: false,
      message: "User not found.",
    });
  }

  if (user.code != decryptedString) {
    return res.status(400).json({
      success: false,
      message: "PIN Code Expired.",
    });
  }
  const salt = await bcrypt.genSalt();
  const passwordHashed = await bcrypt.hash(password, salt);
  await User.findOneAndUpdate({ email }, { password: passwordHashed })
    .then((created) => {
      return res.status(200).json({
        success: true,
        message: "Password updated successfully.",
      });
    })
    .catch((err) => {
      return res.status(400).json({
        success: false,
        message: "Something went wrong...",
      });
    });
});
router.get("/getuser", auth, async (req, res) => {
  const userId = req.session.user._id;
  const user = await User.findOne({ _id: userId });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "this user is not exist",
    });
  }
  return res.status(200).json({
    success: true,
    data: user,
    message: "successfully find user",
  });
});
module.exports = router;
