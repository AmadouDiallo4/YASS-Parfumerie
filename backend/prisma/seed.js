const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// Load env vars before importing config/prisma so DATABASE_URL is available
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Use the shared Prisma instance (sets PRISMA_QUERY_ENGINE_BINARY in production)
const prisma = require('../config/prisma');

const CATEGORY_DEFINITIONS = {
  'parfums-hommes': { nom: 'Parfums Hommes', slug: 'parfums-hommes', description: 'Sélection masculine', actif: true },
  'parfums-femmes': { nom: 'Parfums Femmes', slug: 'parfums-femmes', description: 'Sélection féminine', actif: true },
  brumes: { nom: 'Brumes', slug: 'brumes', description: 'Brumes parfumées', actif: true },
  musc: { nom: 'Musc', slug: 'musc', description: 'Musc et tahara', actif: true },
  'huiles-parfumees': { nom: 'Huiles parfumées', slug: 'huiles-parfumees', description: 'Huiles parfumées', actif: true },
  cosmetiques: { nom: 'Cosmétiques', slug: 'cosmetiques', description: 'Soins et bien-être', actif: true },
  'sante-bien-etre': { nom: 'Santé & bien-être', slug: 'sante-bien-etre', description: 'Produits santé & bien-être', actif: true },
  divers: { nom: 'Divers', slug: 'divers', description: 'Autres produits', actif: true }
};

const NAME_SLUG_OVERRIDES = {
  "HUILES_D'ARGAN_BIO": 'huile-argan-bio'
};

const CATALOG_PATH = path.join(__dirname, 'catalog-products.json');
const IMAGELESS_PRODUCT_NAMES = new Set([
  'HUILES_PARFUMEES_FEMME',
  'HUILES_PARFUMEES_HOMME',
  'Électronique'
]);

const slugify = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const extractPublicCatalog = () => {
  const content = fs.readFileSync(CATALOG_PATH, 'utf8');
  return JSON.parse(content);
};

const resolveCategorySlug = (product) => {
  if (product.category === 'parfum') {
    switch (product.subCategory) {
      case 'hommes':
        return 'parfums-hommes';
      case 'femmes':
        return 'parfums-femmes';
      case 'brumes':
        return 'brumes';
      case 'musc':
        return 'musc';
      case 'huiles_parfumees':
        return 'huiles-parfumees';
      default:
        throw new Error(`Sous-catégorie parfum inconnue: ${product.subCategory || 'N/A'} (${product.name})`);
    }
  }

  if (product.category === 'cosmetique') return 'cosmetiques';
  if (product.category === 'sante-bien-etre') return 'sante-bien-etre';
  if (product.category === 'divers') return 'divers';

  throw new Error(`Catégorie inconnue: ${product.category} (${product.name})`);
};

const mapGenre = (gender) => {
  if (gender === 'femme') return 'Femme';
  if (gender === 'homme') return 'Homme';
  return 'Mixte';
};

const mapCatalogProductToSeed = (product) => {
  const imagePrincipale = product.image ? `/${product.image}` : null;
  const normalizedName = product.name;

  return {
    nom: normalizedName,
    slug: NAME_SLUG_OVERRIDES[normalizedName] || slugify(normalizedName.replace(/_/g, ' ')),
    description: product.desc,
    prix: product.price,
    ancienPrix: null,
    categorieSlug: resolveCategorySlug(product),
    marque: 'YASS',
    volume: null,
    genre: mapGenre(product.gender),
    imagePrincipale,
    images: imagePrincipale ? [imagePrincipale] : [],
    stock: 0,
    featured: false,
    promotion: false,
    actif: true
  };
};

