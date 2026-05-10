// ✅ Booking Status
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled";

// ✅ Payment Status
export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed";

// ✅ Populated User
export interface BookingUser {
  _id: string;
  email: string;
  role: "user" | "admin";
}

// ✅ Populated Event
export interface BookingEvent {
  _id: string;
  title: string;
  date: string;
  location: string;
}

// ✅ Main Booking Type
export interface Booking {
  _id: string;

  user: BookingUser;
  event: BookingEvent;

  status: BookingStatus;
  paymentStatus: PaymentStatus;

  amount: number;

  createdAt: string;
  updatedAt: string;
}