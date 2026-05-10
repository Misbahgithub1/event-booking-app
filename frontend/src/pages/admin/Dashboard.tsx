import { useEffect, useState } from "react";
import { getAllBookings, updateBookingStatus } from "../../api/bookings.api";
import { getAllEvents } from "../../api/events.api";
import { Event } from "../../types/event.types";
import { Booking } from "../../types/booking.types";
import StatCard from "../../components/dashboard/StatCard";
import SectionCard from "../../components/dashboard/SectionCard";
import StatusBadge from "../../components/dashboard/StatusBadge";
import PaymentBadge from "../../components/dashboard/PaymentBadge";

const Dashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsData = await getAllEvents();
        const bookingsData = await getAllBookings();

        setEvents(eventsData);
        setBookings(bookingsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusUpdate = async (
    bookingId: string,
    status: "pending" | "confirmed" | "cancelled",
  ) => {
    await updateBookingStatus(bookingId, status);

    setBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? { ...b, status } : b)),
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-10 text-gray-800">
        Admin Dashboard
      </h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Events" value={events.length} />
        <StatCard title="Total Bookings" value={bookings.length} />
        <StatCard
          title="Confirmed Bookings"
          value={bookings.filter((b) => b.status === "confirmed").length}
        />
      </div>

      {/* ✅ EVENTS SECTION */}
      <SectionCard title="Manage Events">
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wide">
              <tr>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Seats</th>
                <th className="px-6 py-4">Price</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {events.map((event) => (
                <tr
                  key={event._id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {event.title}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {new Date(event.date).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                      {event.availableSeats} / {event.totalSeats}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-medium text-green-600">
                    Rs {event.ticketPrice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* ✅ BOOKINGS SECTION */}
      <SectionCard title="Manage Bookings">
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wide">
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
                <tr
                  key={booking._id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {booking.user.email}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
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
                        handleStatusUpdate(booking._id, "confirmed")
                      }
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                    >
                      Confirm
                    </button>

                    <button
                      onClick={() =>
                        handleStatusUpdate(booking._id, "cancelled")
                      }
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
};

export default Dashboard;
