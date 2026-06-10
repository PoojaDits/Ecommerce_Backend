import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/dataSource";
import { setupSwagger } from "./config/swagger";
import logger from "./config/logger";
import requestLogger from "./middleware/logger.Middleware";
import { apiLimiter, authLimiter } from "./middleware/rateLimiter";
import globalErrorHandler from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import storeRoutes from "./routes/storeRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import addressRoutes from "./routes/addressRoutes";
import orderRoutes from "./routes/orderRoutes";
dotenv.config();

const app = express();

// ── Global middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ── Rate limiting ──────────────────────────────────────────────────
app.use("/api/", apiLimiter);        // general limiter for all API routes
app.use("/api/auth/", authLimiter);  // stricter limiter for auth endpoints

// ── Static files ───────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "..", "public")));

// ── Swagger docs ───────────────────────────────────────────────────
setupSwagger(app);

app.get("/docs", (_req, res) => {
  res.redirect("/api-docs");
});

// ── Routes ─────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);

// ── Health check ───────────────────────────────────────────────────
app.get("/back", (_req: Request, res: Response) => {
  logger.info("Health check endpoint called");
  res.json({
    success: true,
    message: "Server is running",
  });
});

// ── 404 handler ────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ── Global error handler (must be last) ──────────────────────────
app.use(globalErrorHandler);

// ── Server startup ─────────────────────────────────────────────────
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
