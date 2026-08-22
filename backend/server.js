const app = require('./app');
const env = require('./config/env');
const prisma = require('./config/prisma');

const SHUTDOWN_TIMEOUT_MS = 10_000;
let server;

// Graceful shutdown handler
const shutdown = async (signal) => {
  console.log(`[shutdown] Received ${signal} — shutting down gracefully…`);
  const timer = setTimeout(() => {
    console.error('[shutdown] Graceful shutdown timed out, forcing exit.');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            reject(err);
            return;
          }

          resolve();
        });
      });
      console.log('[shutdown] HTTP server closed.');
    }

    await prisma.$disconnect();
    console.log('[shutdown] Database connection closed.');
    clearTimeout(timer);
    process.exit(0);
  } catch (err) {
    console.error('[shutdown] Error while disconnecting from database:', err);
    // Let the forced-exit timer fire
  }
};

const startServer = async () => {
  // 1. Verify required environment variables (env.js already throws on invalid
  //    config via Zod, so reaching here means the schema passed).
  console.log(`[startup] Environment: ${env.NODE_ENV}`);

  // 2. Verify database connectivity before accepting traffic
  try {
    await prisma.$connect();
  } catch (error) {
    console.error('[startup] Failed to connect to the database:', error);
    process.exit(1);
  }

  // 3. Start HTTP server
  server = app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`[startup] YASS backend running on port ${env.PORT}`);
  });

  server.on('error', (err) => {
    // Only exit for startup-level fatal errors (e.g., port already in use)
    const FATAL_CODES = ['EADDRINUSE', 'EACCES'];
    if (FATAL_CODES.includes(err.code)) {
      console.error('[startup] Fatal HTTP server error:', err);
      process.exit(1);
    } else {
      console.error('[runtime] HTTP server error:', err);
    }
  });

  // 4. Register graceful shutdown signals
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer();
