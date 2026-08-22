const express = require('express');
const productController = require('../controllers/productController');
const validate = require('../middlewares/validate');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { writeLimiter } = require('../middlewares/rateLimiters');
const {
  productCreateSchema,
  productUpdateSchema,
  productQuerySchema
} = require('../models/productSchemas');

const router = express.Router();

router.get('/', validate(productQuerySchema, 'query'), productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', writeLimiter, authenticateToken, validate(productCreateSchema), productController.createProduct);
router.put('/:id', writeLimiter, authenticateToken, validate(productUpdateSchema), productController.updateProduct);
router.delete('/:id', writeLimiter, authenticateToken, productController.deleteProduct);

module.exports = router;
