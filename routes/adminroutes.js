const express = require('express');
const adminRouter = express.Router();
const adminroutes = require('../middlewares/adminmiddleware');
const Productmodels = require("../models/productmodels"); // Import adminroutes middleware for authorization

// Add product
adminRouter.post('/admin/add-product', async (req, res) => {
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
        res.json({product: product});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
})
