import express from "express";
import path from "path";
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

app.use(
  cors({
    origin: "http://localhost:5173/", // Allowing the frontend to make requests
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React build folder
app.use(express.static(path.join(dirname, "client/build")));

// API routes
app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chatbot", chatbotRouter);

// For all routes that are not API routes, serve the React index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(dirname, "client/build", "index.html"));
});

// Handle errors
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDb();
connectCloudinary();
removeUnverifiedAccounts();
