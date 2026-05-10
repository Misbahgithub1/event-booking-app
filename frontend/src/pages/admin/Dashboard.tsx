import { useEffect, useState } from "react";
import {
  getAllBookings,
  updateBookingStatus,
} from "../../api/bookings.api";
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
    status: "pending" | "confirmed" | "cancelled"
  ) => {
    await updateBookingStatus(bookingId, status);

    setBookings((prev) =>
      prev.map((b) =>
        b._id === bookingId ? { ...b, status } : b
      )
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
          value={
            bookings.filter((b) => b.status === "confirmed")
              .length
          }
        />
      </div>

      {/* EVENTS SECTION */}
      <SectionCard title="Manage Events">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-500 text-sm uppercase">
                <th className="py-3">Title</th>
                <th>Date</th>
                <th>Seats</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              {events.map((event) => (
                <tr
                  key={event._id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="py-3 font-medium">
                    {event.title}
                  </td>
                  <td>
                    {new Date(
                      event.date
                    ).toLocaleDateString()}
                  </td>
                  <td>
                    {event.availableSeats} /{" "}
                    {event.totalSeats}
                  </td>
                  <td>Rs {event.ticketPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* BOOKINGS SECTION */}
      <SectionCard title="Manage Bookings">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-500 text-sm uppercase">
                <th className="py-3">User</th>
                <th>Event</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="py-3">
                    {booking.user.email}
                  </td>
                  <td>{booking.event.title}</td>

                  <td>
                    <StatusBadge status={booking.status} />
                  </td>

                  <td>
                    <PaymentBadge
                      payment={booking.paymentStatus}
                    />
                  </td>

                  <td className="space-x-2">
                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          booking._id,
                          "confirmed"
                        )
                      }
                      className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
                    >
                      Confirm
                    </button>

                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          booking._id,
                          "cancelled"
                        )
                      }
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
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