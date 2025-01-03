const fastify = require('fastify')();
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const logDirectory = path.join(__dirname, '../errrologs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true }); 
}
const logger = winston.createLogger({
    level: 'error', 
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) =>
            `[${timestamp}] ${level.toUpperCase()}: ${message}`
        )
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(logDirectory, 'error.log'), 
            maxsize: 5242880,
            maxFiles: 5,
        }),
        new winston.transports.Console() 
    ]
});
fastify.decorate('logger', logger);
process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
});

process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
});
fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
        logger.error(`Server start error: ${err.message}`);
        process.exit(1);
    }
    fastify.logger.info(`Server running at ${address}`);
});
