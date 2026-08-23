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
const frontendRoot = path.resolve(__dirname, '..');
const frontendIndexFile = path.join(frontendRoot, 'index.html');
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

app.use('/images', express.static(path.join(frontendRoot, 'images')));
app.get('/style.css', (_req, res) => res.sendFile(path.join(frontendRoot, 'style.css')));
app.get('/script.js', (_req, res) => res.sendFile(path.join(frontendRoot, 'script.js')));
app.get('/checkout.js', (_req, res) => res.sendFile(path.join(frontendRoot, 'checkout.js')));
app.get('/commande.html', (_req, res) => res.sendFile(path.join(frontendRoot, 'commande.html')));
app.get('/index.html', (_req, res) => res.sendFile(frontendIndexFile));
app.get('/', (_req, res) => res.sendFile(frontendIndexFile));

app.get('*', (req, res, next) => {
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

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
