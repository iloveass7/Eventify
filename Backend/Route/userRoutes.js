import express from "express";
import {
  register,
  verifyOTP,
  login,
  logout,
  getUser,
  forgotPassword,
  resetPassword,
  editUser,
  updateProfilePicture,
  getAllUsers,
  changePassword,
  getMyRegisteredEvents,
  getMyAttendedEvents,
  getMyPreferences,
  putMyPreferences,
  patchMyPreferences,
} from "../Controller/userController.js";
import { isAuthenticated } from "../Middleware/auth.js";
import upload from "../Middleware/multer.js";
import { isAdmin } from "../Middleware/adminAuth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/verify").post(verifyOTP);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticated, logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticated, getUser);
router.route("/me/update").put(isAuthenticated, editUser);
router
  .route("/me/update/picture")
  .put(isAuthenticated, upload.single("profileImage"), updateProfilePicture);
router.route("/admin/users").get(isAuthenticated, isAdmin, getAllUsers);
router.route("/change-password").put(isAuthenticated, changePassword);
router
  .route("/me/registered-events")
  .get(isAuthenticated, getMyRegisteredEvents);
router.route("/me/attended-events").get(isAuthenticated, getMyAttendedEvents);
// add this group below other /me routes:
router
  .route("/me/preferences")
  .get(isAuthenticated, getMyPreferences)
  .put(isAuthenticated, putMyPreferences)
  .patch(isAuthenticated, patchMyPreferences);
export default router;
