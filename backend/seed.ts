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
    // ✅ Admin User
    // ===============================

    const adminEmail = "admin@gmail.com";
    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("123456", 10);

      adminUser = await User.create({
        fullName: "Admin User",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isVerified: true,
      });

      console.log("✅ Admin created");
    } else {
      console.log("✅ Admin already exists");
    }

    // ===============================
    // ✅ Normal User
    // ===============================

    const userEmail = "user@gmail.com";
    let normalUser = await User.findOne({ email: userEmail });

    if (!normalUser) {
      const hashedPassword = await bcrypt.hash("123456", 10);

      normalUser = await User.create({
        fullName: "Test User",
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
    // ✅ Reset & Create Dummy Events (Dev Mode)
    // ===============================

    await Event.deleteMany(); // ✅ Always reset in dev
    console.log("✅ Old events cleared");

    const dummyEvents = [
      {
        title: "Tech Conference 2026",
        description: "Annual technology conference",
        date: new Date("2026-08-15"),
        location: "Lahore Expo Center",
        category: "tech",
        totalSeats: 500,
        availableSeats: 500,
        ticketPrice: 2500,
        image:
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=70&auto=format",
      },
      {
        title: "Music Night Live",
        description: "Live music and entertainment show",
        date: new Date("2026-06-10"),
        location: "Karachi Arena",
        category: "music",
        totalSeats: 300,
        availableSeats: 300,
        ticketPrice: 1500,
        image:
          "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=70&auto=format",
      },
      {
        title: "Startup Meetup",
        description: "Networking for entrepreneurs",
        date: new Date("2026-09-01"),
        location: "Islamabad Convention Center",
        category: "business",
        totalSeats: 200,
        availableSeats: 200,
        ticketPrice: 1000,
        image:
          "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800&q=70&auto=format",
      },
      {
        title: "AI & Machine Learning Workshop",
        description: "Hands-on AI training session",
        date: new Date("2026-07-20"),
        location: "FAST University Lahore",
        category: "tech",
        totalSeats: 150,
        availableSeats: 150,
        ticketPrice: 3500,
        image:
          "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=70&auto=format",
      },
      {
        title: "Sports Championship",
        description: "Inter-city sports competition",
        date: new Date("2026-10-05"),
        location: "National Stadium Karachi",
        category: "sports",
        totalSeats: 800,
        availableSeats: 800,
        ticketPrice: 1200,
        image:
          "https://images.unsplash.com/photo-1505842465776-3d7c9a71b1e9?w=800&q=70&auto=format",
      },
      {
        title: "Education Expo 2026",
        description: "University and scholarship fair",
        date: new Date("2026-11-12"),
        location: "Expo Center Lahore",
        category: "education",
        totalSeats: 400,
        availableSeats: 400,
        ticketPrice: 500,
        image:
          "https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=800&q=70&auto=format",
      },
    ];

    const eventsWithOrganizer = dummyEvents.map((event) => ({
      ...event,
      organizer: adminUser!._id,
    }));

    const createdEvents = await Event.insertMany(eventsWithOrganizer);

    console.log("✅ Fresh dummy events inserted");

    // ===============================
    // ✅ Dummy Booking
    // ===============================

    await Booking.deleteMany(); // ✅ Reset bookings in dev

    if (normalUser && createdEvents.length > 0) {
      const event = createdEvents[0];

      event.availableSeats -= 1;
      await event.save();

      await Booking.create({
        user: normalUser._id,
        event: event._id,
        status: "confirmed",
        paymentStatus: "paid",
        amount: event.ticketPrice,
      });

      console.log("✅ Dummy booking created");
    }

    console.log("🎉 Seeding completed successfully");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();