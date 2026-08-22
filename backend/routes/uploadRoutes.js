const express = require('express');
const uploadController = require('../controllers/uploadController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/', authenticateToken, upload.single('image'), uploadController.uploadImage);

module.exports = router;
