import EventsGrid from "../components/events/EventsGrid";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
          Discover Amazing Events
        </h1>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Browse and book events happening near you.
        </p>
      </div>

      <EventsGrid />
    </div>
  );
};

export default Home;