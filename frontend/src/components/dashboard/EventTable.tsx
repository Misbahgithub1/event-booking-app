import { Event } from "../../types/event.types";

interface Props {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

const EventTable = ({ events, onEdit, onDelete }: Props) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wide">
          <tr>
            <th className="px-6 py-4">Event</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Seats</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {events.map((event) => (
            <tr key={event._id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 font-semibold text-gray-800">
                {event.title}
              </td>

              <td className="px-6 py-4 text-gray-500">
                {new Date(event.date).toLocaleDateString()}
              </td>

              <td className="px-6 py-4">
                <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                  {event.availableSeats} / {event.totalSeats}
                </span>
              </td>

              <td className="px-6 py-4 font-medium text-green-600">
                Rs {event.ticketPrice}
              </td>

              <td className="px-6 py-4 space-x-2">
                <button
                  onClick={() => onEdit(event)}
                  className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(event._id)}
                  className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;