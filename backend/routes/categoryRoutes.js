const express = require('express');
const categoryController = require('../controllers/categoryController');
const validate = require('../middlewares/validate');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { writeLimiter } = require('../middlewares/rateLimiters');
const { categoryCreateSchema, categoryUpdateSchema } = require('../models/categorySchemas');

const router = express.Router();

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);
router.post('/', writeLimiter, authenticateToken, validate(categoryCreateSchema), categoryController.createCategory);
router.put('/:id', writeLimiter, authenticateToken, validate(categoryUpdateSchema), categoryController.updateCategory);
router.delete('/:id', writeLimiter, authenticateToken, categoryController.deleteCategory);

module.exports = router;
