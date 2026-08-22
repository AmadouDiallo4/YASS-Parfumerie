const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { writeLimiter } = require('../middlewares/rateLimiters');

const router = express.Router();

router.get('/', writeLimiter, authenticateToken, dashboardController.getDashboard);

module.exports = router;
