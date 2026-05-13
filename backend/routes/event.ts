import express, { Router } from "express";

import {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  searchEvents,
} from "../controller/event.controller.js";

import { authorizeRoles, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router: Router = express.Router();

/* ===============================
   ✅ PUBLIC ROUTES
================================ */

/**
 * GET /api/events
 * Get all events (Public)
 */
router.get("/", getAllEvents);

/**
 * GET /api/events/search
 * Search events (Public)
 */
router.get("/search", searchEvents);

/**
 * GET /api/events/:id
 * Get single event (Public)
 */
router.get("/:id", getSingleEvent);

/* ===============================
   ✅ PROTECTED ROUTES
================================ */

/**
 * GET /api/events/user/my-events
 * Get logged-in user's events
 */
router.get(
  "/user/my-events",
  protect,
  authorizeRoles("admin", "user"),
  getMyEvents
);

/**
 * POST /api/events
 * Create event (Admin only)
 */
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  createEvent
);

/**
 * PUT /api/events/:id
 * Update event (Admin only)
 */
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  updateEvent
);

/**
 * DELETE /api/events/:id
 * Delete event (Admin only)
 */
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteEvent
);

export default router;