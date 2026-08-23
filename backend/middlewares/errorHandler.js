const { ZodError } = require('zod');
const multer = require('multer');
const ApiError = require('../utils/apiError');

const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.flatten()
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.details
    });
  }

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message:
        error.code === 'LIMIT_FILE_SIZE'
          ? 'Fichier trop volumineux (max 5 Mo)'
          : 'Erreur de téléversement'
    });
  }

  const safeStack = (error?.stack || '')
    .split('\n')
    .filter((line) => !/DATABASE_URL|password|secret|token/i.test(line))
    .join('\n');

  console.error('[500]', {
    name: error?.constructor?.name,
    message: error?.message,
    code: error?.code,
    meta: error?.meta,
    stack: safeStack
  });

  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
