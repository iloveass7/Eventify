import express from "express";
import { handleChatMessage } from "../Controller/chatbotController.js";

const router = express.Router();

// This endpoint will receive chat messages and return a response
router.route("/chat").post(handleChatMessage);

export default router;
