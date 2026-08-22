const { z } = require('zod');

const categoryCreateSchema = z.object({
  nom: z.string().min(2).max(120),
  slug: z.string().min(2).max(140).optional(),
  description: z.string().max(2000).optional().nullable(),
  actif: z.boolean().optional()
});

const categoryUpdateSchema = categoryCreateSchema.partial();

module.exports = {
  categoryCreateSchema,
  categoryUpdateSchema
};
