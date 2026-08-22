const app = require('./app');
const env = require('./config/env');
const prisma = require('./config/prisma');

const startServer = async () => {
  try {
    await prisma.$connect();

    app.listen(env.PORT, '0.0.0.0', () => {
      console.log(`YASS backend running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
