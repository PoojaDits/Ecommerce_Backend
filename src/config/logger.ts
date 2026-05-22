import fs from "fs";
import path from "path";
import winston from "winston";

const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

winston.addColors(logColors);

const createLogText = (
  timestamp: string,
  level: string,
  message: string,
  meta: Record<string, unknown>
): string => {
  const metaText = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `${timestamp} [${level}]: ${message}${metaText}`;
};

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) =>
    createLogText(String(timestamp), level, String(message), meta)
  )
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) =>
    createLogText(String(timestamp), level, String(message), meta)
  )
);

export const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      format: fileFormat,
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      format: fileFormat,
    }),
  ],
});

export default logger;