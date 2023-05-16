const express = require('express');
const router = express.Router();
const {
    getCategory,
    getAddCategory,
    addCategory,
    getEditCategory,
    editCategory,
    delCategory
} = require('../controllers/category.controller')

router.get('/add-category', getAddCategory).post('/add-category', addCategory);
router.get('/:id', getCategory);
router.get('/edit-category/:id', getEditCategory).post('/edit-category/:id', editCategory);
router.get('/delete-category/:id', delCategory);

module.exports = router;