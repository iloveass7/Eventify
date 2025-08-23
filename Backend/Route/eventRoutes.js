import express from "express";
import {
  createEvent,
  viewEvent,
  viewAllEvents,
  editEvent,
  deleteEvent,
  generateCertificate,
} from "../Controller/eventController.js";
import { isAuthenticated } from "../Middleware/auth.js";
import { isAdmin } from "../Middleware/adminAuth.js";
import upload from "../Middleware/multer.js";
import {
  registerForEvent,
  unregisterFromEvent,
} from "../Controller/eventController.js";

const router = express.Router();
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

export default router;
