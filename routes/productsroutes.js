const express = require('express');
const productRouter = express.Router();
const authMiddleware = require('../middlewares/authmiddleware');
const Productmodels = require('../models/productmodels');

// Get all products
productRouter.get('/api/products', authMiddleware, async (req, res) => {
    try {

        // if you use '/?' //  /api/products?category=electronics
        // const category = req.query.category;
        // const products = await Productmodels.find({category: category});

        // if you use '/:id' //  /api/products/123
        // const id = req.params.id;
        // const product = await Productmodels.findById(id);
        // res.status(200).json(product);

        console.log('This is what is selected: ', req.query.category);
        const products = await Productmodels.find({category: req.query.category});
        res.status(200).json(products);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
}); 


// Search item
productRouter.get('/api/products/search/:searchQuery', authMiddleware, async (req, res) => {
    try{
        console.log('This is what is searched: req.params.searchQuery');
        const products = await Productmodels.find({
            name: {$regex: req.params.searchQuery, $options: 'i'},
        });
        res.status(200).json(products);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

module.exports = productRouter;