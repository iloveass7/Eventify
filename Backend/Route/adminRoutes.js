import express from "express";
import {
  getDashboardStats,
  getEventRegistrationStats,
  getUserSignupsOverTime,
  markAttendance,
  getAllAttendees,
  listAdminRequests,
  approveAdmin,
  rejectAdmin,
  listUsers,
  deleteUser,
  bulkDeleteUsers,
  emailApproveAdmin,
  emailRejectAdmin,
} from "../Controller/adminController.js";

import { isAuthenticated } from "../Middleware/auth.js";
import { isAdmin, isPrimeAdmin } from "../Middleware/adminAuth.js";

const router = express.Router();

router.get("/email/approve/:userId", emailApproveAdmin);
router.get("/email/reject/:userId",  emailRejectAdmin);
router.use(isAuthenticated);
router.use(isAdmin);
router.get("/stats", getDashboardStats);
router.get("/stats/event-registrations", getEventRegistrationStats);
router.get("/stats/user-signups", getUserSignupsOverTime);
router.post("/events/mark-attendance", markAttendance);
router.get("/events/:id/attendees", getAllAttendees);
router.use(isPrimeAdmin);
router.get("/admin-requests", listAdminRequests);
router.post("/admin-requests/:userId/approve", approveAdmin);
router.post("/admin-requests/:userId/reject",  rejectAdmin);
router.get("/users",            listUsers);
router.delete("/users/:id",     deleteUser);
router.post("/users/bulk-delete", bulkDeleteUsers);

export default router;
