const express = require("express");
const adminRouter = express.Router();
const adminMiddleware = require("../middlewares/adminmiddleware");
const { Productmodels } = require("../models/productmodels"); // Import adminroutes middleware for authorization

// Add product
adminRouter.post("/admin/add-product", adminMiddleware, async (req, res) => {
  try {
    const { name, price, description, images, quantity, category } = req.body;
    let product = new Productmodels({
      name,
      price,
      description,
      images,
      quantity,
      category,
    });
    product = await product.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: product });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all products
adminRouter.get("/admin/get-products", adminMiddleware, async (req, res) => {
  try {
    const products = await Productmodels.find({}).populate('ratings');
    res.status(200).json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete product
adminRouter.post("/admin/delete-product", adminMiddleware, async (req, res) => {
  try {
    const { id } = req.body;
    let product = await Productmodels.findByIdAndDelete(id);
    // res.status(200).json({message: "Product deleted successfully...", product: product});
    res.status(200).json({ message: "Product deleted successfully..." });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = adminRouter;
