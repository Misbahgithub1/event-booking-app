import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAllBookings,
  updateBookingStatus,
} from "../../api/bookings.api";

import {
  getAllEvents,
  deleteEvent,
} from "../../api/events.api";

import { Event } from "../../types/event.types";
import { Booking } from "../../types/booking.types";

import StatCard from "../../components/dashboard/StatCard";
import SectionCard from "../../components/dashboard/SectionCard";
import EventTable from "../../components/dashboard/EventTable";
import BookingTable from "../../components/dashboard/BookingTable";
import EventModal from "../../components/dashboard/EventModal";
import Loader from "../../components/common/Loader";

const Dashboard = () => {
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);

  const {
    data: events = [],
    isLoading: eventsLoading,
  } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: () => getAllEvents({ sort: "-createdAt" }),
  });

  const {
    data: bookings = [],
    isLoading: bookingsLoading,
  } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: getAllBookings,
  });

  // ✅ Single unified loading
  const isLoading = eventsLoading || bookingsLoading;

  if (isLoading) {
    return <Loader />;
  }

  const handleDelete = async (id: string) => {
    await deleteEvent(id);
    queryClient.invalidateQueries({ queryKey: ["events"] });
  };

  const handleStatusChange = async (
    id: string,
    status: "confirmed" | "cancelled"
  ) => {
    await updateBookingStatus(id, status);
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-10">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Events" value={events.length} />
        <StatCard title="Total Bookings" value={bookings.length} />
        <StatCard
          title="Confirmed"
          value={
            bookings.filter(
              (b) => b.status === "confirmed"
            ).length
          }
        />
      </div>

      <SectionCard title="Manage Events">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setEditEvent(null);
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            + Create Event
          </button>
        </div>

        <EventTable
          events={events}
          onEdit={(event) => {
            setEditEvent(event);
            setShowModal(true);
          }}
          onDelete={handleDelete}
        />
      </SectionCard>

      <SectionCard title="Manage Bookings">
        <BookingTable
          bookings={bookings}
          onStatusChange={handleStatusChange}
        />
      </SectionCard>

      {showModal && (
        <EventModal
          mode={editEvent ? "update" : "create"}
          initialData={editEvent}
          onClose={() => setShowModal(false)}
          onSuccess={() =>
            queryClient.invalidateQueries({
              queryKey: ["events"],
            })
          }
        />
      )}
    </div>
  );
};

export default Dashboard;