import React, { useState, useEffect } from "react";
import {
  Home,
  ShoppingCart,
  PlusCircle,
  MessageCircle,
  User,
  Bell,
  Menu,
  Store,
  MapPin,
  X,
  Loader,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const NavItem = ({
  icon: Icon,
  label,
  to,
}: {
  icon: any;
  label: string;
  to: string;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className="flex flex-col items-center">
      <div className={`p-2 rounded-lg ${isActive ? "bg-green-100" : ""}`}>
        <Icon
          className={`w-6 h-6 ${isActive ? "text-green-600" : "text-gray-600"}`}
        />
      </div>
      <span
        className={`text-xs mt-1 ${
          isActive ? "text-green-600" : "text-gray-600"
        }`}
      >
        {label}
      </span>
    </Link>
  );
};

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<string>("");
  const [locationLoading, setLocationLoading] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showLocationPopup, setShowLocationPopup] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>("");
  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(
          `https://farm2market-pearl.vercel.app/api/user`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUserType(data.user_type);
          console.log(data.user_type);
        } else {
          console.log("Error while fetching the type of user.");
        }
      } catch (error) {
        console.log("Error while fetching the type of user.");
      }
    };

    fetchUserType();
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Use reverse geocoding to get human-readable address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();

            // Extract city or neighborhood from the response
            const location =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.suburb ||
              "Your location";

            setUserLocation(location);
            setLocationLoading(false);
          } catch (error) {
            setLocationError("Couldn't fetch location details");
            setUserLocation("Unknown location");
            setLocationLoading(false);
          }
        },
        (error) => {
          setLocationError(
            error.code === 1
              ? "Location access denied"
              : "Couldn't get your location"
          );
          setUserLocation("Set location");
          setLocationLoading(false);
        }
      );
    } else {
      setLocationError("Geolocation not supported");
      setUserLocation("Set location");
      setLocationLoading(false);
    }
  }, []);

  const handleLocationClick = () => {
    setShowLocationPopup(!showLocationPopup);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="ml-3 text-xl font-semibold text-green-600">
              Farm2Market
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleLocationClick}
              className="flex items-center text-green-700 bg-green-50 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors relative"
            >
              {locationLoading ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4 mr-2" />
              )}
              <span className="text-sm font-medium truncate max-w-[120px]">
                {userLocation}
              </span>
            </button>

            {showLocationPopup && (
              <div className="absolute top-16 right-16 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72 z-20">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-800">Your Location</h3>
                  <button
                    onClick={() => setShowLocationPopup(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {locationError ? (
                  <div className="text-red-500 text-sm mb-3">
                    {locationError}
                  </div>
                ) : null}

                <div className="bg-gray-50 p-3 rounded-lg mb-3 flex items-center">
                  <MapPin className="w-5 h-5 text-green-600 mr-2" />
                  <span>{userLocation}</span>
                </div>

                <button
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                  onClick={() => {
                    // This would typically open a location selector
                    setShowLocationPopup(false);
                  }}
                >
                  Change Location
                </button>
              </div>
            )}

            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-gray-600" />
              <span className="absolute top-0 right-0 bg-green-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
<Link
              to="/notifications"
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              aria-label="View notifications"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-0 right-0 bg-green-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                
              </span>
            </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20 px-4">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center px-4 h-20">
          <NavItem icon={Home} label="Home" to="/" />
          <NavItem icon={Store} label="Market" to="/market" />
          {userType === "farmer" && (
            <NavItem icon={PlusCircle} label="Sell" to="/sell" />
          )}
          <NavItem icon={MessageCircle} label="Messages" to="/messages" />
          <NavItem icon={User} label="Profile" to="/profile" />
        </div>
      </nav>
    </div>
  );
}
