import pino from "pino";

// Configure the logger with default settings
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
});

// Create child loggers for different modules
export const createLogger = (module: string) => logger.child({ module });

// Default logger instance
export default logger;
