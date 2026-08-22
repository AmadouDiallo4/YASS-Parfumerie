const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  { nom: 'Parfums Hommes', slug: 'parfums-hommes', description: 'Sélection masculine', actif: true },
  { nom: 'Parfums Femmes', slug: 'parfums-femmes', description: 'Sélection féminine', actif: true },
  { nom: 'Musc', slug: 'musc', description: 'Musc et tahara', actif: true },
  { nom: 'Cosmétiques', slug: 'cosmetiques', description: 'Soins et bien-être', actif: true }
];

const products = [
  {
    nom: 'African Legend',
    slug: 'african-legend',
    description: 'Parfum homme boisé avec notes fraîches.',
    prix: 15.9,
    ancienPrix: 18.9,
    categorieSlug: 'parfums-hommes',
    marque: 'YASS',
    volume: '50ml',
    genre: 'Homme',
    imagePrincipale: '/images/hommes/AFRICAN_LEGEND.jpeg',
    images: ['/images/hommes/AFRICAN_LEGEND.jpeg'],
    stock: 25,
    featured: true,
    promotion: true,
    actif: true
  },
  {
    nom: 'Musc Blanc',
    slug: 'musc-blanc',
    description: 'Parfum doux et propre pour usage quotidien.',
    prix: 12.5,
    ancienPrix: null,
    categorieSlug: 'musc',
    marque: 'YASS',
    volume: '12ml',
    genre: 'Unisexe',
    imagePrincipale: '/images/femmes/MUSC_BLANC.jpeg',
    images: ['/images/femmes/MUSC_BLANC.jpeg'],
    stock: 40,
    featured: true,
    promotion: false,
    actif: true
  },
  {
    nom: 'Bellaya',
    slug: 'bellaya',
    description: 'Fragrance florale féminine élégante.',
    prix: 16,
    ancienPrix: 19,
    categorieSlug: 'parfums-femmes',
    marque: 'YASS',
    volume: '50ml',
    genre: 'Femme',
    imagePrincipale: '/images/femmes/BELLAYA.jpeg',
    images: ['/images/femmes/BELLAYA.jpeg'],
    stock: 15,
    featured: false,
    promotion: true,
    actif: true
  },
  {
    nom: 'Huile d\'Argan Bio',
    slug: 'huile-argan-bio',
    description: 'Huile cosmétique nourrissante.',
    prix: 9.9,
    ancienPrix: null,
    categorieSlug: 'cosmetiques',
    marque: 'YASS',
    volume: '100ml',
    genre: 'Unisexe',
    imagePrincipale: '/images/cosmetiques/HUILE_DARGAN_BIO.jpeg',
    images: ['/images/cosmetiques/HUILE_DARGAN_BIO.jpeg'],
    stock: 32,
    featured: false,
    promotion: false,
    actif: true
  }
];

async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@yassparfums.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const adminName = process.env.ADMIN_NAME || 'Administrateur YASS';

  const passwordHash = await bcrypt.hash(adminPassword, 10);

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

  for (const product of products) {
    const category = await prisma.category.findUnique({ where: { slug: product.categorieSlug } });

    if (!category) {
      continue;
    }

    const existing = await prisma.product.findUnique({ where: { slug: product.slug } });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          nom: product.nom,
          description: product.description,
          prix: product.prix,
          ancienPrix: product.ancienPrix,
          categorieId: category.id,
          marque: product.marque,
          volume: product.volume,
          genre: product.genre,
          imagePrincipale: product.imagePrincipale,
          stock: product.stock,
          featured: product.featured,
          promotion: product.promotion,
          actif: product.actif,
          images: {
            deleteMany: {},
            create: product.images.map((url, index) => ({ url, sortOrder: index }))
          }
        }
      });
    } else {
      await prisma.product.create({
        data: {
          nom: product.nom,
          slug: product.slug,
          description: product.description,
          prix: product.prix,
          ancienPrix: product.ancienPrix,
          categorieId: category.id,
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
