import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/dataSource";
import { setupSwagger } from "./config/swagger";
import logger from "./config/logger";
import requestLogger from "./middleware/logger.Middleware";
import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

setupSwagger(app);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/back", (_req: Request, res: Response) => {
  logger.info("Health check endpoint called");

  res.json({
    success: true,
    message: "Server is running",
  });
});

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    logger.info("Database Connected");

    const PORT = process.env.PORT || 3001;

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Server startup failed: ${error.message}`);
    } else {
      logger.error("Server startup failed");
    }

    throw error;
  }
};

startServer();