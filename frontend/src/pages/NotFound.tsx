import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-gray-600 mt-4 text-lg">
        Page not found
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;