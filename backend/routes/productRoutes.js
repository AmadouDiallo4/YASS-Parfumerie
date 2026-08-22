const express = require('express');
const productController = require('../controllers/productController');
const validate = require('../middlewares/validate');
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  productCreateSchema,
  productUpdateSchema,
  productQuerySchema
} = require('../models/productSchemas');

const router = express.Router();

router.get('/', validate(productQuerySchema, 'query'), productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', authenticateToken, validate(productCreateSchema), productController.createProduct);
router.put('/:id', authenticateToken, validate(productUpdateSchema), productController.updateProduct);
router.delete('/:id', authenticateToken, productController.deleteProduct);

module.exports = router;
