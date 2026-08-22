const slugify = require('../utils/slugify');

const generateUniqueSlug = async (model, sourceValue, prisma, excludeId = null) => {
  const baseSlug = slugify(sourceValue);
  let slug = baseSlug;
  let index = 1;
  const MAX_ATTEMPTS = 100;

  while (index <= MAX_ATTEMPTS) {
    const existing = await prisma[model].findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {})
      },
      select: { id: true }
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${index}`;
    index += 1;
  }

  throw new Error(`Unable to generate unique slug for model ${model}`);
};

module.exports = {
  generateUniqueSlug
};
