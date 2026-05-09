import { Link } from "react-router-dom";
import { Event } from "../../types/event.types";

interface Props {
  event: Event;
}

const EventCard = ({ event }: Props) => {
  const organizerEmail =
    typeof event.organizer === "object" && event.organizer !== null
      ? event.organizer.email
      : null;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      {/* <div className="h-48 w-full overflow-hidden">
        <div className="w-full aspect-[16/9] bg-gray-200 overflow-hidden">
          <img
            src={event.image || FALLBACK_URL}
            alt={event.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div> */}

      <div className="p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>

        {/* Description */}
        <p className="text-gray-600 mt-2 line-clamp-2">
          {event.description || "No description available."}
        </p>

        {/* Location & Date */}
        <div className="mt-4 text-sm text-gray-500 space-y-1">
          <p>📍 {event.location}</p>
          <p>
            📅{" "}
            {new Date(event.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Seats */}
        <div className="mt-3 text-sm text-gray-600">
          🎟 {event.availableSeats} / {event.totalSeats} seats available
        </div>

        {/* Organizer */}
        {organizerEmail && (
          <div className="mt-2 text-xs text-gray-400">
            Organized by: {organizerEmail}
          </div>
        )}

        {/* Price + Category */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-green-600 font-semibold text-lg">
            Rs {event.ticketPrice}
          </span>

          <span className="text-xs bg-gray-200 px-3 py-1 rounded-full capitalize">
            {event.category}
          </span>
        </div>

        {/* View Details Button */}
        <Link
          to={`/events/${event._id}`}
          className="mt-5 block w-full text-center bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
