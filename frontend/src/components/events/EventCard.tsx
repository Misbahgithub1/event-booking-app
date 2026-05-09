import { Event } from "../../types/event.types";

interface Props {
  event: Event;
}

const EventCard = ({ event }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer">
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-800">
          {event.title}
        </h2>

        <p className="text-gray-600 mt-2 line-clamp-2">
          {event.description}
        </p>

        <div className="mt-4 text-sm text-gray-500 space-y-1">
          <p>📍 {event.location}</p>
          <p>📅 {new Date(event.date).toLocaleDateString()}</p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-green-600 font-semibold">
            Rs {event.ticketPrice}
          </span>

          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
            {event.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;