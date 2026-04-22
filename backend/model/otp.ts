import mongoose, { Document, Schema } from "mongoose";

export enum OtpPurpose {
  OTP_VERIFICATION = "OTP_VERIFICATION",
  BOOKING_CONFIRMATION = "BOOKING_CONFIRMATION",
}



export interface IOtp extends Document {
  email: string;
  otp: string;
  purpose: OtpPurpose;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: Object.values(OtpPurpose),
      required: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// auto delete expired OTP
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IOtp>("Otp", otpSchema);