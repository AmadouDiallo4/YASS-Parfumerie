const express = require('express');
const categoryController = require('../controllers/categoryController');
const validate = require('../middlewares/validate');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { categoryCreateSchema, categoryUpdateSchema } = require('../models/categorySchemas');

const router = express.Router();

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);
router.post('/', authenticateToken, validate(categoryCreateSchema), categoryController.createCategory);
router.put('/:id', authenticateToken, validate(categoryUpdateSchema), categoryController.updateCategory);
router.delete('/:id', authenticateToken, categoryController.deleteCategory);

module.exports = router;
