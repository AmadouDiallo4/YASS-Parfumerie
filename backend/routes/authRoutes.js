const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { loginSchema } = require('../models/authSchemas');

const router = express.Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authenticateToken, authController.logout);
router.get('/me', authenticateToken, authController.me);

module.exports = router;
