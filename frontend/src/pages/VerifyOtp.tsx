import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

const OTP_LENGTH = 6;
const TIMER_SECONDS = 300; // 5 minutes

const VerifyOtp = () => {
  const { verify } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [shaking, setShaking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const inputsRef = useRef<HTMLInputElement[]>([]);

  // ✅ Countdown Timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // ✅ Auto-submit when filled
    if (newOtp.join("").length === OTP_LENGTH) {
      handleVerify(newOtp.join(""));
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

  const handleVerify = async (finalOtp: string) => {
    try {
      setSubmitting(true);
      await verify(email, finalOtp);
      navigate("/login");
    } catch {
      setError("Invalid or expired OTP");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(otp.join(""));
  };

  const handleResend = () => {
    setTimer(TIMER_SECONDS);
    setError("");
    // ✅ Call resendOtp API here
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
        className={`bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center ${
          shaking ? "animate-shake" : ""
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">
          Verify OTP
        </h2>

        <p className="text-gray-600 mb-2">
          Enter the 6-digit code sent to your email
        </p>

        {/* ✅ Countdown */}
        <p className="text-sm text-gray-500 mb-4">
          {timer > 0
            ? `Expires in ${Math.floor(timer / 60)}:${(
                timer % 60
              )
                .toString()
                .padStart(2, "0")}`
            : "OTP expired"}
        </p>

        {/* ✅ OTP Boxes */}
        <div className="flex justify-between gap-2 mb-4">
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

        {error && (
          <p className="text-red-500 text-sm mb-3">
            {error}
          </p>
        )}

        {/* ✅ Verify Button */}
        <button
          disabled={
            submitting || otp.join("").length !== OTP_LENGTH
          }
          className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
        >
          {submitting ? "Verifying..." : "Verify"}
        </button>

        {/* ✅ Resend OTP */}
        <button
          type="button"
          disabled={timer > 0}
          onClick={handleResend}
          className="mt-4 text-sm text-blue-500 hover:underline disabled:opacity-50"
        >
          Resend OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;