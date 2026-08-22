const asyncHandler = require('../utils/asyncHandler');
const categoryService = require('../services/categoryService');

const getCategories = asyncHandler(async (_req, res) => {
  const items = await categoryService.listCategories();
  res.json({ success: true, data: items });
});

const getCategory = asyncHandler(async (req, res) => {
  const item = await categoryService.getCategoryById(Number(req.params.id));
  res.json({ success: true, data: item });
});

const createCategory = asyncHandler(async (req, res) => {
  const item = await categoryService.createCategory(req.body);
  res.status(201).json({ success: true, data: item });
});

const updateCategory = asyncHandler(async (req, res) => {
  const item = await categoryService.updateCategory(Number(req.params.id), req.body);
  res.json({ success: true, data: item });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(Number(req.params.id));
  res.json({ success: true, message: 'Catégorie supprimée' });
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
