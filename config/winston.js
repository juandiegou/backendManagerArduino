const winston = require('winston');

const options = {
  file: {
    level: 'info',
    filename: './logs/app.log',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(info => JSON.stringify(info)),
    ),
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'info',
    handleExceptions: true,
    json: true,
    timestamp: true,
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

module.exports = logger;
