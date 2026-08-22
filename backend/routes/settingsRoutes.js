const express = require('express');
const settingsController = require('../controllers/settingsController');
const validate = require('../middlewares/validate');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { writeLimiter } = require('../middlewares/rateLimiters');
const { settingsUpdateSchema } = require('../models/settingsSchemas');

const router = express.Router();

router.get('/', settingsController.getSettings);
router.put('/', writeLimiter, authenticateToken, validate(settingsUpdateSchema), settingsController.updateSettings);

module.exports = router;
