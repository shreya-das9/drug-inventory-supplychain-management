// // // require('dotenv').config();
// // // const express = require('express');
// // // const cors = require('cors');
// // // const helmet = require('helmet');
// // // const cookieParser = require('cookie-parser');

// // // const { testConnection } = require('./config/db');
// // // const logger = require('./config/logger');
// // // const errorHandler = require('./middleware/errorHandler');
// // // const { generalLimiter } = require('./middleware/rateLimiter');
// // // const routes = require('./routes');

// // // const app = express();
// // // const PORT = process.env.PORT || 5000;

// // // // Security middleware
// // // app.use(helmet());

// // // // CORS configuration
// // // app.use(cors({
// // //   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
// // //   credentials: true,
// // //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// // //   allowedHeaders: ['Content-Type', 'Authorization']
// // // }));

// // // // Body parsing middleware
// // // app.use(express.json({ limit: '10mb' }));
// // // app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// // // app.use(cookieParser());

// // // // Rate limiting
// // // app.use(generalLimiter);

// // // // Request logging
// // // app.use((req, res, next) => {
// // //   logger.info(`${req.method} ${req.path} - ${req.ip}`);
// // //   next();
// // // });

// // // // Routes
// // // //app.use('/api', routes);
// // // // Comment out this line temporarily
// // // // app.use('/api', routes);

// // // // Add a simple test route instead
// // // app.get('/api/test', (req, res) => {
// // //   res.json({ message: 'Server is working' });
// // // });
// // // // 404 handler
// // // app.use('*', (req, res) => {
// // //   res.status(404).json({
// // //     success: false,
// // //     message: 'Route not found'
// // //   });
// // // });

// // // // Error handling middleware (must be last)
// // // app.use(errorHandler);

// // // // Start server
// // // const startServer = async () => {
// // //   try {
// // //     // Test database connection
// // //     const dbConnected = await testConnection();
// // //     if (!dbConnected) {
// // //       logger.error('Failed to connect to database');
// // //       process.exit(1);
// // //     }

// // //     app.listen(PORT, () => {
// // //       logger.info(`Server running on port ${PORT}`);
// // //       logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
// // //       logger.info(`CORS origin: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
// // //     });
// // //   } catch (error) {
// // //     logger.error('Failed to start server:', error);
// // //     process.exit(1);
// // //   }
// // // };

// // // // Handle unhandled promise rejections
// // // process.on('unhandledRejection', (err, promise) => {
// // //   logger.error('Unhandled Rejection at:', promise, 'reason:', err);
// // //   process.exit(1);
// // // });

// // // // Handle uncaught exceptions
// // // process.on('uncaughtException', (err) => {
// // //   logger.error('Uncaught Exception:', err);
// // //   process.exit(1);
// // // });

// // // startServer();

// // // module.exports = app;








// // const express = require('express');
// // const cors = require('cors');
// // const helmet = require('helmet');
// // const rateLimit = require('express-rate-limit');
// // const cookieParser = require('cookie-parser');
// // const authRoutes = require('./routes/auth');
// // const userRoutes = require('./routes/users');
// // const errorHandler = require('./middleware/errorHandler');

// // const app = express();

// // // Security middleware
// // app.use(helmet());
// // app.use(cors({
// //   origin: 'http://localhost:3000',
// //   credentials: true,
// //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// //   allowedHeaders: ['Content-Type', 'Authorization']
// // }));

// // // Rate limiting
// // const limiter = rateLimit({
// //   windowMs: 15 * 60 * 1000, // 15 minutes
// //   max: 100 // limit each IP to 100 requests per windowMs
// // });
// // app.use(limiter);

// // // Body parsing middleware
// // app.use(express.json({ limit: '10mb' }));
// // app.use(express.urlencoded({ extended: true }));
// // app.use(cookieParser());

// // // Routes
// // app.use('/api/auth', authRoutes);
// // app.use('/api/users', userRoutes);

// // // Health check
// // app.get('/api/health', (req, res) => {
// //   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// // });

// // // Error handling
// // app.use(errorHandler);

// // // 404 handler
// // app.use('*', (req, res) => {
// //   res.status(404).json({ error: 'Route not found' });
// // });

// // module.exports = app;





// // src/app.js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const cookieParser = require('cookie-parser');

// const { testConnection } = require('./config/db');
// const errorHandler = require('./middleware/errorHandler');

// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(helmet());
// // app.use(cors({
// //   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
// //   credentials: true,
// //   methods: ['GET','POST','PUT','DELETE','OPTIONS'],
// //   allowedHeaders: ['Content-Type','Authorization'],
// // }));
// app.use(cors({
//   origin: [
//     'http://localhost:5173',   // Vite frontend
//     'http://localhost:3000'    // React CRA (if you use it sometimes)
//   ],
//   credentials: true,
//   methods: ['GET','POST','PUT','DELETE','OPTIONS'],
//   allowedHeaders: ['Content-Type','Authorization'],
// }));

// app.use(rateLimit({
//   windowMs: 1 * 60 * 1000,  // 1 minute
//   max: 1000,                // allow 1000 requests per minute
// }));

// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);

// // Health
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// // 404 (keep after routes)
// app.use('*', (req, res) => res.status(404).json({ error: 'Route not found' }));

// // Error handler (last)
// app.use(errorHandler);

// // Boot
// (async () => {
//   const ok = await testConnection();
//   if (!ok) {
//     console.error('Failed to connect to database');
//     process.exit(1);
//   }
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// })();



// const dashboardRoutes = require('./routes/dashboard.routes');

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/dashboard', dashboardRoutes);   // ✅ add this line

// module.exports = app;
// src/app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');




const { testConnection } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ BODY PARSERS MUST COME FIRST
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',   // Vite frontend
    'http://localhost:3000'    // React CRA
  ],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // only 20 login attempts
  message: "Too many login attempts, try again later."
});

// ✅ ROUTES COME AFTER MIDDLEWARE
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => res.status(404).json({ error: 'Route not found' }));

// Error handler
app.use(errorHandler);

// Boot
(async () => {
  const ok = await testConnection();
  if (!ok) {
    console.error('❌ Failed to connect to database');
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();

module.exports = app;