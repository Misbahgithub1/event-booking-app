import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "./model/User.js";
import Event from "./model/Event.js";
import Booking from "./model/Bookings.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI not found in environment variables");
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    // ===============================
    // ✅ Create Admin User
    // ===============================

    const adminEmail = "admin@gmail.com";
    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("123456", 10);

      adminUser = await User.create({
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isVerified: true,
      });

      console.log("✅ Admin user created");
    } else {
      console.log("✅ Admin already exists");
    }

    // ===============================
    // ✅ Create Normal Test User
    // ===============================

    const userEmail = "user@gmail.com";
    let normalUser = await User.findOne({ email: userEmail });

    if (!normalUser) {
      const hashedPassword = await bcrypt.hash("123456", 10);

      normalUser = await User.create({
        email: userEmail,
        password: hashedPassword,
        role: "user",
        isVerified: true,
      });

      console.log("✅ Test user created");
    } else {
      console.log("✅ Test user already exists");
    }

    // ===============================
    // ✅ Create Dummy Events
    // ===============================

    let events = await Event.find();

    if (events.length === 0) {
      events = await Event.insertMany([
        {
          title: "Tech Conference 2026",
          description: "Annual technology conference",
          date: new Date("2026-08-15"),
          location: "Lahore Expo Center",
          category: "tech",
          totalSeats: 500,
          availableSeats: 500,
          ticketPrice: 2500,
          organizer: adminUser._id,
        },
        {
          title: "Music Night",
          description: "Live music event",
          date: new Date("2026-06-10"),
          location: "Karachi Arena",
          category: "music",
          totalSeats: 300,
          availableSeats: 300,
          ticketPrice: 1500,
          organizer: adminUser._id,
        },
      ]);

      console.log("✅ Dummy events created");
    } else {
      console.log("✅ Events already exist");
    }

    // ===============================
    // ✅ Create Dummy Bookings
    // ===============================

    const existingBookings = await Booking.countDocuments();

    if (existingBookings === 0 && normalUser && events.length > 0) {
      const firstEvent = events[0];

      // Decrease seat for confirmed booking
      firstEvent.availableSeats -= 1;
      await firstEvent.save();

      await Booking.create({
        user: normalUser._id,
        event: firstEvent._id,
        status: "confirmed",
        paymentStatus: "paid",
        amount: firstEvent.ticketPrice,
      });

      console.log("✅ Dummy booking created");
    } else {
      console.log("✅ Bookings already exist");
    }

    console.log("🎉 Seeding completed successfully");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();