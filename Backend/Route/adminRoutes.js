import express from "express";
import {
  getDashboardStats,
  getEventRegistrationStats,
  getUserSignupsOverTime,
  markAttendance,
  getAllAttendees,
} from "../Controller/adminController.js";
import { isAuthenticated } from "../Middleware/auth.js";
import { isAdmin } from "../Middleware/adminAuth.js";

const router = express.Router();

router.use(isAuthenticated, isAdmin);
router.route("/stats").get(getDashboardStats);
router.route("/stats/event-registrations").get(getEventRegistrationStats);
router.route("/stats/user-signups").get(getUserSignupsOverTime);
router.route("/events/mark-attendance").post(markAttendance);
router.route("/events/:id/attendees").get(getAllAttendees);

export default router;
