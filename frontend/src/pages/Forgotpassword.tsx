import React, { useState } from "react";
import { Sprout, ArrowRight, Loader2, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://farm2market-pearl.vercel.app/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send reset email");
      }

      const data = await response.json();
      setSuccess(
        "A password reset link has been sent to your email. Please check your inbox (and spam folder if necessary)."
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
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
                <Sprout className="w-6 h-6 text-white transform -rotate-45" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">
              Farm2Market
            </h1>
            <p className="text-gray-600 text-md">Reset your password</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-lg">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  placeholder="Enter your email"
                  disabled={success !== "" || loading}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all flex items-center justify-center space-x-2 group shadow-lg shadow-emerald-500/30"
                disabled={loading || success !== ""}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-sm text-emerald-600 hover:text-emerald-800 transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}