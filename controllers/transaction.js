const express = require("express");
const router = express.Router();
const { Cart } = require("../models/Cart");
const { Transaction } = require("../models/Transaction");
const { Product } = require("../models/Product");
const { Order } = require("../models/Order");
const { auth, admin } = require("../middlewares/authorize");
const { User } = require("../models/User");
// const {
//   Testtransaction,
//   validateTesttransaction,
// } = require("../models/Testtransaction");
const { customAlphabet } = require("nanoid");
let publishKey = process.env.Stripe_Publishable_key;
let secretKey = process.env.Stripe_Secret_key;
const stripe = require("stripe")(secretKey);
//api/v1/checkout/addorder

router.post("/addorder",auth, async (req, res) => {
//  const owner = req.session.user._id;
console.log(res.id)
const id =res.id; 

console.log("dfdf",res.id)
  let cart = await Cart.findOne({ owner: id });

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
});
// transaction//auth
//api/v1/checkout/purchase
router.post("/purchase", async (req, res) => {
  // try {
  const owner = req.session.user._id;
  let user = req.session.user;
  let payload = req.body;

  console.log("------>owner", owner);
  console.log("------>payload", payload);

  //find cart and user

  if (!user) {
    res.status(400).json({
      success: false,
      message: "user with this id not found.",
    });
  }
  const order = await Order.findOne({
    owner: owner,
  });
  if (!order) {
    res.status(400).json({
      success: false,
      message: "order with this id not found.",
    });
  }
  console.log("------>session.user.email", user.email);

  if (order) {
    payload = { ...payload, amount: order.account, email: user.email };
    stripe.customers
      .create({
        email: user.email,
        source: req.body.stripeToken,
      })
      .then((customer) => {
        console.log("========>stripeToken", req.body.stripeToken);
        console.log("========>", req.body.amount);
        stripe.charges.create({
          amount: req.body.amount, //*
          currency: "usd",
          description: "Tests Charges",
          customer: customer.id,
        });
      })
      .then((charge) => {
        console.log("===========> charge here", charge);
        return res.status(200).json({
          success: true,
          message: "customer and charger is successfull.",
          data: charge,
        });
      })
      .catch((err) => {
        console.log("==========>", err);
        // If some error occurs
        return res.status(400).json({
          success: false,
          message: "charge is faild.",
          err,
        });
      });

    // if (charge.status === Success) {
    //   const nanoid = customAlphabet("ABCDEFGHIJKL01234MNOPQRSTUVWXYZ56789", 8); //abcdefghijklmnopqrstuvwxyz
    //   //customAlphabet
    //   const alphanumeriCode = nanoid();
    //   console.log("==============nanoid", alphanumeriCode); // sample outputs => 455712511712968405, 753952709650782495

    //   //delete cart after paid successfull
    //   const data = await Cart.findByIdAndDelete({ _id: owner });
    //   return res.status(200).json({
    //     success: true,
    //     message: "payment successful and to db and delete from cart",
    //     data: data,
    //   });
    // } else {
    //   res.status(400).json({
    //     success: false,
    //     message: "charge not found",
    //   });
    // }

    // const addTransaction = await Transaction.create({
    //   owner,
    //   cartItems: [...order.cartitems],
    //   bill: order.amount,
    //   paidcustomer: customer.id,
    //   paidcharges: charge,
    //   code: alphanumeriCode,
    // });
    // if (!addTransaction) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "transaction is not created.",
    //   });
    // }

    // return res.status(200).json({
    //   success: true,
    //   message: "paid successful and add to transaction",
    //   data: addTransaction,
    // });
    //}
    // } catch (error) {
    //   console.log(error);

    //   return res.status(400).json({
    //     success: false,
    //     message: "invalid request",
    //     error,
    //   });
  }
});
//api/v1/checkout/createtransaction

router.get("/getorder", auth, async (req, res) => {
  console.log(res.id)
const id =res.id; 

  await Order.findOne({
    owner: id,
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

router.post("/createtransaction", auth, async (req, res) => {
  let owner = req.session.user._id;
  console.log("======>owner", owner);

  const { value, error } = validateTesttransaction(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  console.log("======>value", value);

  const nanoid = customAlphabet("ABCDEFGHIJKL01234MNOPQRSTUVWXYZ56789", 8); //abcdefghijklmnopqrstuvwxyz
  //customAlphabet
  const alphanumeriCode = nanoid();
  console.log("==============nanoid", alphanumeriCode); // sample outputs => 455712511712968405, 753952709650782495

  await Testtransaction({
    owner: owner,
    payment: value.payment,
    code: alphanumeriCode,
  })
    .save()

    .then((created) => {
      return res.status(200).json({
        success: true,
        message: "added updated successfully.",
        data: created,
      });
    })

    .catch((err) => {
      return res.status(400).json({
        success: false,
        error: err,
      });
    });

  const getData = await Testtransaction.findOne({ owner: owner });
  var user = await User.findOne({ _id: owner });
});

module.exports = router;
