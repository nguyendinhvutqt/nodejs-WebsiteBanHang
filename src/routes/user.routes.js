const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/user.controller');

router.post('/sign-in', loginUser);

module.exports = router;