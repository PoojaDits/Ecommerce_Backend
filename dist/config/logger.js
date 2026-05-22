"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const winston_1 = __importDefault(require("winston"));
const logDir = path_1.default.join(process.cwd(), "logs");
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
const logColors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
};
winston_1.default.addColors(logColors);
const createLogText = (timestamp, level, message, meta) => {
    const metaText = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${timestamp} [${level}]: ${message}${metaText}`;
};
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => createLogText(String(timestamp), level, String(message), meta)));
const fileFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => createLogText(String(timestamp), level, String(message), meta)));
exports.logger = winston_1.default.createLogger({
    level: "info",
    transports: [
        new winston_1.default.transports.Console({ format: consoleFormat }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, "error.log"),
            level: "error",
            format: fileFormat,
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, "combined.log"),
            format: fileFormat,
        }),
    ],
});
exports.default = exports.logger;
//# sourceMappingURL=logger.js.map