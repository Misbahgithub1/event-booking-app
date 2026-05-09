import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = user?.role === "admin";


  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <Link to="/" className="text-xl font-bold text-green-400">
          EventSphere
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-green-400">Home</Link>

          {user ? (
            <>
              <Link to="/bookings" className="hover:text-green-400">
                My Bookings
              </Link>

              {/* ADMIN ONLY */}
              {isAdmin && (
                <Link to="/admin/dashboard" className="hover:text-green-400">
                  Dashboard
                </Link>
              )}

              <button
                onClick={logout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-green-400">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-3 space-y-2">
          <Link to="/" className="block">Home</Link>

          {user ? (
            <>
              <Link to="/bookings" className="block">
                My Bookings
              </Link>


              {/* ADMIN ONLY */}
              {isAdmin && (
                <Link to="/admin/dashboard" className="block">
                  Dashboard
                </Link>
              )}



              <button
                onClick={logout}
                className="block bg-red-500 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block">Login</Link>
              <Link to="/register" className="block">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;