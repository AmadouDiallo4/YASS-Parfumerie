const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const swaggerSpec = require('./config/swagger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();
const frontendRoots = [
  path.resolve(__dirname, 'public'),
  path.resolve(__dirname, '..'),
  path.resolve(__dirname)
];
const frontendRoot = frontendRoots.find((rootDir) => fs.existsSync(path.join(rootDir, 'index.html')));
const frontendIndexFile = frontendRoot ? path.join(frontendRoot, 'index.html') : null;
const allowedOrigins = env.CORS_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS origin not allowed'));
    }
  })
);
app.use(morgan('combined'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

if (frontendRoot && frontendIndexFile) {
  app.use('/images', express.static(path.join(frontendRoot, 'images')));
  app.get('/style.css', (_req, res) => res.sendFile(path.join(frontendRoot, 'style.css')));
  app.get('/script.js', (_req, res) => res.sendFile(path.join(frontendRoot, 'script.js')));
  app.get('/checkout.js', (_req, res) => res.sendFile(path.join(frontendRoot, 'checkout.js')));
  app.get('/commande.html', (_req, res) => res.sendFile(path.join(frontendRoot, 'commande.html')));
  app.get('/index.html', (_req, res) => res.sendFile(frontendIndexFile));
  app.get('/', (_req, res) => res.sendFile(frontendIndexFile));
  app.get('/admin.html', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
  app.get('/admin.css',  (_req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.css')));
  app.get('/admin.js',   (_req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.js')));
  app.get('/admin',      (_req, res) => res.redirect('/admin.html'));

  app.get('/{*frontendPath}', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
      next();
      return;
    }

    if (path.extname(req.path)) {
      next();
      return;
    }

    const acceptHeader = req.headers.accept || '';
    if (!acceptHeader.includes('text/html')) {
      next();
      return;
    }

    res.sendFile(frontendIndexFile);
  });
} else {
  console.warn('[startup] Frontend static files not found; only API routes are available.');
}

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
