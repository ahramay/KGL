const express = require("express");
const router = express.Router();
const { auth, admin } = require("../middlewares/authorize");
const { User } = require("../models/User");
const { Coinhistory } = require("../models/Coinhistory");
const { Transaction } = require("../models/Transaction");
const { Redeemed } = require("../models/Redeemed");
const moment = require("moment");

//api/v1/coins/redeemedcoins(endpoint)
router.post("/redeemedcoins", auth, async (req, res) => {
  const { code } = req.body;
  var id = res.id;
  var owner = res.id;
  console.log("........>", code);
  console.log("........userId>", id);
  // if (code.length > 8 && code.length < 8) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "digits are invalid",
  //   });
  // }
  try {
    // return console.log("======>", code.length);

    const getRedeemed = await Redeemed.findOne({
      code: code,
      owner: owner,
      isDeleted: false,
    });
    if (getRedeemed) {
      return res.status(400).json({
        success: false,
        message: "This code has already been redeemed",
      });
    }
    console.log("========>getRedeemed", getRedeemed);

    const getTransaction = await Transaction.findOne({
      code: code,
      owner: owner,
      isDeleted: false,
    });
    console.log("========>getTransaction", getTransaction);
    if (getTransaction.isRedeemed === true) {
      return res.status(400).json({
        success: false,
        message: "This code has already been redeemed",
      });
    }
    // const invalidTransaction = await Transaction.findOne({
    //   owner: owner,
    //   code: code,
    // });
    // console.log(".........invalidTransaction ", invalidTransaction);
    // if (invalidTransaction !== code) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "This code is invalid",
    //   });
    // }

    const addCoin = await Transaction.findOne({
      code: code,
      owner: owner,
      isDeleted: false,

      // isRedeemed: false,
    });

    let getUserCoins = await User.findOne({ _id: id });

    if (addCoin) {
      console.log("..........>addCoin", addCoin);
      var addedCoins = addCoin.payment; // parseInt(addCoin.payment);
      console.log("..........>getUserCoins.coins", getUserCoins.coins);
      var paidcoins = parseInt(getUserCoins.coins) + parseInt(addCoin.payment);
      //parseInt(getUserCoins.coins)
      console.log("/..........paidcoins", paidcoins);
      const AddedUser = await User.findOneAndUpdate(
        { _id: id },
        { coins: paidcoins },
        { new: true }
        //"coins.paidCoins"
      );
      console.log("..........>AddedUser", AddedUser);
      const createCoinHistory = await Coinhistory.create({
        owner: owner,
        totalCoins: getUserCoins.coins,
        addCoins: addedCoins,
      });
      if (!createCoinHistory) {
        return res.status(400).json({
          success: false,
          message: "Warning! Cannot add coins",
        });
      }
      const createRedeemed = await Redeemed.create({
        owner: owner,
        code: code,
        coins: addedCoins,
      });
      if (!createRedeemed) {
        return res.status(400).json({
          success: false,
          message: "coin is not redeem",
        });
      }
      const updatedTesttransaction = await Transaction.findOneAndUpdate(
        { code: code, isDeleted: false },
        { isRedeemed: true },
        { new: true }
      );
      if (!updatedTesttransaction) {
        return res.status(400).json({
          success: false,
          message: "coin is not redeem",
        });
      }
      return res.status(200).json({
        sucess: true,
        message: addCoin.payment,
        data: AddedUser,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Warning! Cannot add coins",
      });
    }
  } catch (error) {
    console.log("=========>", error);
    return res.status(400).json({
      sucess: false,
      message: "This is an invalid code.Kindly add the code again.",
      //"Warning! Something went wrong with coin."
    });
  }
});
router.post("/deducted", auth, async (req, res) => {
  const { number } = req.body; //req.query;
  const id = res.id;
  console.log("........>id", id);
  console.log("........>number", number);

  try {
    const checkCoins = await User.findOne({ _id: id });

    var minusCoins = parseInt(number);
    console.log("........>minusCoins", minusCoins);

    if (number > 1) {
      var paidcoins = parseInt(checkCoins.coins) - parseInt(number);
      console.log("........>paidcoins", paidcoins);
      if (paidcoins < 0) {
        return res.status(400).json({
          success: false,
          message:
            "your coins is less for this charge, kindly redeem your coins",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Warning! Send only positive interger.",
      });
    }

    if (checkCoins.coins) {
      const updateCoins = await User.findOneAndUpdate(
        { _id: id },
        { coins: paidcoins },
        { new: true }
      );
      const deductedCoinHistory = await Coinhistory.create({
        owner: id,
        totalCoins: checkCoins.coins,
        subtractionCoins: minusCoins,
      });
      res.status(200).json({
        sucess: true,
        message: "Coins updated sucessfully.",
        data: updateCoins,
      });
    } else {
      return res.status(400).json({
        sucess: false,
        message: "Something went wrong.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      sucess: false,
      message: "Warning! Something went wrong with coins.",
    });
  }
});
router.post("/woncoins", auth, async (req, res) => {
  const { number } = req.body; //req.query;
  const id = res.id;
  console.log("........>id", id);
  console.log("........>number", number);

  try {
    const checkCoins = await User.findOne({ _id: id });

    var AddCoins = parseInt(number);
    console.log("........>minusCoins", AddCoins);
    console.log("........>", checkCoins);

    if (number > 1) {
      var paidcoins = parseInt(checkCoins.coins) + parseInt(number);
      console.log("........>paidcoins", paidcoins);
      if (paidcoins < 0) {
        return res.status(400).json({
          success: false,
          message:
            "your coins is less for this charge, kindly redeem your coins",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Warning! Send only positive interger.",
      });
    }

    if (checkCoins.coins) {
      const updateCoins = await User.findOneAndUpdate(
        { _id: id },
        { coins: paidcoins },
        { new: true }
      );
      const deductedCoinHistory = await Coinhistory.create({
        owner: id,
        totalCoins: checkCoins.coins,
        addCoins: AddCoins,
      });
      res.status(200).json({
        sucess: true,
        message: "Coins updated sucessfully.",
        data: updateCoins,
      });
    } else {
      return res.status(400).json({
        sucess: false,
        message: "Something went wrong.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      sucess: false,
      message: "Warning! Something went wrong with coins.",
    });
  }
});

router.get("/getcoins", async (req, res) => {
  try {
    const userid = res.id;
    await User.findOne({ _id: userid, isDeleted: false }).then((response) => {
      return res.status(200).send({
        success: true,
        response,
      });
    });
  } catch (error) {
    return res.status(400).json({
      sucess: false,
      message: "Something went wrong.",
    });
  }
});
module.exports = router;
