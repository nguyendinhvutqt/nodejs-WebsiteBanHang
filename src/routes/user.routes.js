const express = require('express');
const router = express.Router();
const { 
    getLoginPage, 
    loginUser,
    getRegisterPage,
    registerUser
} = require('../controllers/user.controller');


router.get('/sign-in', getLoginPage).post('/sign-in', loginUser);
router.get('/sign-up', getRegisterPage).post('/sign-up', registerUser);

module.exports = router;