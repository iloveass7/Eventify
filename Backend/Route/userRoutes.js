import express from "express";
import {
  register,
  verifyOTP,
  login,
  logout,
  getUser,
  forgotPassword,
  resetPassword,
} from "../Controller/userController.js";
import { isAuthenticated } from "../Middleware/auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/verify").post(verifyOTP);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticated, logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticated, getUser);

export default router;
