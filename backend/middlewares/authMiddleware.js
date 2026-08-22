const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/apiError');

const authenticateToken = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Unauthorized'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (_error) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};

module.exports = {
  authenticateToken
};
