import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  try {
    await register(fullName, email, password);

    navigate("/verify", { state: { email } });

  } catch (err: unknown) {

    if (axios.isAxiosError(err)) {
      setError(
        err.response?.data?.message ?? "Registration failed"
      );
    } else {
      setError("Something went wrong");
    }

  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create an Account
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/*  Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/*  Submit Button */}
        <button
          disabled={loading}
          className="w-full bg-green-500 cursor-pointer text-white py-3 rounded-lg hover:bg-green-600 transition duration-300 font-semibold"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-500 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;