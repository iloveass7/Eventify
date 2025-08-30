import express from "express";
import {
  createEvent,
  viewEvent,
  viewAllEvents,
  editEvent,
  deleteEvent,
  generateCertificate,
  getPastEvents,
  getUpcomingEvents,
  markAttendance,
  unmarkAttendance,
  updateAttendance,
  listEventGallery,
  uploadEventPhotos,
  deleteEventPhoto,
  getRecommendedEvents
} from "../Controller/eventController.js";
import { isAuthenticated } from "../Middleware/auth.js";
import { isAdmin } from "../Middleware/adminAuth.js";
import upload from "../Middleware/multer.js";
import {
  registerForEvent,
  unregisterFromEvent,
} from "../Controller/eventController.js";

const router = express.Router();
router.route("/past").get(isAuthenticated, getPastEvents);
router.route("/upcoming").get(getUpcomingEvents);
router.route("/all").get(viewAllEvents);
router.route("/:id").get(viewEvent);
router
  .route("/create")
  .post(isAuthenticated, isAdmin, upload.single("image"), createEvent);
router
  .route("/:id")
  .put(isAuthenticated, isAdmin, editEvent)
  .delete(isAuthenticated, isAdmin, deleteEvent);

router.route("/:id/register").post(isAuthenticated, registerForEvent);
router.route("/:id/unregister").post(isAuthenticated, unregisterFromEvent);
router.route("/:id/certificate").get(isAuthenticated, generateCertificate);

router
  .route("/:id/mark-attendance")
  .post(isAuthenticated, isAdmin, markAttendance);
router
  .route("/:id/unmark-attendance")
  .post(isAuthenticated, isAdmin, unmarkAttendance);

router
  .route("/:id/attendance")
  .patch(isAuthenticated, isAdmin, updateAttendance);

// Gallery
router.route("/:id/gallery").get(listEventGallery);
router
  .route("/:id/gallery")
  .post(isAuthenticated, isAdmin, upload.array("photos", 20), uploadEventPhotos); // up to 20 photos

router
  .route("/:id/gallery/:photoId")
  .delete(isAuthenticated, isAdmin, deleteEventPhoto);

router.route("/recommended").get(isAuthenticated, getRecommendedEvents);
export default router;
