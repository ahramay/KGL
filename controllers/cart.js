const express = require("express");
const router = express.Router();
const { Cart } = require("../models/Cart");
const { Product } = require("../models/Product");
const { auth, admin } = require("../middlewares/authorize");

//get cart items for react

router.get("/getcart", auth, async (req, res) => {
  // const owner = req.session.user._id;
  console.log(res.id)
const id =res.id;
  try {
    const cart = await Cart.findOne({ owner: id });
    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "cart is empty.",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "get your cart.",
        data: cart,
      });
    }s
  } catch (error) {
    console.log("==========>", error);

    return res.status(400).json({
      success: false,
      message: "cart is empty",
      error,
    });
  }
});

//add cart
router.post("/", auth, async (req, res) => {
  // const owner = req.session.user;
  const { itemId, quantity } = req.body;
  console.log(res.id)
const id =res.id;
  console.log("=======> quantity ", quantity);
  console.log("=======> itemId", itemId);

  try {
    const cart = await Cart.findOne({ owner:id });
    const item = await Product.findOne({ _id: itemId });

    if (!item) {
      return res.status(400).json({
        success: false,
        message: "item not found",
        error,
      });
    }
    if (!quantity) {
      return res.status(400).json({
        success: false,
        message: "please give your quantity ",
        error,
      });
    }
    const price = item.price;
    const name = item.name;
    const description = item.description;
    var subtotal = item.price;

    console.log("=======> quantity ", quantity);
    console.log("=======> itemId", itemId);
    //If cart already exists for user,
    if (cart) {
      const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
      console.log("--------->itemIndex", itemIndex);
      //check if product exists or not

      if (itemIndex > -1) {
        let product = cart.items[itemIndex];
        product.quantity += quantity;
        product.subtotal = parseInt(product.price * product.quantity);

        console.log("======>product", product);

        cart.bill = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        cart.items[itemIndex] = product;
        await cart.save();
        return res.status(200).json({
          success: true,
          message: "Cart is Added successfully",
          data: cart,
        });
      } else {
        cart.items.push({
          itemId,
          name,
          quantity,
          price,
          description,
          subtotal,
        });
        cart.bill = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        await cart.save();
        return res.status(200).json({
          success: true,
          message: "Cart is Added successfully",
          data: cart,
        });
      }
    } else {
      //no cart exists, create one
      const newCart = await Cart.create({
        owner,
        items: [{ itemId, name, quantity, price, description, subtotal }],
        bill: quantity * price,
      });

      return res.status(200).json({
        success: true,
        message: "Cart is Added successfully",
        data: newCart,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: "something is wrong in cart add process",
      error,
    });
  }
});

//delete the product from the cart product list
router.delete("/decreaseitem", auth, async (req, res) => {
  const owner = req.session.user;
  const itemId = req.query.itemId;
  try {
    let cart = await Cart.findOne({ owner });

    const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
    if (!itemIndex) {
      return res.status(400).json({
        success: false,
        message: "there is no product in cart",
      });
    }

    if (itemIndex > -1) {
      let item = cart.items[itemIndex];
      cart.bill -= item.quantity * item.price;
      // cart.items.subtotal -= parseInt(item.price * item.quantity);

      console.log("=============>cart.bill", cart.bill);
      if (cart.bill < 0) {
        cart.bill = 0;
      }
      cart.items.splice(itemIndex, 1);
      cart.bill = cart.items.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);
      cart = await cart.save();

      return res.status(200).json({
        success: true,
        message: "product is delete successfully from cart",
        data: cart,
      });
    } else {
      return res.status(400).json({
        success: true,
        message: "item not found",
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      success: true,
      message: "something is wrong",
    });
  }
});

router.post("/decreasequantity", auth, async (req, res) => {
  const owner = req.session.user;
  const { itemId } = req.body;

  console.log("=======> itemId del one", itemId);

  let cart = await Cart.findOne({ owner });
  let item = await Product.findOne({ _id: itemId });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found for this user",
    });
  }

  let itemIndex = cart.items.findIndex((p) => p.itemId == itemId);

  if (itemIndex > -1) {
    let productItem = cart.items[itemIndex];
    productItem.quantity -= 1;
    productItem.subtotal -= productItem.price;

    //parseInt(

    cart.bill = cart.items.reduce((acc, curr) => {
      return acc - curr.quantity * -curr.price;
    }, 0);
    //Math.abs(acc - curr.quantity * curr.price);
    cart.items[itemIndex] = productItem;
    cart = await cart.save();

    return res.status(200).json({
      success: true,
      message: "product qauntity is decrease successfully",
      data: cart,
    });
  }
  return res.status(400).json({
    success: false,
    message: "Item does not exist in cart",
  });
});

router.get("/deletefromcart", auth, async (req, res) => {
  userId = req.session.user._id;
  console.log("==========>userid", userId);
  const cart = await Cart.findOneAndDelete({ owner: userId });
  if (!cart) {
    res.json({
      status: 400,
      message: "cart is not found",
    });
  }
  res.json({
    status: 200,
    message: "cart is delete successfully",
  });
});

module.exports = router;
// let result = cart.items.map((a) => {
//   const checkQauntity = a.itemId.quantity > 1;
//   if (checkQauntity) {
//     cart.items.itemId.subtotal =
//       checkQauntity.quantity * checkQauntity.price;
//     console.log("====================>", result);
//   }
// });

// if (cart.items.quantity > 1) {
//   cart.items.itemId.subtotal = cart.items.reduce((acc, curr) => {
//     return acc + curr.quantity * curr.price;
//   }, 0);
//   console.log("=======> subtotal", cart.items.itemId.subtotal);
// }

//delete form the cart

// if (!userId || !isValidObjectId(userId) || !user){
//   return res.status(400).send({ status: false, message: "Invalid user ID" });}
