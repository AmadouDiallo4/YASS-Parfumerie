const prisma = require('../config/prisma');

const getOrCreateSettings = async () => {
  const existing = await prisma.setting.findUnique({ where: { id: 1 } });

  if (existing) {
    return existing;
  }

  return prisma.setting.create({ data: { id: 1 } });
};

const updateSettings = async (payload) => {
  await getOrCreateSettings();

  return prisma.setting.update({
    where: { id: 1 },
    data: payload
  });
};

module.exports = {
  getOrCreateSettings,
  updateSettings
};
