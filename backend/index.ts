import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();

// ===============================
// Middlewares
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// Routes
// ===============================
app.use("/api/auth", authRoutes);

// ===============================
// MongoDB Connection
// ===============================
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("MongoDB Connected");
    }
  })
  .catch((err) => {
    console.error("Database connection failed");
    process.exit(1); // fail fast 
  });

// ===============================
// Test Route
// ===============================
app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

// ===============================
// Server Start
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Server running on port ${PORT}`);
  }
});