const validateSeedDataset = (products, categories) => {
  if (products.length !== 65) {
    throw new Error(`Le seed doit contenir exactement 65 produits. Reçu: ${products.length}`);
  }

  if (categories.length !== 8) {
    throw new Error(`Le seed doit contenir exactement 8 catégories. Reçu: ${categories.length}`);
  }

  const slugCounts = new Map();
  products.forEach((p) => slugCounts.set(p.slug, (slugCounts.get(p.slug) || 0) + 1));
  const duplicateSlugs = [...slugCounts.entries()].filter(([, count]) => count > 1);
  if (duplicateSlugs.length > 0) {
    throw new Error(`Slugs dupliqués détectés: ${duplicateSlugs.map(([slug]) => slug).join(', ')}`);
  }

  const nameCounts = new Map();
  products.forEach((p) => nameCounts.set(p.nom, (nameCounts.get(p.nom) || 0) + 1));
  const duplicateNames = [...nameCounts.entries()].filter(([, count]) => count > 1);
  if (duplicateNames.length > 0) {
    throw new Error(`Noms dupliqués détectés: ${duplicateNames.map(([nom]) => nom).join(', ')}`);
  }

  const expectedDistinctPairs = [
    ['DEO_CIEN', 'DEODORANT_CIEN'],
    ['DEO_NARTA', 'NARTA'],
    ['DEO_NARTA_PURE_EFFICACE', 'NARTA_PURE_EFFICACE']
  ];

  for (const [a, b] of expectedDistinctPairs) {
    const hasA = products.some((p) => p.nom === a);
    const hasB = products.some((p) => p.nom === b);
    if (!hasA || !hasB) {
      throw new Error(`Produits distincts obligatoires introuvables: ${a} et/ou ${b}`);
    }
  }

  const invalidImagePaths = products
    .filter((p) => p.imagePrincipale)
    .filter((p) => !p.imagePrincipale.startsWith('/images/'));
  if (invalidImagePaths.length > 0) {
    throw new Error(`Chemins d'image invalides: ${invalidImagePaths.map((p) => `${p.nom}:${p.imagePrincipale}`).join(', ')}`);
  }

  const imageLessProducts = products.filter((p) => !p.imagePrincipale);
  if (imageLessProducts.length !== IMAGELESS_PRODUCT_NAMES.size) {
    throw new Error(
      `Le catalogue doit contenir exactement ${IMAGELESS_PRODUCT_NAMES.size} produits sans image. Reçu: ${imageLessProducts.length}`
    );
  }
  const imageLessProductNames = new Set(imageLessProducts.map((p) => p.nom));
  for (const expectedName of IMAGELESS_PRODUCT_NAMES) {
    if (!imageLessProductNames.has(expectedName)) {
      throw new Error(`Produit sans image attendu introuvable: ${expectedName}`);
    }
  }

  const usedCategorySlugs = new Set(products.map((p) => p.categorieSlug));
  if (usedCategorySlugs.size !== 8) {
    throw new Error(`Le catalogue doit utiliser exactement 8 catégories. Reçu: ${usedCategorySlugs.size}`);
  }

  const expectedPrices = {
    'african-legend': 30000,
    'musc-blanc': 20000,
    bellaya: 30000,
    'huile-argan-bio': 2000
  };

  for (const [slug, expectedPrice] of Object.entries(expectedPrices)) {
    const product = products.find((p) => p.slug === slug);
    if (!product) {
      throw new Error(`Produit attendu non trouvé pour vérification prix: ${slug}`);
    }
    if (product.prix !== expectedPrice) {
      throw new Error(`Prix invalide pour ${slug}. Attendu: ${expectedPrice}, reçu: ${product.prix}`);
    }
  }
};

const categories = Object.values(CATEGORY_DEFINITIONS);

async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@yassparfums.com';
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'Administrateur YASS';

  if (!adminPassword || adminPassword.length < 8) {
    throw new Error('ADMIN_PASSWORD must be defined with at least 8 characters before seeding.');
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const products = extractPublicCatalog().map(mapCatalogProductToSeed);
  validateSeedDataset(products, categories);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash
    },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash
    }
  });

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }

  const dbCategories = await prisma.category.findMany({
    where: { slug: { in: categories.map((category) => category.slug) } },
    select: { id: true, slug: true }
  });

  const categoryIdBySlug = new Map(dbCategories.map((category) => [category.slug, category.id]));

  for (const product of products) {
    const categorieId = categoryIdBySlug.get(product.categorieSlug);
    if (!categorieId) {
      throw new Error(`Catégorie introuvable pour le produit ${product.nom}: ${product.categorieSlug}`);
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        prix: product.prix
      },
      create: {
        nom: product.nom,
        slug: product.slug,
        description: product.description,
        prix: product.prix,
        ancienPrix: product.ancienPrix,
        categorieId: categorieId,
        marque: product.marque,
        volume: product.volume,
        genre: product.genre,
        imagePrincipale: product.imagePrincipale,
        stock: product.stock,
        featured: product.featured,
        promotion: product.promotion,
        actif: product.actif,
        images: {
          create: product.images.map((url, index) => ({ url, sortOrder: index }))
        }
      }
    });
  }

  await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nomBoutique: 'YASS Parfumerie',
      telephone: '+221 77 000 00 00',
      whatsapp: '+221 77 000 00 00',
      adresse: 'Dakar, Sénégal',
      email: 'contact@yassparfums.com',
      facebook: 'https://facebook.com/yassparfums',
      instagram: 'https://instagram.com/yassparfums',
      tiktok: 'https://tiktok.com/@yassparfums',
      messageAccueil: 'Bienvenue chez YASS Parfumerie',
      livraison: 'Livraison rapide à Dakar et régions.',
      politiqueRetour: 'Retours acceptés sous 7 jours selon conditions.',
      conditions: 'Consultez nos conditions générales de vente.'
    }
  });

  console.log('Seed completed successfully');
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
