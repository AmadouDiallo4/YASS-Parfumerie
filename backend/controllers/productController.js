const asyncHandler = require('../utils/asyncHandler');
const productService = require('../services/productService');

const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.listProducts(req.query);
  res.json({ success: true, ...result });
});

const getProduct = asyncHandler(async (req, res) => {
  const item = await productService.getProductById(Number(req.params.id));
  res.json({ success: true, data: item });
});

const createProduct = asyncHandler(async (req, res) => {
  const item = await productService.createProduct(req.body);
  res.status(201).json({ success: true, data: item });
});

const updateProduct = asyncHandler(async (req, res) => {
  const item = await productService.updateProduct(Number(req.params.id), req.body);
  res.json({ success: true, data: item });
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(Number(req.params.id));
  res.json({ success: true, message: 'Produit supprimé' });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
