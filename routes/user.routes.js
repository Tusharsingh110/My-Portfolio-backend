const express = require('express')
const { authenticate } = require('../middlewares/auth.middleware');
const router =  express.Router();
const userController = require("../controllers/user.controller");


router.post('/login', userController.login);
router.post('/signup', userController.signup);

// PROTECTED ROUTES
router.get('/get-user', authenticate , userController.getUserDetails)

module.exports = router;