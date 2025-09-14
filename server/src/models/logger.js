const fs = require('fs');
const path = require('path');
const winston = require('winston');

// Ensure server/logs directory exists and point file transport there
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}
const logFile = path.join(logDir, 'app.log');

// Define log configuration
const logConfiguration = {
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
            )
        }),
        new winston.transports.File({
            level: 'info',
            filename: logFile,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
};

// Create the logger
const logger = winston.createLogger(logConfiguration);

module.exports = logger;
