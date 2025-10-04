const { createLogger, format, transports } = require("winston");
const path = require("path");
const fs = require("fs");

const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(info => `[${info.timestamp}] [${info.level.toUpperCase()}] ${info.message}`)
  ),
  transports: [
    new transports.Console(), 
    new transports.File({ filename: path.join(logDir, "combined.log") }),
    new transports.File({ filename: path.join(logDir, "error.log"), level: "error" })
  ],
});

logger.stream = {
  write: message => logger.info(message.trim())
};

module.exports = logger;
