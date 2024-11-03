// backend/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // You can set different levels (error, warn, info, debug)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(), // Logs to the console
    new winston.transports.File({ filename: 'error.log', level: 'error' }) // Logs errors to error.log
  ]
});

module.exports = logger;
