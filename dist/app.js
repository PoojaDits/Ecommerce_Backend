"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const dataSource_1 = require("./config/dataSource");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/back", (_req, res) => {
    res.json({
        success: true,
        message: " Server is running",
    });
});
const startServer = async () => {
    try {
        await dataSource_1.AppDataSource.initialize();
        console.log(" Database Connected");
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(` Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error(" Server startup failed:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=app.js.map