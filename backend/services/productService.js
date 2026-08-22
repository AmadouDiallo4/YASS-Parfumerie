const prisma = require('../config/prisma');
const ApiError = require('../utils/apiError');
const { generateUniqueSlug } = require('./slugService');

const productInclude = {
  category: true,
  images: {
    orderBy: { sortOrder: 'asc' }
  }
};

const removeUndefined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));

const pickProductData = (payload) => ({
  nom: payload.nom,
  description: payload.description,
  prix: payload.prix,
  ancienPrix: payload.ancienPrix,
  categorieId: payload.categorieId,
  marque: payload.marque,
  volume: payload.volume,
  genre: payload.genre,
  imagePrincipale: payload.imagePrincipale,
  stock: payload.stock,
  featured: payload.featured,
  promotion: payload.promotion,
  actif: payload.actif
});

const mapProduct = (product) => ({
  ...product,
  prix: Number(product.prix),
  ancienPrix: product.ancienPrix ? Number(product.ancienPrix) : null,
  images: product.images.map((image) => image.url)
});

const buildOrderBy = (tri) => {
  switch (tri) {
    case 'oldest':
      return { createdAt: 'asc' };
    case 'price_asc':
      return { prix: 'asc' };
    case 'price_desc':
      return { prix: 'desc' };
    case 'name_asc':
      return { nom: 'asc' };
    case 'name_desc':
      return { nom: 'desc' };
    case 'newest':
    default:
      return { createdAt: 'desc' };
  }
};

const buildWhere = (query) => {
  const where = {};

  if (query.categorie) {
    where.categorieId = query.categorie;
  }

  if (query.prixMin !== undefined || query.prixMax !== undefined) {
    where.prix = {
      ...(query.prixMin !== undefined ? { gte: query.prixMin } : {}),
      ...(query.prixMax !== undefined ? { lte: query.prixMax } : {})
    };
  }

  if (query.featured) {
    where.featured = query.featured === 'true';
  }

  if (query.promotion) {
    where.promotion = query.promotion === 'true';
  }

  if (query.actif) {
    where.actif = query.actif === 'true';
  }

  if (query.recherche) {
    where.OR = [
      { nom: { contains: query.recherche } },
      { description: { contains: query.recherche } },
      { marque: { contains: query.recherche } }
    ];
  }

  return where;
};

const listProducts = async (query) => {
  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;
  const where = buildWhere(query);

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: buildOrderBy(query.tri),
      include: productInclude
    }),
    prisma.product.count({ where })
  ]);

  return {
    items: items.map(mapProduct),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude
  });

  if (!product) {
    throw new ApiError(404, 'Produit introuvable');
  }

  return mapProduct(product);
};

const ensureCategoryExists = async (categorieId) => {
  const category = await prisma.category.findUnique({ where: { id: categorieId } });
  if (!category) {
    throw new ApiError(400, 'La catégorie spécifiée est invalide');
  }
};

const createProduct = async (payload) => {
  await ensureCategoryExists(payload.categorieId);

  const slug = payload.slug
    ? await generateUniqueSlug('product', payload.slug, prisma)
    : await generateUniqueSlug('product', payload.nom, prisma);

  const images = payload.images || [];
  const baseData = removeUndefined(pickProductData(payload));

  const product = await prisma.product.create({
    data: {
      ...baseData,
      slug,
      images: {
        create: images.map((image, index) => ({
          url: image.url,
          sortOrder: image.sortOrder ?? index
        }))
      }
    },
    include: productInclude
  });

  return mapProduct(product);
};

const updateProduct = async (id, payload) => {
  await getProductById(id);

  if (payload.categorieId) {
    await ensureCategoryExists(payload.categorieId);
  }

  const nextData = removeUndefined(pickProductData(payload));

  if (payload.slug) {
    nextData.slug = await generateUniqueSlug('product', payload.slug, prisma, id);
  }

  if (Array.isArray(payload.images)) {
    nextData.images = {
      deleteMany: {},
      create: payload.images.map((image, index) => ({
        url: image.url,
        sortOrder: image.sortOrder ?? index
      }))
    };
  }

  const product = await prisma.product.update({
    where: { id },
    data: nextData,
    include: productInclude
  });

  return mapProduct(product);
};

const deleteProduct = async (id) => {
  await getProductById(id);
  await prisma.product.delete({ where: { id } });
};

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
