import mongoose, { Schema, Document } from "mongoose";

// Roles define
export type UserRole = "user" | "admin";

// User interface (TypeScript typing)
export interface IUser extends Document {
  fullName: string;
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

     fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Full name must be at least 3 characters"],
      maxlength: [50, "Full name cannot exceed 50 characters"],
    },

    
    email: {
       type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
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

userSchema.index({ email: 1 });

// Model export
const User = mongoose.model<IUser>("User", userSchema);

export default User;