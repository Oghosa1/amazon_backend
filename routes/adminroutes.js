const express = require('express');
const adminRouter = express.Router();
const adminMiddleware = require('../middlewares/adminmiddleware');
const Productmodels = require("../models/productmodels"); // Import adminroutes middleware for authorization

// Add product
adminRouter.post('/admin/add-product', adminMiddleware, async (req, res) => {
    try {
        const {name, price, description, images, quantity, category} = req.body;
        let product = new Productmodels({
            name,
            price,
            description,
            images,
            quantity,
            category});
        product = await product.save();
        // res.json({product: product});
        res.status(500).json({message: "Product added successfully", product: product});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

module.exports = adminRouter;
