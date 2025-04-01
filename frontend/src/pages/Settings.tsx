import React, { useState } from "react";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Settings() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
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
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Account Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              // src={user?.avatar}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <button
              type="button"
              className="absolute bottom-0 right-0 p-2 bg-green-600 rounded-full text-white hover:bg-green-700"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Click to change profile picture
          </p>
        </div>

        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h3 className="font-medium text-gray-900">Personal Information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h3 className="font-medium text-gray-900">Notifications</h3>

          <div className="space-y-3">
            {["New orders", "Messages", "Product updates", "Newsletter"].map(
              (item) => (
                <label key={item} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700">{item}</span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Success and Error Messages */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
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
          className="w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
