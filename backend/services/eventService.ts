import mongoose from "mongoose";
import  Event, { IEvent } from "../model/Event.js";


/**
 *   Create new event
 */


export const createEventService = async (
  data: Partial<IEvent>
): Promise<IEvent> => {

  if (!data.totalSeats || data.totalSeats < 1) {
    throw new Error("Total seats must be at least 1");
  }

  if (data.ticketPrice === undefined || data.ticketPrice < 0) {
    throw new Error("Ticket price must be 0 or greater");
  }

  // Auto set availableSeats = totalSeats
  data.availableSeats = data.totalSeats;

  const event = await Event.create(data);

  return event;
};


//  Get all events with pagination
export const getAllEventsService = async (
  page: number = 1,
  limit: number = 10,
  sort: string = "-createdAt"
) => {
  const skip = (page - 1) * limit;

  const events = await Event.find()
    .populate("organizer", "name email")
    .sort(sort as any)
    .skip(skip)
    .limit(limit);

  const total = await Event.countDocuments();

  return {
    events,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total,
  };
};

// Get single event by ID
export const getSingleEventService = async (id: string): Promise<IEvent> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid event ID");
  }

  const event = await Event.findById(id).populate(
    "organizer",
    "name email"
  );

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};



export const updateEventService = async (
  id: string,
  data: Partial<IEvent>
): Promise<IEvent> => {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid event ID");
  }

  const existingEvent = await Event.findById(id);

  if (!existingEvent) {
    throw new Error("Event not found");
  }


  if (data.totalSeats !== undefined) {
    if (data.totalSeats < existingEvent.totalSeats - existingEvent.availableSeats) {
      throw new Error("Total seats cannot be less than already booked seats");
    }

    // adjust available seats if needed
    const bookedSeats =
      existingEvent.totalSeats - existingEvent.availableSeats;

    data.availableSeats = data.totalSeats - bookedSeats;
  }

  const updatedEvent = await Event.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("organizer", "name email");

  return updatedEvent as IEvent;
};



// delete events
export const deleteEventService = async (id: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid event ID");
  }

  const event = await Event.findByIdAndDelete(id);

  if (!event) {
    throw new Error("Event not found");
  }  

  return true;
};

/**
 *   Get events by organizer
 */

export const getEventsByOrganizerService = async (
  organizerId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(organizerId)) {
    throw new Error("Invalid organizer ID");
  }

  const events = await Event.find({ organizer: organizerId })
    .sort({ createdAt: -1 })
    .populate("organizer", "name email");

  return events;
};

/**
 *  Search events
 */
export const searchEventsService = async (query: string) => {
  const events = await Event.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
  })
    .populate("organizer", "name email")
    .sort({ createdAt: -1 })
    .limit(20);

  return events;
};