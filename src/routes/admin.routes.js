const express = require("express");
const router = express.Router();
const { 
    addCategory,
    getCategory
} = require('../controllers/category.controller');

router.get('/home', (req, res) => {
    return res.render('admin/home');
})
router.get('/category', getCategory);
router.get('/add-category', addCategory);

module.exports = router;