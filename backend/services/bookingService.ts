import mongoose from "mongoose";
import Booking, { IBooking } from "../model/Bookings.js";
import Event from "../model/Event.js";
import { ApiError } from "../utils/ApiError.js";
import { sendEmail, EmailType } from "../utils/sendEmail.js";
import Otp, {OtpPurpose} from "../model/OTP.js";
import { generateOtp } from "../utils/otp.utils.js";

const OTP_EXPIRY = 5 * 60 * 1000;


/**
 * Create Booking
 */
export const createBookingService = async (
  userId: string,
  eventId: string,
  userEmail: string
) => {

     if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ApiError(400, "Invalid event ID");
  }

  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (event.availableSeats <= 0) {
    throw new ApiError(400, "No seats available");
  }

  const existingBooking = await Booking.findOne({
    user: userId,
    event: eventId,
  });

  if (existingBooking) {
    throw new ApiError(400, "You already booked this event");
  }

  // Generate OTP (same system as auth)
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY);

  // Save booking as pending
  const booking = await Booking.create({
    user: userId,
    event: eventId,
    amount: event.ticketPrice,
    status: "pending",
    paymentStatus: "pending",
  });

  // Save OTP in OTP collection
 await Otp.create({
  email: userEmail,
  otp,
  purpose: OtpPurpose.BOOKING_CONFIRMATION,
  booking: booking._id, // LINK OTP TO BOOKING
  expiresAt,
});

  //  Send confirmation email
  await sendEmail({
    to: userEmail,
    type: EmailType.BOOKING_CONFIRMATION,
    otp,
    expiresAt,
  });

  return booking;
};



export const verifyBookingOtpService = async (
  bookingId: string,
  otp: string
) => {

  //  Validate OTP against specific booking
  const validOtp = await Otp.findOne({
    booking: bookingId,
    otp,
    purpose: OtpPurpose.BOOKING_CONFIRMATION,
    expiresAt: { $gt: new Date() },
  });

  if (!validOtp) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  //  Fetch booking with event & user
  const booking = await Booking.findById(bookingId)
    .populate("event")
    .populate("user");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const event = booking.event as any;
  const user = booking.user as any;

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (event.availableSeats <= 0) {
    throw new ApiError(400, "No seats available");
  }

  // Decrease available seat
  event.availableSeats -= 1;
  await event.save();

  // Update booking status
  booking.status = "confirmed";
  booking.paymentStatus = "paid";
  await booking.save();

  // Delete OTP linked to this booking
  await Otp.deleteMany({
    booking: bookingId,
    purpose: OtpPurpose.BOOKING_CONFIRMATION,
  });

  // Send Thank You email
  await sendEmail({
    to: user.email,
    type: EmailType.THANK_YOU,
    eventName: event.title,
  });

  return booking;
};

/**
 * Get All Bookings (Admin)
 */
export const getAllBookingsService = async () => {
  return await Booking.find()
    .populate("user", "email role")
    .populate("event", "title date location")
    .sort({ createdAt: -1 });
};

/**
 * Get Single Booking
 */
export const getSingleBookingService = async (
  bookingId: string
): Promise<IBooking> => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new ApiError(400, "Invalid booking ID");
  }

  const booking = await Booking.findById(bookingId)
    .populate("user", "email")
    .populate("event", "title date location");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  return booking;
};

/**
 * Get User Bookings
 */
export const getUserBookingsService = async (userId: string) => {
  return await Booking.find({ user: userId })
    .populate("event", "title date location")
    .sort({ createdAt: -1 });
};

/**
 * Cancel Booking
 */
export const cancelBookingService = async (
  bookingId: string,
  userId: string
): Promise<IBooking> => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new ApiError(400, "Invalid booking ID");
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.user.toString() !== userId) {
    throw new ApiError(403, "Unauthorized to cancel this booking");
  }

  if (booking.status === "cancelled") {
    throw new ApiError(400, "Booking already cancelled");
  }

  // Increase available seats
  const event = await Event.findById(booking.event);
  if (event) {
    event.availableSeats += 1;
    await event.save();
  }

  booking.status = "cancelled";
  booking.paymentStatus = "failed";

  await booking.save();

  return booking;
};

/**
 * Update Booking Status (Admin)
 */
export const updateBookingStatusService = async (
  bookingId: string,
  status: "pending" | "confirmed" | "cancelled"
): Promise<IBooking> => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new ApiError(400, "Invalid booking ID");
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  booking.status = status;
  await booking.save();

  return booking;
};