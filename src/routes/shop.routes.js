const express = require('express');
const router = express.Router();
const Product = require('../models/product.model')

router.get('/', async (req, res) => {
    const newProducts = await Product.find().limit(3).sort({createdAt: 'desc'});
    const products = await Product.find().limit(8);
    console.log(products);
    res.render('user/home', { newProducts, products })
})


module.exports = router