const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const currentEngineBinary = process.env.PRISMA_QUERY_ENGINE_BINARY;
const currentEngineName = currentEngineBinary ? path.basename(currentEngineBinary) : 'ABSENT';

console.log('[Prisma startup]');
console.log(`PID = ${process.pid}`);
console.log(`NODE_ENV = ${process.env.NODE_ENV || 'ABSENT'}`);
console.log(`PRISMA_QUERY_ENGINE_BINARY = ${currentEngineBinary ? 'PRESENT' : 'ABSENT'}`);
console.log(`PRISMA_QUERY_ENGINE_BINARY_BASENAME = ${currentEngineName}`);

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

const finalEngineBinary = process.env.PRISMA_QUERY_ENGINE_BINARY;
const finalEngineName = finalEngineBinary ? path.basename(finalEngineBinary) : 'ABSENT';

console.log(
  `[Prisma startup] Before new PrismaClient pid=${process.pid} NODE_ENV=${process.env.NODE_ENV || 'ABSENT'} PRISMA_QUERY_ENGINE_BINARY=${finalEngineBinary ? 'PRESENT' : 'ABSENT'} engine=${finalEngineName}`
);

const prisma = new PrismaClient();

module.exports = prisma;
