// ✅ Event Categories (Strict typing)
export type EventCategory =
  | "music"
  | "sports"
  | "tech"
  | "business"
  | "education"
  | "other";

// ✅ Organizer Type
export interface EventOrganizer {
  _id: string;
  email: string;
}

// ✅ Main Event Type
export interface Event {
  _id: string;

  title: string;
  description?: string;

  date: string;

  location: string;

  image?: string | null;

  category: EventCategory;

  totalSeats: number;
  availableSeats: number;

  ticketPrice: number;

  // ✅ Can be either populated object or string ID
  organizer: string | EventOrganizer;

  createdAt: string;
  updatedAt: string;
}

// ✅ Payload Type (Create / Update)
export interface EventPayload {
  title: string;
  description?: string;

  date: string;
  location: string;

  image?: string;

  category: EventCategory;

  totalSeats: number;
  ticketPrice: number;
}