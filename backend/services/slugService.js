const slugify = require('../utils/slugify');
const ApiError = require('../utils/apiError');

const ALLOWED_MODELS = new Set(['product', 'category']);

const generateUniqueSlug = async (model, sourceValue, prisma, excludeId = null) => {
  if (!ALLOWED_MODELS.has(model)) {
    throw new ApiError(400, 'Invalid model for slug generation');
  }

  const baseSlug = slugify(sourceValue);
  let index = 0;
  const MAX_ATTEMPTS = 100;

  while (index < MAX_ATTEMPTS) {
    const slug = index === 0 ? baseSlug : `${baseSlug}-${index}`;
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

    index += 1;
  }

  throw new Error(`Unable to generate unique slug for model ${model}`);
};

module.exports = {
  generateUniqueSlug
};
