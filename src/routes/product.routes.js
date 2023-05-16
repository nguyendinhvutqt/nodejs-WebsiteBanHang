const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/uploadImage')

const { 
    getProductPage,
    getAddProduct,
    addProduct,
    getEditProduct,
    editProduct,
    deleteProduct
} = require('../controllers/product.controller');

router.get('/', getProductPage);
router.get('/add-product', getAddProduct).post('/add-product', upload.single('image'), addProduct);
router.get('/edit-product/:id', getEditProduct).post('/edit-product/:id', upload.single('image'), editProduct);
router.get('/delete-product/:id', deleteProduct)

module.exports = router