const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcrypt");
const makeTokens = require("../services/maketokens");
const {
  User,
  validateUpdateUser,
  validateChangePassword,
  validateDeleteUserPassword
} = require("../models/User");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotallyabcSecretKey");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890", 6);
const { auth, admin } = require("../middlewares/authorize");
const { resetPasswordEmail } = require("../services/mailer");
const session = require("express-session");
const { Session } = require("express-session");
const cookieParser = require("cookie-parser");
const { setDriver } = require("mongoose");
const { json } = require("body-parser");
const moment = require("moment");
const { UserLogoutSession } = require("../models/Userlogoutsession");
const { Logincoins } = require("../models/Logincoins");

router.post("/signup", async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  const previousUser = await User.find({ email });
  console.log(previousUser);
  if (previousUser.length) {
    return res.status(400).json({
      message: "Email Already exist.",
    });
  }
  const previousUsername = await User.find({ username });
  console.log(previousUsername);
  if (previousUsername.length) {
    return res.status(400).json({
      message: "Username Already exist.",
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
    return res.status(400).json({ message: "Username is required." });
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
        return res.status(400).json({ message: "Account doesn't exist." });
      } else {
        bcrypt.compare(password, user.password, async (err, auth) => {
          if (!auth) {
            return res.status(400).json({ message: "Invalid Credentials." });
          } else {
            token = makeTokens(user._id);
            return res.status(200).send({
              token: token.token,
              user: user,
              message: "logged in successfully",
            });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong." });
    });
});
router.get("/logout", auth, async (req, res) => {
  try {
    const logoutUser = await req.session.destroy();

    if (!logoutUser) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong.",
        err,
      });
    }
    console.log("===========>logoutUser");
    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "User is already logout. kindly login again please.",
      err,
    });
  }
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
  // const cipher = cryptr.encrypt(code);
  // console.log("========>cipher", cipher);
  user.code = code;
  await user.save();

  await setTimeout(async () => {
    user.code = null;
    await user.save();
  }, "180000");
  const link = code; //`https://google.com/${cipher}`;
  resetPasswordEmail({
    to: email,
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
  let { email, password } = req.body;
  console.log("======>email", email);
  let decryptedString = code; // cryptr.decrypt(code);
  let user = await User.findOne({ email });
  if (!user) {
    res.status(200).json({
      success: false,
      message: "User not found.",
    });
  }
  console.log("======>user", user);
  console.log("======>user.code", user.code);
  console.log("======>code", code);

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

router.put("/update_profile", auth, async (req, res) => {
  const id = res.id;
  let { value, error } = validateUpdateUser(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const getUser = await User.findOne({ _id: id });
  const { firstName, username, phoneno, email, currentpassword, password } =
    value;

  const data = {
    firstName,
    username,
    email,
    phoneno,
  };
  console.log("======>data", data);

  if (currentpassword) {
    bcrypt.compare(currentpassword, getUser.password, async (err, auth) => {
      if (!auth) {
        return res.status(400).json({
          success: false,
          message: "old password is not matched, try again.",
        });
      }
    });
  }
  if (password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(
    getUser._id,
    { $set: data },
    { new: true }
  );
  res.status(200).json({
    success: true,
    data: updatedUser,
    message: "User Profile updated successfully",
  });
});
router.put("/change_password", auth, async (req, res) => {
  const id = res.id;
  let { value, error } = validateChangePassword(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const getUser = await User.findOne({ _id: id });
  const { currentpassword, password } = value;

  const data = {
    currentpassword,
    password,
  };
  console.log("======>data", data);

  if (!password) {
    return res
      .status(400)
      .json({ success: false, message: "Password is required." });
  }
  if (!currentpassword) {
    return res
      .status(400)
      .json({ success: false, message: "Password is required." });
  }
  if (currentpassword) {
    bcrypt.compare(currentpassword, getUser.password, async (err, auth) => {
      if (!auth) {
        return res.status(400).json({
          success: false,
          message: "old password is not matched, try again.",
        });
      }
    });
  }
  if (password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(password, salt);
  }

  // data.dateOfBirth = moment(value.dateOfBirth, "DD/MM/YYYY").toDate();

  const updatedUser = await User.findByIdAndUpdate(
    getUser._id,
    { $set: data },
    { new: true }
  );
  res.status(200).json({
    success: true,
    data: updatedUser,
    message: "Updated User Password Successfully",
  });
});
router.delete("/deleteuser", auth, async (req, res) => {
  const id = res.id;
  console.log("==========>", id);
  const { value, error } = validateDeleteUserPassword(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const findUser = await User.findOne({ _id: id });
  if (!findUser) {
    return res.status(400).json({
      success: false,
      message: "this user is not exists",
    });
  }

  const { password } = value;

  if (!password) {
    return res
      .status(400)
      .json({ success: false, message: "Password is required." });
  }
  const validPassword = await bcrypt.compare(password, findUser.password);
  if (!validPassword) {
    return res.status(400).json({
      success: false,
      message: "Invalid Password",
    });
  }

  const delUser = await User.findOneAndDelete({ _id: findUser._id });
  if (!delUser) {
    return res.status(400).json({
      success: false,
      message: "this user is not exists",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Your Account Deleted Successfully",
  });
});

module.exports = router;
