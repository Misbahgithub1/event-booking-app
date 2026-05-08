import axiosInstance from "./axiosInstance";

/**
 * ✅ Create Booking (User)
 */
export const createBooking = async (eventId: string) => {
  const response = await axiosInstance.post("/bookings", { eventId });
  return response.data;
};

/**
 * ✅ Verify Booking OTP
 */
export const verifyBookingOtp = async (
  bookingId: string,
  otp: string
) => {
  const response = await axiosInstance.post("/bookings/verify", {
    bookingId,
    otp,
  });
  return response.data;
};

/**
 * ✅ Get Logged-in User Bookings
 */
export const getMyBookings = async () => {
  const response = await axiosInstance.get("/bookings/my-bookings");
  return response.data;
};

/**
 * ✅ Get All Bookings (Admin only)
 */
export const getAllBookings = async () => {
  const response = await axiosInstance.get("/bookings");
  return response.data;
};

/**
 * ✅ Get Single Booking
 */
export const getSingleBooking = async (bookingId: string) => {
  const response = await axiosInstance.get(
    `/bookings/${bookingId}`
  );
  return response.data;
};

/**
 * ✅ Cancel Booking
 */
export const cancelBooking = async (bookingId: string) => {
  const response = await axiosInstance.patch(
    `/bookings/${bookingId}/cancel`
  );
  return response.data;
};

/**
 * ✅ Update Booking Status (Admin only)
 */
export const updateBookingStatus = async (
  bookingId: string,
  status: "pending" | "confirmed" | "cancelled"
) => {
  const response = await axiosInstance.patch(
    `/bookings/${bookingId}/status`,
    { status }
  );
  return response.data;
};