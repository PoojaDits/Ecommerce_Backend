"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const dataSource_1 = require("./config/dataSource");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const swagger_1 = require("./config/swagger");
const logger_1 = __importDefault(require("./config/logger"));
const logger_Middleware_1 = __importDefault(require("./middleware/logger.Middleware"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(logger_Middleware_1.default);
(0, swagger_1.setupSwagger)(app);
app.use("/api/auth", authRoutes_1.default);
app.get("/back", (_req, res) => {
    logger_1.default.info("Health check endpoint called");
    res.json({
        success: true,
        message: "Server is running",
    });
});
const startServer = async () => {
    try {
        await dataSource_1.AppDataSource.initialize();
        logger_1.default.info("Database Connected");
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            logger_1.default.info(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error(`Server startup failed: ${error.message}`);
        }
        else {
            logger_1.default.error("Server startup failed");
        }
        throw error;
    }
};
startServer();
//# sourceMappingURL=app.js.map