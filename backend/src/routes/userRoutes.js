const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const userController = require('../controllers/userController');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {error:'Too many login attempts, try again later.'}
});


router.post('/login', loginLimiter, userController.loginUser);
router.post('/register', userController.registerUser);
router.post('/logout', userController.authenticate, userController.logoutUser);
router.get('/refresh', userController.authenticate, userController.refreshToken);
router.get('/me', userController.authenticate, userController.me);
module.exports = router;