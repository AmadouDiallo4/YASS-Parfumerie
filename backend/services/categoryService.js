const prisma = require('../config/prisma');
const ApiError = require('../utils/apiError');
const { generateUniqueSlug } = require('./slugService');

const listCategories = async () => prisma.category.findMany({ orderBy: { nom: 'asc' } });
const removeUndefined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));

const pickCategoryData = (payload) => ({
  nom: payload.nom,
  description: payload.description,
  actif: payload.actif
});

const getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new ApiError(404, 'Catégorie introuvable');
  }

  return category;
};

const createCategory = async (payload) => {
  const baseData = removeUndefined(pickCategoryData(payload));
  const slug = payload.slug
    ? await generateUniqueSlug('category', payload.slug, prisma)
    : await generateUniqueSlug('category', payload.nom, prisma);

  return prisma.category.create({
    data: {
      ...baseData,
      slug
    }
  });
};

const updateCategory = async (id, payload) => {
  await getCategoryById(id);

  const nextData = removeUndefined(pickCategoryData(payload));
  if (payload.slug) {
    nextData.slug = await generateUniqueSlug('category', payload.slug, prisma, id);
  }

  return prisma.category.update({
    where: { id },
    data: nextData
  });
};

const deleteCategory = async (id) => {
  await getCategoryById(id);

  const linkedProducts = await prisma.product.count({ where: { categorieId: id } });
  if (linkedProducts > 0) {
    throw new ApiError(400, 'Impossible de supprimer une catégorie contenant des produits');
  }

  await prisma.category.delete({ where: { id } });
};

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
