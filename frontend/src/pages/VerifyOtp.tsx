import { useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const { verify, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    await verify(email, finalOtp);

    navigate("/login");
  };

  if (!email) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">
          Email not found. Please register again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center"
      >
        <h2 className="text-2xl font-bold mb-4">
          Verify OTP
        </h2>

        <p className="text-gray-600 mb-6">
          Enter the 6-digit code sent to your email
        </p>

        {/*  OTP DIGIT BOXES */}
        <div className="flex justify-between gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                if (el) inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
              className="w-12 h-12 text-center border rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ))}
        </div>

        <button
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;