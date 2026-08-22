const { z } = require('zod');

const settingFields = z.object({
  nomBoutique: z.string().max(160).optional().nullable(),
  telephone: z.string().max(40).optional().nullable(),
  whatsapp: z.string().max(40).optional().nullable(),
  adresse: z.string().max(300).optional().nullable(),
  email: z.string().email().optional().nullable(),
  facebook: z.string().max(500).optional().nullable(),
  instagram: z.string().max(500).optional().nullable(),
  tiktok: z.string().max(500).optional().nullable(),
  logo: z.string().max(500).optional().nullable(),
  banniere: z.string().max(500).optional().nullable(),
  messageAccueil: z.string().max(5000).optional().nullable(),
  livraison: z.string().max(5000).optional().nullable(),
  politiqueRetour: z.string().max(5000).optional().nullable(),
  conditions: z.string().max(5000).optional().nullable()
});

const settingsUpdateSchema = settingFields.refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required'
});

module.exports = {
  settingsUpdateSchema
};
