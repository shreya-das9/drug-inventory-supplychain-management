const app = require('./app');
const config = require('./config/env');
const pool = require('./config/db');
import cors from 'cors';
const PORT = config.PORT;
app.use(cors({
  origin: process.env.FRONTEND_URL,  // ✅ will now be http://localhost:5173
  credentials: true
}));

// Test database connection on startup
async function startServer() {
  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Pharmaceutical Supply Chain API running on port ${PORT}`);
      console.log(`📍 Environment: ${config.NODE_ENV}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  pool.end(() => {
    console.log('Database connections closed');
    process.exit(0);
  });
});



