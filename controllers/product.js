const express = require("express");
const router = express.Router();
const { Product, validateAddProduct } = require("../models/Product");
const { getFileName } = require("../helpers/file");
const { imageUpload } = require("../middlewares/upload");
const { json } = require("express");
const { auth, admin } = require("../middlewares/authorize");

// imageUpload.single("image"),
router.post("/", auth, async (req, res) => {
  const { value, error } = validateAddProduct(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  await new Product(value)
    .save()

    .then((created) => {
      return res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        product: created,
      });
    })

    .catch((err) => {
      return res.status(400).json({
        success: false,
        error: err,
      });
    });
});
// get the 5 product on first page
router.get("/", async (req, res) => {
  const { page = 1 } = req.query;
  const perPage = 5;
  const offset = (page - 1) * perPage;

  const product = await Product.find({ isDeleted: false })
    .sort({ createdAt: 1 })
    .skip(offset)
    .limit(perPage);
  if (!product.length) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }
  return res.status(200).json({
    success: true,
    product: product,
  });
});

//get specific product
router.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const product = await Product.find({ _id: id, isDeleted: false });
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }
  return res.status(200).json({
    success: true,
    product: product,
  });
});
//soft delete the product
router.post("/delete/:id", auth, async (req, res) => {
  const { id } = req.params;

  Product.findOneAndUpdate({ _id: id }, { isDeleted: true })
    .then((updated) => {
      return res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
      });
    })
    .catch((err) => {
      return res.status(400).json({
        success: false,
        error: err,
      });
    });
});
// hard delete the product
router.get("/delete/:id", auth, async (req, res) => {
  const { id } = req.params;
  Product.deleteOne({ _id: id })
    .then((deleted) => {
      if (!deleted) {
        console.log("Cannot find product with this id.");
        return res.json({
          status: 400,
          message: "Cannot find product with this id",
        });
      }
      return res.json({
        status: 400,
        message: "product deleted successfully",
        data: deleted,
      });
    })
    .catch((err) => {
      console.log("Error: ", err);
      return res.json({
        status: 400,
        message: "Cannot find product with this id",
        err,
      });
    });
});
module.exports = router;
