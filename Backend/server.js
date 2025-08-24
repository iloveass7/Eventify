import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./Config/dbConnection.js";
import { errorMiddleware } from "./Middleware/error.js";
import { removeUnverifiedAccounts } from "./Automation/removeUnverifiedAccounts.js";
import connectCloudinary from "./Config/cloudinary.js";

import userRouter from "./Route/userRoutes.js";
import eventRouter from "./Route/eventRoutes.js";
import adminRouter from "./Route/adminRoutes.js";
import chatbotRouter from "./Route/chatbotRoutes.js";

config();
const PORT = process.env.PORT || 8000;

export const app = express();

// CORS configuration - update for production
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? [process.env.FRONTEND_URL, "https://your-frontend-domain.com"] // Add your actual frontend URLs
      : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Root route handler - this fixes the "Cannot GET /" error
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully!",
    timestamp: new Date().toISOString(),
    endpoints: {
      users: "/api/user",
      events: "/api/event", 
      admin: "/api/admin",
      chatbot: "/api/chatbot"
    }
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is healthy",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chatbot", chatbotRouter);

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: {
      root: "/",
      health: "/health",
      users: "/api/user",
      events: "/api/event",
      admin: "/api/admin", 
      chatbot: "/api/chatbot"
    }
  });
});

// Error middleware should be last
app.use(errorMiddleware);

// Start server and connect to services
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Connect to database and services
connectDb();
connectCloudinary();
removeUnverifiedAccounts();
