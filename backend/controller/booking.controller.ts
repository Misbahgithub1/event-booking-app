import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { sendResponse } from "../utils/ApiResponse.js";

import {
  createBookingService,
  verifyBookingOtpService,
  getAllBookingsService,
  getSingleBookingService,
  getUserBookingsService,
  cancelBookingService,
  updateBookingStatusService,
} from "../services/bookingService.js";

/**
 *  Create Booking (User)
 * Sends OTP email
 */
export const createBooking = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?._id || !req.user?.email) {
      throw new ApiError(401, "Unauthorized");
    }

    const { eventId } = req.body;

    if (!eventId) {
      throw new ApiError(400, "Event ID is required");
    }

    const booking = await createBookingService(
      req.user._id.toString(),
      eventId,
      req.user.email
    );

    sendResponse({
      res,
      statusCode: 201,
      message: "Booking created. Please verify OTP sent to your email.",
      data: booking,
    });
  }
);

/**
 *  Verify Booking OTP
 * Confirms booking & decreases seat
 */
export const verifyBookingOtp = asyncHandler(
  async (req: Request, res: Response) => {

    //  Auth check add karo
    if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized");
    }

    const { bookingId, otp } = req.body;

    if (!bookingId || !otp) {
      throw new ApiError(400, "Booking ID and OTP are required");
    }

    const booking = await verifyBookingOtpService(
      bookingId,
      otp
    );

    sendResponse({
      res,
      message: "Booking confirmed successfully",
      data: booking,
    });
  }
);

/**
 *  Get All Bookings (Admin)
 */
export const getAllBookings = asyncHandler(
  async (req: Request, res: Response) => {
    const bookings = await getAllBookingsService();

    sendResponse({
      res,
      data: bookings,
    });
  }
);

/**
 *  Get Single Booking
 */

export const getSingleBooking = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized");
    }

    const booking = await getSingleBookingService(req.params.id);

    //  Ownership check (admin bypass)
    const bookingUserId = (booking.user as any)._id?.toString()
      ?? booking.user.toString();

    const isOwner = bookingUserId === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new ApiError(403, "Unauthorized to view this booking");
    }

    sendResponse({
      res,
      data: booking,
    });
  }
);

/**
 *  Get Logged-in User Bookings
 */
export const getMyBookings = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized");
    }

    const bookings = await getUserBookingsService(
      req.user._id.toString()
    );

    sendResponse({
      res,
      data: bookings,
    });
  }
);

/**
 *  Cancel Booking (User)
 */
export const cancelBooking = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized");
    }

    const booking = await cancelBookingService(
      req.params.id,
      req.user._id.toString()
    );

    sendResponse({
      res,
      message: "Booking cancelled successfully",
      data: booking,
    });
  }
);

/**
 *  Update Booking Status (Admin)
 */

export const updateBookingStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.body;

    if (!status) {
      throw new ApiError(400, "Status is required");
    }

    //  Validate status value
    const validStatuses = ["pending", "confirmed", "cancelled"];

    if (!validStatuses.includes(status)) {
      throw new ApiError(
        400,
        "Invalid status. Must be pending, confirmed or cancelled"
      );
    }

    const booking = await updateBookingStatusService(
      req.params.id,
      status
    );

    sendResponse({
      res,
      message: "Booking status updated successfully",
      data: booking,
    });
  }
);