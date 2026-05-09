import { Event } from "../../types/event.types";
import EventCard from "./EventCard";

interface Props {
  events: Event[];
}

const EventsGrid = ({ events }: Props) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
};

export default EventsGrid;