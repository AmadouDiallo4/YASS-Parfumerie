const jwt = require('jsonwebtoken');
const env = require('../config/env');

const signAdminToken = (admin) =>
  jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });

module.exports = {
  signAdminToken
};
