import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description?: string;
  date: Date;
  location: string;
  image?: string;
  category: string;
  totalSeats: number;
  availableSeats: number;
  ticketPrice: number;
  organizer: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    date: {
      type: Date,
      required: [true, "Event date is required"],
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    image: {
      type: String,
      default: null,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: {
        values: ["music", "sports", "tech", "business", "education", "other"],
        message: "Invalid category",
      },
    },

    totalSeats: {
      type: Number,
      required: [true, "Total seats are required"],
      min: [1, "Total seats must be at least 1"],
    },

   availableSeats: {
  type: Number,
  required: [true, "Available seats are required"],
  min: [0, "Available seats cannot be negative"],
  validate: {
    validator: function (value: number) {
      return value <= (this as any).totalSeats;
    },
    message: "Available seats cannot exceed total seats",
  },
},

    ticketPrice: {
      type: Number,
      required: [true, "Ticket price is required"],
      min: [0, "Ticket price cannot be negative"],
    },

    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organizer is required"],
    },
  },
  {
    timestamps: true,
  }
);

//  Indexes for performance
eventSchema.index({ date: 1 });
eventSchema.index({ location: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ organizer: 1 });

const Event = mongoose.model<IEvent>("Event", eventSchema);

export default Event;