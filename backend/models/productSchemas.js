const { z } = require('zod');

const imageSchema = z.object({
  url: z.string().min(1),
  sortOrder: z.number().int().min(0).optional()
});

const productCreateSchema = z.object({
  nom: z.string().min(2).max(200),
  slug: z.string().min(2).max(220).optional(),
  description: z.string().min(2),
  prix: z.coerce.number().positive(),
  ancienPrix: z.coerce.number().positive().optional().nullable(),
  categorieId: z.coerce.number().int().positive(),
  marque: z.string().max(120).optional().nullable(),
  volume: z.string().max(120).optional().nullable(),
  genre: z.string().max(80).optional().nullable(),
  imagePrincipale: z.string().max(500).optional().nullable(),
  images: z.array(imageSchema).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  promotion: z.boolean().optional(),
  actif: z.boolean().optional()
});

const productUpdateSchema = productCreateSchema.partial();

const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  categorie: z.coerce.number().int().positive().optional(),
  prixMin: z.coerce.number().min(0).optional(),
  prixMax: z.coerce.number().min(0).optional(),
  featured: z.enum(['true', 'false']).optional(),
  promotion: z.enum(['true', 'false']).optional(),
  recherche: z.string().max(150).optional(),
  tri: z
    .enum(['newest', 'oldest', 'price_asc', 'price_desc', 'name_asc', 'name_desc'])
    .default('newest'),
  actif: z.enum(['true', 'false']).optional()
});

module.exports = {
  productCreateSchema,
  productUpdateSchema,
  productQuerySchema
};
