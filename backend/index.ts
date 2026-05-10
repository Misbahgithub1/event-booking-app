import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser"; 

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/event.js";
import bookingRoutes from "./routes/booking.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

/* ===============================
    MIDDLEWARES
================================ */

//  CORS must allow credentials for refresh token cookie
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,               // allow cookies
  })
);

app.use(express.json());
app.use(cookieParser()); //  Required for refresh token

/* ===============================
    ROUTES
================================ */

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

/* ===============================
    MONGODB CONNECTION
================================ */

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("✅ MongoDB Connected");
    }
  })
  .catch(() => {
    console.error("❌ Database connection failed");
    process.exit(1);
  });

/* ===============================
    ERROR HANDLER
================================ */

app.use(errorHandler);

/* ===============================
    SERVER START
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`🚀 Server running on port ${PORT}`);
  }
});