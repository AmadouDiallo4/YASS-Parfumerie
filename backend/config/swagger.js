const swaggerJsdoc = require('swagger-jsdoc');

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'YASS Parfumerie API',
      version: '1.0.0',
      description: 'API REST pour gérer catalogue, catégories, paramètres et administration.'
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    paths: {
      '/api/auth/login': { post: { summary: 'Connexion admin' } },
      '/api/auth/logout': { post: { summary: 'Déconnexion admin', security: [{ bearerAuth: [] }] } },
      '/api/auth/me': { get: { summary: 'Profil admin connecté', security: [{ bearerAuth: [] }] } },
      '/api/products': {
        get: { summary: 'Liste des produits avec filtres' },
        post: { summary: 'Créer un produit', security: [{ bearerAuth: [] }] }
      },
      '/api/products/{id}': {
        get: { summary: 'Détail produit' },
        put: { summary: 'Mettre à jour un produit', security: [{ bearerAuth: [] }] },
        delete: { summary: 'Supprimer un produit', security: [{ bearerAuth: [] }] }
      },
      '/api/categories': {
        get: { summary: 'Liste catégories' },
        post: { summary: 'Créer une catégorie', security: [{ bearerAuth: [] }] }
      },
      '/api/categories/{id}': {
        get: { summary: 'Détail catégorie' },
        put: { summary: 'Mettre à jour une catégorie', security: [{ bearerAuth: [] }] },
        delete: { summary: 'Supprimer une catégorie', security: [{ bearerAuth: [] }] }
      },
      '/api/settings': {
        get: { summary: 'Lire les paramètres du site' },
        put: { summary: 'Mettre à jour les paramètres', security: [{ bearerAuth: [] }] }
      },
      '/api/upload': {
        post: { summary: 'Uploader une image', security: [{ bearerAuth: [] }] }
      },
      '/api/dashboard': {
        get: { summary: 'Statistiques dashboard', security: [{ bearerAuth: [] }] }
      }
    }
  },
  apis: []
});

module.exports = swaggerSpec;
