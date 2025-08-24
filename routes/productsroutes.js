const express = require("express");
const productRouter = express.Router();
const authMiddleware = require("../middlewares/authmiddleware");
const { Productmodels } = require("../models/productmodels");
const Rating = require("../models/ratings"); 

// Get all products
productRouter.get("/api/products", authMiddleware, async (req, res) => {
  try {
    // if you use '/?' //  /api/products?category=electronics
    // const category = req.query.category;
    // const products = await Productmodels.find({category: category});

    // if you use '/:id' //  /api/products/123
    // const id = req.params.id;
    // const product = await Productmodels.findById(id);
    // res.status(200).json(product);

    console.log("This is what is selected: ", req.query.category);
    const products = await Productmodels.find({ category: req.query.category }).populate('ratings');
    res.status(200).json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Search item
productRouter.get(
  "/api/products/search/:searchQuery",
  authMiddleware,
  async (req, res) => {
    try {
      // if you use '/?' //  /api/products?category=electronics
      // const category = req.query.category;
      // const products = await Productmodels.find({category: category});

      // if you use '/:id' //  /api/products/123
      // const id = req.params.id;
      // const product = await Productmodels.findById(id);
      // res.status(200).json(product);

      console.log(`This is what is searched: ${req.params.searchQuery}`);
      const products = await Productmodels.find({
        name: { $regex: req.params.searchQuery, $options: "i" },
      }).populate('ratings');
      res.status(200).json(products);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

// Rating Product
productRouter.post(
  "/api/products/rate-product",
  authMiddleware,
  async (req, res) => {
    try {
      // if you use '/?' //  /api/products?category=electronics
      // const category = req.query.category;
      // const products = await Productmodels.find({category: category});

      // if you use '/:id' //  /api/products/123
      // const id = req.params.id;
      // const product = await Productmodels.findById(id);
      // res.status(200).json(product);

      // Remove the rating if the user has already rated the product
      const { id, rating } = req.body;
      const product = await Productmodels.findById(id);

      console.log("This is the rating: ", rating);

      // Find and remove existing rating (if any)
      const existingRating = await Rating.findOneAndDelete({
        userId: req.user,
        productId: id,
      });

      // If there was an existing rating, remove its reference from the product
      if (existingRating) {
        product.ratings.pull(existingRating._id);
      }

      // Create new rating as separate document
      const newRating = new Rating({
        userId: req.user,
        productId: id,
        rating: rating,
      });
      await newRating.save();

      // Update product's ratings array with the new rating ID
      product.ratings.push(newRating._id);
      await product.save();

      // Populate ratings for the response
      const updatedProduct = await Productmodels.findById(id).populate('ratings');

      res.status(200).json({
        message: "Thank you for rating the product!",
        product: updatedProduct,
      });
      // res.status(200).json({message: "Thank you for rating the product!", product: product});
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

// Get the best selling products
productRouter.get("/api/deal-of-day", authMiddleware, async (req, res) => {
  try {
    let products = await Productmodels.find({}).populate('ratings');
    products = products.sort((a, b) => {
      let aSum = 0;
      for (let i = 0; i < a.ratings.length; i++) {
        aSum += a.ratings[i].rating;
      }

      let bSum = 0;
      for (let i = 0; i < b.ratings.length; i++) {
        bSum += b.ratings[i].rating;
      }
      return aSum < bSum ? 1 : -1;
    });

    res.json(products[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = productRouter;

// if you use '/?' //  /api/products?category=electronics
// const category = req.query.category;
// const products = await Productmodels.find({category: category});

// if you use '/:id' //  /api/products/123
// const id = req.params.id;
// const product = await Productmodels.findById(id);
// res.status(200).json(product);
