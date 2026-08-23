const path = require('path');
const { PrismaClient } = require('@prisma/client');

if (process.env.NODE_ENV === 'production') {
  process.env.PRISMA_QUERY_ENGINE_BINARY = path.resolve(
    __dirname,
    '..',
    'node_modules',
    '.prisma',
    'client',
    'query-engine-debian-openssl-3.0.x'
  );
}

const prisma = new PrismaClient();

module.exports = prisma;
