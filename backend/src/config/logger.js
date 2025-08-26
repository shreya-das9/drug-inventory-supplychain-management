// const winston = require('winston');

// const logger = winston.createLogger({
//   level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.errors({ stack: true }),
//     winston.format.json()
//   ),
//   defaultMeta: { service: 'drug-inventory-backend' },
//   transports: [
//     new winston.transports.Console({
//       format: winston.format.combine(
//         winston.format.colorize(),
//         winston.format.simple()
//       )
//     })
//   ],
// });

// module.exports = logger;

const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { 
        service: 'drug-inventory-backend',
        environment: process.env.NODE_ENV || 'development'
    },
    transports: [
        // Write all logs with importance level of `error` or less to `error.log`
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error',
            handleExceptions: true,
            handleRejections: true
        }),
        
        // Write all logs with importance level of `info` or less to `combined.log`
        new winston.transports.File({ 
            filename: 'logs/combined.log',
            handleExceptions: true,
            handleRejections: true
        }),
    ],
});

// If we're not in production, also log to the console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
        handleExceptions: true,
        handleRejections: true
    }));
}

// Create a stream object with a 'write' function for morgan HTTP logging
logger.stream = {
    write: (message) => {
        logger.info(message.trim());
    }
};

module.exports = logger;