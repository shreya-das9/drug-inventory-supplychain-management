const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  // Default error
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error'
  };

  // PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique constraint violation
        error.statusCode = 400;
        error.message = 'Resource already exists';
        break;
      case '23503': // Foreign key constraint violation
        error.statusCode = 400;
        error.message = 'Referenced resource does not exist';
        break;
      case '23502': // Not null constraint violation
        error.statusCode = 400;
        error.message = 'Required field is missing';
        break;
      case '42P01': // Undefined table
        error.statusCode = 500;
        error.message = 'Database configuration error';
        break;
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.message = 'Token expired';
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;