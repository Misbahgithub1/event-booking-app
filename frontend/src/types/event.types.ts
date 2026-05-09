export type EventCategory =
  | "music"
  | "sports"
  | "tech"
  | "business"
  | "education"
  | "other";

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

  organizer: string;

  createdAt: string;
  updatedAt: string;
}

export interface EventPayload {
  title: string;

  description?: string;

  date: string;

  location: string;

  image?: string;

  category: EventCategory;

  totalSeats: number;

  availableSeats: number;

  ticketPrice: number;
}