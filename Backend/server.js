import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./Config/dbConnection.js";
import connectCloudinary from "./Config/cloudinary.js";
import { removeUnverifiedAccounts } from "./Automation/removeUnverifiedAccounts.js";
import { ensurePrimeAdmin } from "./Utils/ensurePrimeAdmin.js";
import { errorMiddleware } from "./Middleware/error.js";
import userRouter from "./Route/userRoutes.js";
import eventRouter from "./Route/eventRoutes.js";
import adminRouter from "./Route/adminRoutes.js";
import chatbotRouter from "./Route/chatbotRoutes.js";

config();
const PORT = process.env.PORT || 8000;

export const app = express();
app.set("trust proxy", 1);

// CORS
app.use(
  cors({
    origin: "https://eventify-va0c.onrender.com",
    // origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// Parsers
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running successfully!" });
});

app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chatbot", chatbotRouter);
app.use(errorMiddleware);
(async function bootstrap() {
  try {
    await connectDb();                 // 1) DB up
    await ensurePrimeAdmin();          // 2) make sure Prime Admin exists
    await connectCloudinary();         // 3) init cloudinary (await if it returns a promise)
    removeUnverifiedAccounts();        // 4) start scheduled job / cron

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Fatal startup error:", err);
    process.exit(1);
  }
})();

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully…");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully…");
  process.exit(0);
});
