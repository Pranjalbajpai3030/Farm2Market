import React, { useState } from "react";
import { Camera, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const token = localStorage.getItem("jwtToken");

    try {
      const response = await fetch(
        "https://farm2market-pearl.vercel.app/api/update-user",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user information.");
      }

      setSuccessMessage("Settings updated successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white">
          <h2 className="text-3xl font-bold">Account Settings</h2>
          <p className="mt-2 text-emerald-100">Customize your Farm2Market experience</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden ring-4 ring-emerald-200">
                <img alt="Profile" className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                className="absolute bottom-2 right-2 p-2 bg-emerald-500 rounded-full text-white hover:bg-emerald-600"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500">Tap to update your avatar</p>
          </div>

          <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-xl font-semibold">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                  placeholder="Enter last name"
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-emerald-600 hover:text-emerald-800 font-medium"
            >
              <Lock className="w-4 h-4 inline" /> Forgot Password?
            </button>
          </div>

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
