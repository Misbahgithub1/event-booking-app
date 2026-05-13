import { useState } from "react";
import { createEvent, updateEvent } from "../../api/events.api";
import { Event, EventPayload } from "../../types/event.types";

interface Props {
  mode: "create" | "update";
  initialData?: Event | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EventModal = ({
  mode,
  initialData,
  onClose,
  onSuccess,
}: Props) => {

  // ✅ Compute initial form only once
  const initialForm: EventPayload =
    mode === "update" && initialData
      ? {
          title: initialData.title,
          description: initialData.description || "",
          date: initialData.date.split("T")[0],
          location: initialData.location,
          image: initialData.image || "",
          category: initialData.category,
          totalSeats: initialData.totalSeats,
          ticketPrice: initialData.ticketPrice,
        }
      : {
          title: "",
          description: "",
          date: "",
          location: "",
          image: "",
          category: "tech",
          totalSeats: 0,
          ticketPrice: 0,
        };

  const [form, setForm] = useState<EventPayload>(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "number"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        await createEvent(form);
      } else if (mode === "update" && initialData) {
        await updateEvent(initialData._id, form);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4">
          {mode === "create" ? "Create Event" : "Update Event"}
        </h2>

     
           <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Event Title"
            className="w-full border p-2 rounded"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input
            name="description"
            placeholder="Description"
            className="w-full border p-2 rounded"
            value={form.description}
            onChange={handleChange}
          />

          <input
            type="date"
            name="date"
            className="w-full border p-2 rounded"
            value={form.date}
            onChange={handleChange}
            required
          />

          <input
            name="location"
            placeholder="Location"
            className="w-full border p-2 rounded"
            value={form.location}
            onChange={handleChange}
            required
          />

          <input
            name="image"
            placeholder="Image URL"
            className="w-full border p-2 rounded"
            value={form.image}
            onChange={handleChange}
          />

          <select
            name="category"
            className="w-full border p-2 rounded"
            value={form.category}
            onChange={handleChange}
          >
            <option value="tech">Tech</option>
            <option value="music">Music</option>
            <option value="sports">Sports</option>
            <option value="business">Business</option>
            <option value="education">Education</option>
            <option value="other">Other</option>
          </select>

          <input
            type="number"
            name="totalSeats"
            placeholder="Total Seats"
            className="w-full border p-2 rounded"
            value={form.totalSeats}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="ticketPrice"
            placeholder="Ticket Price"
            className="w-full border p-2 rounded"
            value={form.ticketPrice}
            onChange={handleChange}
            required
          />

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              {loading
                ? "Saving..."
                : mode === "create"
                ? "Create"
                : "Update"}
            </button>
          </div>
        </form>
     
      </div>
    </div>
  );
};

export default EventModal;