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

  const [form, setForm] = useState<EventPayload>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    date: initialData?.date
      ? initialData.date.split("T")[0]
      : "",
    location: initialData?.location || "",
    category: initialData?.category || "tech",
    totalSeats: initialData?.totalSeats || 0,
    ticketPrice: initialData?.ticketPrice || 0,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initialData?.image || null
  );

  const [loading, setLoading] = useState(false);

  const isFormValid =
    form.title.trim() &&
    form.description.trim() &&
    form.date &&
    form.location.trim() &&
    form.totalSeats > 0 &&
    form.ticketPrice > 0;

 const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >
) => {
  setForm({
    ...form,
    [e.target.name]:
      e.target.type === "number"
        ? Number(e.target.value)
        : e.target.value,
  });
};

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("date", form.date);
      formData.append("location", form.location);
      formData.append("category", form.category);
      formData.append("totalSeats", form.totalSeats.toString());
      formData.append("ticketPrice", form.ticketPrice.toString());

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (mode === "create") {
        await createEvent(formData);
      } else if (mode === "update" && initialData) {
        await updateEvent(initialData._id, formData);
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
    <div className="fixed inset-0  bg-opacity-10 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl transform transition-all duration-300">

        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          {mode === "create" ? "Create Event" : "Update Event"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="md:col-span-2">
            <input
              name="title"
              placeholder="Event Title"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="md:col-span-2">
            <textarea
              name="description"
              placeholder="Event Description"
              className="w-full border rounded-lg p-3 h-24 focus:ring-2 focus:ring-green-500"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="date"
            name="date"
            className="border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
            value={form.date}
            onChange={handleChange}
            required
          />

          <input
            name="location"
            placeholder="Location"
            className="border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
            value={form.location}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            className="border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
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

         <div className="flex flex-col">
  <label className="text-sm font-medium text-gray-600 mb-1">
    Total Seats
  </label>
  <input
    type="number"
    name="totalSeats"
    placeholder="Enter total available seats (e.g. 100)"
    className="border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
    value={form.totalSeats}
    onChange={handleChange}
    min={1}
    required
  />
  <span className="text-xs text-gray-400 mt-1">
    Minimum 1 seat required
  </span>
</div>

<div className="flex flex-col">
  <label className="text-sm font-medium text-gray-600 mb-1">
    Ticket Price (PKR)
  </label>
  <input
    type="number"
    name="ticketPrice"
    placeholder="Enter ticket price (e.g. 2500)"
    className="border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
    value={form.ticketPrice}
    onChange={handleChange}
    min={0}
    required
  />
  <span className="text-xs text-gray-400 mt-1">
    Enter price in Pakistani Rupees
  </span>
</div>

          <div className="md:col-span-2">
            <input
              type="file"
              accept="image/*"
              className="w-full border rounded-lg p-3"
              onChange={handleFileChange}
            />
          </div>

          {preview && (
            <div className="md:col-span-2">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg shadow"
              />
            </div>
          )}

          <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : mode === "create"
                ? "Create Event"
                : "Update Event"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EventModal;