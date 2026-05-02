import mongoose, { Schema, Document } from "mongoose";

/**
 * Booking Status Types
 */
export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed";

/**
 * Booking Interface
 */
export interface IBooking extends Document {
    user: mongoose.Types.ObjectId;
    event: mongoose.Types.ObjectId;
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
    // otp?: string;
    // otpExpiresAt?: Date;
}

/**
 * Booking Schema
 */
const bookingSchema = new Schema<IBooking>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },

        event: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: [true, "Event is required"],
        },

        status: {
            type: String,
            enum: {
                values: ["pending", "confirmed", "cancelled"],
                message: "Invalid booking status",
            },
            default: "pending",
        },

        paymentStatus: {
            type: String,
            enum: {
                values: ["pending", "paid", "failed"],
                message: "Invalid payment status",
            },
            default: "pending",
        },

        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0, "Amount cannot be negative"],
        },

        // otp: {
        //     type: String,
        // },

        // otpExpiresAt: {
        //     type: Date,
        // },


    },
    {
        timestamps: true,
    }
);

/**
 * Indexes (Performance Optimization)
 */

// Prevent duplicate booking for same user & event
bookingSchema.index({ user: 1, event: 1 }, { unique: true });

// Faster queries
bookingSchema.index({ user: 1 });
bookingSchema.index({ event: 1 });
bookingSchema.index({ status: 1 });

/**
 * Model Export
 */
const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;