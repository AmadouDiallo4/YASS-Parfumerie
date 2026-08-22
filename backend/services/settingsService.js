const prisma = require('../config/prisma');
const removeUndefined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));

const pickSettingsData = (payload) => ({
  nomBoutique: payload.nomBoutique,
  telephone: payload.telephone,
  whatsapp: payload.whatsapp,
  adresse: payload.adresse,
  email: payload.email,
  facebook: payload.facebook,
  instagram: payload.instagram,
  tiktok: payload.tiktok,
  logo: payload.logo,
  banniere: payload.banniere,
  messageAccueil: payload.messageAccueil,
  livraison: payload.livraison,
  politiqueRetour: payload.politiqueRetour,
  conditions: payload.conditions
});

const getOrCreateSettings = async () => {
  const existing = await prisma.setting.findUnique({ where: { id: 1 } });

  if (existing) {
    return existing;
  }

  return prisma.setting.create({ data: { id: 1 } });
};

const updateSettings = async (payload) => {
  await getOrCreateSettings();
  const data = removeUndefined(pickSettingsData(payload));

  return prisma.setting.update({
    where: { id: 1 },
    data
  });
};

module.exports = {
  getOrCreateSettings,
  updateSettings
};
