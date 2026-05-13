import { Booking } from "../../types/booking.types";
import StatusBadge from "./StatusBadge";
import PaymentBadge from "./PaymentBadge";

interface Props {
  bookings: Booking[];
  onStatusChange: (
    id: string,
    status: "confirmed" | "cancelled"
  ) => void;
}

const BookingTable = ({ bookings, onStatusChange }: Props) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
          <tr>
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Event</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Payment</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {bookings.map((booking) => (
            <tr key={booking._id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                {booking.user.email}
              </td>
              <td className="px-6 py-4">
                {booking.event.title}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={booking.status} />
              </td>
              <td className="px-6 py-4">
                <PaymentBadge payment={booking.paymentStatus} />
              </td>
              <td className="px-6 py-4 space-x-2">
                <button
                  onClick={() =>
                    onStatusChange(
                      booking._id,
                      "confirmed"
                    )
                  }
                  className="px-3 py-1 text-xs bg-green-500 text-white rounded"
                >
                  Confirm
                </button>

                <button
                  onClick={() =>
                    onStatusChange(
                      booking._id,
                      "cancelled"
                    )
                  }
                  className="px-3 py-1 text-xs bg-red-500 text-white rounded"
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;