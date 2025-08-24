const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware");
// const Usermodels = require("../models/usermodels");
const { Productmodels } = require("../models/productmodels");
const { Usermodels } = require("../models/usermodels");
const userRouter = express.Router();

userRouter.post("/api/add-to-cart", authMiddleware, async (req, res) => {
  try {
    const { id } = req.body;

    // Validate product exists
    const product = await Productmodels.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Get user (no need to populate cart for this operation)
    let user = await Usermodels.findById(req.user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find if product already exists in cart (comparing ObjectIds)
    const existingCartItem = user.cart.find(
      (item) => item.product.toString() === id.toString()
    );

    if (existingCartItem) {
      // Product exists, increment quantity
      existingCartItem.quantity += 1;
    } else {
      // Product doesn't exist, add new item (store only product ID)
      user.cart.push({ product: id, quantity: 1 });
    }

    // Save user with updated cart
    user = await user.save();

    // Populate cart products before sending response
    await user.populate("cart.product");

    res.json({ message: "Product added to cart", user: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user cart with populated product details (Referenced Database Approach)
userRouter.get("/api/get-cart", authMiddleware, async (req, res) => {
  try {
    // Get user and populate cart products in one query
    const user = await Usermodels.findById(req.user).populate("cart.product");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item from cart (Referenced Database Approach)
userRouter.delete(
  "/api/remove-from-cart/:productId",
  authMiddleware,
  async (req, res) => {
    try {
      const { productId } = req.params;

      // Get user
      let user = await Usermodels.findById(req.user);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Find cart item (get the actual item to check quantity)
      const cartItem = user.cart.find(
        (item) => item.product.toString() === productId.toString()
      );

      if (!cartItem) {
        return res.status(404).json({ error: "Product not found in cart" });
      }

      // Enhanced logic: reduce quantity or remove item completely
      if (cartItem.quantity > 1) {
        // Reduce quantity by 1 if more than 1
        cartItem.quantity -= 1;
      } else {
        // Remove item completely if quantity is 1
        const cartItemIndex = user.cart.findIndex(
          (item) => item.product.toString() === productId.toString()
        );
        user.cart.splice(cartItemIndex, 1);
      }

      // Save user
      user = await user.save();

      // Populate cart products before sending response
      await user.populate("cart.product");

      res.json({ message: "Product removed from cart", user: user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update cart item quantity (Referenced Database Approach)
userRouter.put("/api/update-cart", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    // Get user
    let user = await Usermodels.findById(req.user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find cart item (comparing ObjectIds)
    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId.toString()
    );

    if (!cartItem) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // Update quantity
    cartItem.quantity = quantity;

    // Save user
    user = await user.save();

    // Populate cart products before sending response
    await user.populate("cart.product");

    res.json({ message: "Cart updated", user: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = userRouter;
