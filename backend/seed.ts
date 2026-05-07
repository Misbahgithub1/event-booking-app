import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./model/User.js";
import Event from "./model/Event.js";



dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI not found in environment variables");
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" MongoDB Connected");

    // ===============================
    //  Create Admin User (Idempotent)
    // ===============================

    const adminEmail = "admin@gmail.com";

    const existingAdmin = await User.findOne({ email: adminEmail });

    let adminUser;

    if (existingAdmin) {
      console.log("Admin already exists");
      adminUser = existingAdmin;
    } else {
      const hashedPassword = await bcrypt.hash("123456", 10);

      adminUser = await User.create({
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isVerified: true,
      });

      console.log("Admin user created successfully");
    }

    // ===============================
    // Create Dummy Events (Idempotent)
    // ===============================

    const existingEvents = await Event.countDocuments();

    if (existingEvents > 0) {
      console.log("Dummy events already exist");
    } else {
      await Event.insertMany([
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
        {
          title: "Startup Meetup",
          description: "Entrepreneurs networking event",
          date: new Date("2026-09-01"),
          location: "Islamabad Convention Center",
          category: "business",
          totalSeats: 200,
          availableSeats: 200,
          ticketPrice: 1000,
          organizer: adminUser._id,
        },
      ]);

      console.log("Dummy events created successfully");
    }

    console.log("🎉 Seeding completed successfully");
    process.exit(0);

  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();