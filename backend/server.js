// src/server.js

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import db from "../backend/src/models/index.js"
import authRoutes from "../backend/src/modules/User/auth.routes.js";

const app = express();

const PORT = process.env.PORT || 5000;

/**
 * CORS Origins
 * .env example:
 * CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
 */
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Postman/mobile/server-to-server request ke liye origin undefined ho sakta hai
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Test Route
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

/**
 * API Routes
 */
app.use("/api/auth", authRoutes);

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

let server;

/**
 * Database connect + server start
 */
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Database connected successfully");

    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

/**
 * Graceful Shutdown
 */
const shutdownServer = async (signal) => {
  console.log(`\n${signal} received`);
  console.log("🛑 Shutting down server...");

  try {
    if (server) {
      server.close(async () => {
        console.log("✅ HTTP server closed");

        await db.sequelize.close();
        console.log("✅ Database connection closed");

        console.log("👋 Shutdown server successfully");
        process.exit(0);
      });
    } else {
      await db.sequelize.close();
      console.log("✅ Database connection closed");
      console.log("👋 Shutdown server successfully");
      process.exit(0);
    }
  } catch (error) {
    console.error("❌ Error during shutdown:", error.message);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdownServer("SIGINT"));
process.on("SIGTERM", () => shutdownServer("SIGTERM"));

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  shutdownServer("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
  shutdownServer("unhandledRejection");
});