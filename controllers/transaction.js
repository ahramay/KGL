const express = require("express");
const router = express.Router();
const { Cart } = require("../models/Cart");
const { Transaction } = require("../models/Transaction");
const { Product } = require("../models/Product");
const { Order } = require("../models/Order");
const { Redeemed } = require("../models/Redeemed");
const { auth, admin } = require("../middlewares/authorize");
const { User } = require("../models/User");
const {
  Testtransaction,
  validateTesttransaction,
} = require("../models/Testtransaction");
const { customAlphabet } = require("nanoid");
let publishKey = process.env.Stripe_Publishable_key;
let secretKey = process.env.Stripe_Secret_key;
const stripe = require("stripe")(secretKey);
//api/v1/checkout/addorder

router.post("/addorder", auth, async (req, res) => {
  try {
    const owner = res.id;

    console.log("------>owner", owner);

    let cart = await Cart.findOne({ owner: owner, isDeleted: false });
    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "something is wrong.",
      });
    }
    let order = await Order.findOne({
      owner: owner,
      status: "In processing",
      isDeleted: false,
    });
    if (!order) {
      console.log("------>cart", cart);
      await Order({
        owner: cart.owner,
        cartitems: [...cart.items],
        amount: cart.bill,
      })
        .save()
        .then((addOrder) => {
          console.log("=========> added order", addOrder);
          return res.status(200).json({
            success: true,
            message: "get your cart in order progress",
            data: addOrder,
          });
        })
        .catch((err) => {
          console.log("========>", err);
          return res.status(400).json({
            success: false,
            message: "something is wrong.",
          });
        });
    } else {
      const removeOrder = await Order.findOneAndRemove({
        owner: owner,
        status: "In processing",
        isDeleted: false,
      });
      if (!removeOrder) {
        return res.status(400).json({
          success: false,
          message: "did not delete last order to update new one.",
        });
      }
      const updatedOrder = await Order.create({
        owner: owner,
        owner: cart.owner,
        cartitems: [...cart.items],
        amount: cart.bill,
      });
      return res.status(200).json({
        success: true,
        message: "your data exists in order",
        data: updatedOrder,
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "something went wrong",
      error,
    });
  }
});

router.get("/getpubkey", auth, async (req, res) => {
  if (publishKey) {
    return res.status(200).json({
      success: true,
      message: "it is publishkey.",
      publishKey: publishKey,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "there is no publishkey.",
    });
  }
});

router.post("/purchase", auth, async (req, res) => {
  try {
    var owner = res.id;
    console.log("====>owner", owner);
    let { id } = req.body;
    console.log("========>id.cards,", id);
    console.log("ds", req.body.amount);
    var charge = await stripe.paymentIntents.create({
      amount: req.body.amount * 100,
      currency: "USD",
      description: "Tests Charges",
      payment_method: id,
      confirm: true,
    });
    if (!charge) {
      return res.status(400).json({
        success: false,
        message: "charge is failed.",
        err,
      });
    }

    console.log("--------->", charge);
    var nanoid = customAlphabet(
      "ABCDE01234FGHIJKL01234MNO56789PQR56789STUVW01234XYZ56789",
      8
    );

    if (charge.status == "succeeded") {
      console.log("--------->charge successfully");
      const alphanumeriCode = nanoid();
      console.log("==============nanoid", alphanumeriCode);
      const checkedIsRedeemd = await Transaction.findOne({
        code: alphanumeriCode, //   isRedeemed: true,
      });
      console.log("--------->Transaction>checkedIsRedeemd", checkedIsRedeemd);
      const codeGenerated = await Redeemed.findOne({ code: alphanumeriCode });
      console.log("--------->Redeemed>codeGenerated", codeGenerated);
      if (codeGenerated && checkedIsRedeemd) {
        let againAlphanumeriCode = nanoid();

        const updateOrder = await Order.findOneAndUpdate(
          { owner: owner, isDeleted: false },
          { $set: { status: "Paid Successfully", isDeleted: true } },
          { new: true }
        );

        console.log("===========>updateOrder", updateOrder);
        if (!updateOrder) {
          res.status(400).json({
            success: false,
            message: "transaction is not created.",
          });
        }

        const findCartDel = await Cart.findOneAndUpdate(
          { owner: owner, isDeleted: false },
          { $set: { isDeleted: true } },
          { new: true }
        );

        console.log("--------->CartfindCartDel", findCartDel);
        if (!findCartDel) {
          return res.status(400).json({
            success: false,
            message: "cart is not deleted.",
          });
        }
        console.log("===========>charge.id", charge.id);
        const addTransaction = await Transaction.create({
          owner: owner,
          // cartItems: [...order.cartitems],
          payment: charge.amount / 100,
          // cards: id, //id.cards,
          transactionId: charge.id,
          code: againAlphanumeriCode,
        });
        console.log("===========>addTransaction", addTransaction);
        if (!addTransaction) {
          return res.status(400).json({
            success: false,
            message: "transaction is not created.",
          });
        }

        return res.status(200).json({
          success: true,
          message: "paid successful and add to transaction",
          data: addTransaction,
        });
      } else {
        const updateOrder = await Order.findOneAndUpdate(
          { owner: owner, isDeleted: false },
          { $set: { status: "Paid Successfully", isDeleted: true } },
          { new: true }
        );

        console.log("===========>updateOrder", updateOrder);
        if (!updateOrder) {
          res.status(400).json({
            success: false,
            message: "order is not updated.",
          });
        }

        const findCartDel = await Cart.findOneAndUpdate(
          { owner: owner, isDeleted: false },
          { $set: { isDeleted: true } },
          { new: true }
        );

        console.log("========>findCartDel", findCartDel);

        if (!findCartDel) {
          return res.status(400).json({
            success: false,
            message: "cart is not deleted.",
          });
        }

        const addTransaction = await Transaction.create({
          owner: owner,
          // cartItems: [...order.cartitems],
          payment: charge.amount / 100,
          // cards: id, //id.cards,
          transactionId: charge.id,
          code: alphanumeriCode,
        });
        if (!addTransaction) {
          return res.status(400).json({
            success: false,
            message: "transaction is not created.",
          });
        }
        return res.status(200).json({
          success: true,
          message: "paid successful and add to transaction",
          data: addTransaction,
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "charge not found",
      });
    }
  } catch (err) {
    console.log("==========>", err);

    return res.status(400).json({
      success: false,
      message: "charge is failed.",
      err,
    });
  }
});
router.get("/getorder", auth, async (req, res) => {
  console.log(res.id);
  const id = res.id;

  await Order.findOne({
    owner: id,
    isDeleted: false,
  })

    .then((getData) => {
      console.log("=========> get order", getData);

      return res.status(200).json({
        success: true,
        message: "get data successfully.",
        data: getData,
        publishKey: publishKey,
      });
    })
    .catch((err) => {
      console.log("========>", err);
      return res.status(400).json({
        success: false,
        error: err,
      });
    });
});
router.get("/getusercode", auth, async (req, res) => {
  const owner = res.id;
  console.log("user", owner);
  const getCode = await Transaction.find({
    owner: owner,
    isDeleted: false,
    isRedeemed: false,
  }); //.sort({ createdAt: "desc" });
  if (!getCode) {
    res.status(400).json({
      success: false,
      message: "there is no code with this user please try again.",
    });
  }
  console.log("getCode=====>", getCode);
  res.status(200).json({
    success: true,
    data: getCode,
  });
});
module.exports = router;
