const Product = require('../models/product.model');

exports.home = async (req, res) => {
    return res.render('admin/home')
}