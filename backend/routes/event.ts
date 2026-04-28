import express, { Router } from "express";

import { createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  searchEvents, } from "../controller/event.controller.js";
  
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";



const router: Router = express.Router();

/**
 *   POST /api/events
 *   Create event (Admin only)
 */
router.post("/", protect, authorizeRoles("admin"), createEvent);

/**
 *    GET /api/events
 *     Get all events (Public)
 */
router.get("/", getAllEvents);

/**
 *    GET /api/events/search
 *     Search events (Public)
 */
router.get("/search", searchEvents);

/**
 *    GET /api/events/:id
 *     Get single event (Public)
 */
router.get("/:id", getSingleEvent);

/**
 *    PUT /api/events/:id
 *     Update event (Admin only)
 */
router.put("/:id", protect, authorizeRoles("admin"), updateEvent);

/**
 *    DELETE /api/events/:id
 *     Delete event (Admin only)
 */
router.delete("/:id", protect, authorizeRoles("admin"), deleteEvent);

/**
 *    GET /api/events/user/my-events
 *     Get user's events (Private)
 */
router.get("/user/my-events", protect, getMyEvents);

export default router;