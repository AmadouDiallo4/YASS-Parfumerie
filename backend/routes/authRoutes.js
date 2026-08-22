const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimiters');
const { loginSchema } = require('../models/authSchemas');

const router = express.Router();

router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', authLimiter, authenticateToken, authController.logout);
router.get('/me', authLimiter, authenticateToken, authController.me);

module.exports = router;
