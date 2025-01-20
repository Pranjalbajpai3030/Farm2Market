import React, { useState } from "react";
import { Sprout, ArrowRight, Loader2, Leaf } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        try {
          const response = await fetch(
            `https://farm2market-pearl.vercel.app/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            }
          );
          if (!response.ok) throw new Error("Invalid credentials");

          const data = await response.json();
          console.log(data.message); // Display message to the user
          console.log(data.jwtToken); // Display token
          localStorage.setItem("jwtToken", data.jwtToken); // Save token
          navigate("/");
        } catch (err) {
          console.error(err);
          throw new Error("Login failed");
        }
      } else {
        try {
          const response = await fetch(
            `https://farm2market-pearl.vercel.app/api/auth/signup`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ firstName, lastName, email, password }),
            }
          );
          if (!response.ok) throw new Error("Signup failed");
          const data = await response.json();
          console.log(data.message); // Display message to the user
          localStorage.setItem("userId", data.userId); // Save user ID for OTP verification
          alert(
            "OTP has been sent to your email. Please check your inbox, and if you do not see it, check your spam folder for the verification email."
          );
          navigate("/verify-otp");
        } catch (err) {
          console.error(err);
          throw new Error("Signup failed");
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = () => {
    //need to implement
    alert("Google Login is under development");
  };
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        {/* Floating leaves animation */}
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
            <p className="text-gray-600 text-md">
              {isLogin
                ? "Welcome to your harvest hub!"
                : "Join our growing community"}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100">
            <div className="mb-6 flex justify-center space-x-3">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  isLogin
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  !isLogin
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              {!isLogin && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      placeholder="Last name"
                    />
                  </div>
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  placeholder="Enter your password"
                />
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
                    <span>{isLogin ? "Sign In" : "Create Account"}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all flex items-center justify-center space-x-2 group shadow-lg shadow-red-500/30"
                >
                  <FcGoogle className="w-5 h-5" />
                  <span>Sign in with Google</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
