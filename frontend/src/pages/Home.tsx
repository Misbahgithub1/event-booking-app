import { useQuery } from "@tanstack/react-query";
import EventsGrid from "../components/events/EventsGrid";
import { getAllEvents } from "../api/events.api";
import { Event } from "../types/event.types";

const Home = () => {
  const {
    data: events = [],
    isLoading,
  } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: () =>
      getAllEvents({ sort: "-createdAt" }),
  });

  return (
    <div className="bg-gradientisLoading-to-br from-gray-900 via-gray-800 to-black text-white">
      
      {/* HERO */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 bg-clip-text text-transparent animate-fade-in">
          Discover Amazing Events
        </h1>

        <p className="mt-6 text-gray-300 max-w-2xl text-lg md:text-xl">
          Explore tech conferences, music festivals, and more.
        </p>

        <button
          onClick={() =>
            document
              .getElementById("events")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="mt-8 bg-green-500 hover:bg-green-600 transition px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-green-500/40"
        >
          Browse Events ↓
        </button>
      </section>

      {/* EVENTS */}
      <section
        id="events"
        className="bg-gray-100 text-gray-900 px-4 min-h-screen"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Upcoming Events
            </h2>
            <p className="mt-3 text-gray-600">
              Find events that match your interests.
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="aspect-[16/9] bg-gray-200 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="animate-fade-in">
              <EventsGrid events={events} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;