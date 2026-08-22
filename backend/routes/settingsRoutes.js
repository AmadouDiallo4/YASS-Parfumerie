const express = require('express');
const settingsController = require('../controllers/settingsController');
const validate = require('../middlewares/validate');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { settingsUpdateSchema } = require('../models/settingsSchemas');

const router = express.Router();

router.get('/', settingsController.getSettings);
router.put('/', authenticateToken, validate(settingsUpdateSchema), settingsController.updateSettings);

module.exports = router;
