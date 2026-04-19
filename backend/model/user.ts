import mongoose, { Schema, Document } from "mongoose";

// Roles define
export type UserRole = "user" | "admin";

// User interface (TypeScript typing)
export interface IUser extends Document {
  email: string;
  password: string;
  isVerified: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Schema
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Model export
const User = mongoose.model<IUser>("User", userSchema);

export default User;