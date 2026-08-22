const prisma = require('../config/prisma');

const getDashboardStats = async () => {
  const [totalProducts, totalCategories, activeProducts, outOfStockProducts, promoProducts, latestProducts] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.product.count({ where: { actif: true } }),
      prisma.product.count({ where: { stock: 0 } }),
      prisma.product.count({ where: { promotion: true } }),
      prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          nom: true,
          slug: true,
          prix: true,
          stock: true,
          createdAt: true
        }
      })
    ]);

  return {
    totalProducts,
    totalCategories,
    activeProducts,
    outOfStockProducts,
    promoProducts,
    latestProducts: latestProducts.map((product) => ({
      ...product,
      prix: Number(product.prix)
    }))
  };
};

module.exports = {
  getDashboardStats
};
