import React, { useState } from "react";
import { ArrowRight, Loader2, Leaf } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      // Move focus to the previous input if backspace is pressed
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    } else if (
      e.key !== "Backspace" &&
      otp[index].length === 1 &&
      index < otp.length - 1
    ) {
      // Move focus to the next input when a digit is entered
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const otpString = otp.join(""); // Join the OTP array to form a string
    if (otpString.length !== 6 || isNaN(Number(otpString))) {
      setError("Please enter a valid 6-digit OTP.");
      setLoading(false);
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      console.log(userId);
      const response = await fetch(
        "https://farm2market-pearl.vercel.app/api/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, otp: otpString }), // Send OTP as a string
        }
      );

      if (!response.ok) {
        throw new Error("OTP verification failed");
      }

      const data = await response.json();
      console.log(data.message); // Handle success response here
      alert(
        "OTP verified successfully.Go to login page and use your credentials to login"
      );
      navigate("/login"); // Redirect to home page
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "An error occurred during OTP verification");
      } else {
        setError("An error occurred during OTP verification");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
              }}
            >
              <Leaf className="w-6 h-6 text-emerald-200 transform rotate-45" />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center p-2">
        <div className="w-full max-w-sm">
          {/* Logo and Title */}
          <div className="text-center mb-6">
            <div className="inline-block p-3 rounded-full bg-white shadow-xl mb-3 relative">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center relative overflow-hidden">
                <Leaf className="w-6 h-6 text-white transform -rotate-45" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">
              Farm2Market
            </h1>
            <p className="text-gray-600 text-md">Verify your OTP</p>
          </div>

          {/* OTP Verification Form */}
          <div className="bg-white rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-6 gap-3">
                {otp.map((digit, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      id={`otp-input-${index}`} // Add unique ID for each input
                      value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)} // Handle key down for auto focus
                      maxLength={1}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-center"
                      placeholder="-"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all flex items-center justify-center space-x-2 group shadow-lg shadow-emerald-500/30"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Verify OTP</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={() =>
                    alert("Google OTP login is not implemented yet.")
                  }
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all flex items-center justify-center space-x-2 group shadow-lg shadow-red-500/30"
                >
                  <FcGoogle className="w-5 h-5" />
                  <span>Sign in with Google (OTP not implemented)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
