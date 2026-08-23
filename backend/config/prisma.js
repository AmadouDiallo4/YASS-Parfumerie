const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

if (process.env.NODE_ENV === 'production') {
  const enginePath = path.resolve(
    __dirname,
    '..',
    'node_modules',
    '.prisma',
    'client',
    'query-engine-debian-openssl-3.0.x'
  );

  try {
    fs.chmodSync(enginePath, 0o755);
  } catch (err) {
    console.error(
      `[Prisma] Impossible d'appliquer chmod 755 sur le moteur de requêtes : ${enginePath}`,
      err.message
    );
  }

  process.env.PRISMA_QUERY_ENGINE_BINARY = enginePath;
}

const prisma = new PrismaClient();

module.exports = prisma;
