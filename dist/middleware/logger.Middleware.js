"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    res.on("finish", () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${responseTime}ms`;
        if (res.statusCode >= 500) {
            logger_1.default.error(message);
        }
        else if (res.statusCode >= 400) {
            logger_1.default.warn(message);
        }
        else {
            logger_1.default.info(message);
        }
    });
    next();
};
exports.requestLogger = requestLogger;
exports.default = exports.requestLogger;
//# sourceMappingURL=logger.Middleware.js.map