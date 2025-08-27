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
app.set('trust proxy', 1);

app.use(
  cors({
    // origin: "https://eventify-va0c.onrender.com",
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully!"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDb();
connectCloudinary();
removeUnverifiedAccounts();

app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chatbot", chatbotRouter);

app.use(errorMiddleware);
