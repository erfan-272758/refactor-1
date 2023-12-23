const express = require('express');
const User = require('../models/User');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/signup', authController.signUp);

router.post('/login', authController.login);

router.get('/getName', isAuth, authController.getName);

module.exports = router;