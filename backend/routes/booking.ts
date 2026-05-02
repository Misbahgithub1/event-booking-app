import express, { Router } from "express";

import {
  createBooking,
  verifyBookingOtp,
  getAllBookings,
  getSingleBooking,
  cancelBooking,
  getMyBookings,
  updateBookingStatus,
} from "../controller/booking.controller.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router: Router = express.Router();

/**
 * POST /api/bookings
 * Create booking (User only)
 */
router.post(
  "/",
  protect,
  authorizeRoles("user"),
  createBooking
);

/**
 * POST /api/bookings/verify
 * Verify booking OTP (User only)
 */
router.post(
  "/verify",
  protect,
  authorizeRoles("user"),
  verifyBookingOtp
);

/**
 * GET /api/bookings
 * Get all bookings (Admin only)
 */
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllBookings
);

/**
 * GET /api/bookings/my-bookings
 * Get logged-in user bookings (User only)
 */
router.get(
  "/my-bookings",
  protect,
  authorizeRoles("user"),
  getMyBookings
);

/**
 * GET /api/bookings/:id
 * Get single booking (Admin or Owner)
 */
router.get(
  "/:id",
  protect,
  getSingleBooking
);

/**
 * PATCH /api/bookings/:id/cancel
 * Cancel booking (User only)
 */
router.patch(
  "/:id/cancel",
  protect,
  authorizeRoles("user"),
  cancelBooking
);

/**
 * PATCH /api/bookings/:id/status
 * Update booking status (Admin only)
 */
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateBookingStatus
);

export default router;