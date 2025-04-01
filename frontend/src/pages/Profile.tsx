import React, { useState, useEffect } from "react";
import {
  Settings,
  ChevronRight,
  ShoppingBag,
  Star,
  MapPin,
  CreditCard,
  LogOut,
  Camera,
  TrendingUp,
  Package,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("jwtToken");

      try {
        // Fetch user data
        const userResponse = await fetch(
          "https://farm2market-pearl.vercel.app/api/user",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const userData = await userResponse.json();
        setUser(userData);

        // Fetch farmer stats if the user is a farmer
        if (userData.user_type === "farmer") {
          const statsResponse = await fetch(
            "https://farm2market-pearl.vercel.app/farmer/stats",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!statsResponse.ok) {
            throw new Error("Failed to fetch farmer stats.");
          }

          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 margin-bottom-20 overflow-hidden">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 p-8 relative">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center">
            <div className="relative">
              <img
                src={user?.avatar || "https://example.com/default-avatar.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-white">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-green-100">{user?.email}</p>
              <div className="flex items-center mt-2 bg-white/20 rounded-full px-3 py-1 w-fit">
                <Star className="w-4 h-4 text-yellow-300 fill-current" />
                <span className="ml-1 text-sm text-white">
                  Farmer since 2020
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {user?.user_type === "farmer" && stats && (
        <div className="max-w-full mx-auto -mt-8 overflow-hidden">
          <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-xl shadow-sm mx-4">
            <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.total_products}
              </p>
              <p className="text-sm text-gray-600">Products</p>
            </div>
            <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.total_sales}
              </p>
              <p className="text-sm text-gray-600">Sales</p>
            </div>
            <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ₹{stats.total_earnings.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Earnings</p>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="max-w-full mx-auto px-4 mt-6 space-y-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {[
            {
              label: "Orders",
              path: "/orders",
              icon: ShoppingBag,
              bgColor: "bg-green-100",
              color: "text-green-600",
              count: 5,
            },
            {
              label: "Favorites",
              path: "/favorites",
              icon: Star,
              bgColor: "bg-yellow-100",
              color: "text-yellow-600",
              count: 12,
            },
            {
              label: "Addresses",
              path: "/addresses",
              icon: MapPin,
              bgColor: "bg-blue-100",
              color: "text-blue-600",
              count: 3,
            },
            {
              label: "Payment Methods",
              path: "/payments",
              icon: CreditCard,
              bgColor: "bg-purple-100",
              color: "text-purple-600",
              count: 2,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center">
                <div className={`${item.bgColor} p-2 rounded-lg`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="ml-3 font-medium text-gray-900">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full mr-2">
                  {item.count}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/settings")}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded-lg">
              <Settings className="w-5 h-5 text-gray-600" />
            </div>
            <span className="ml-3 font-medium text-gray-900">Settings</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 p-4 text-red-600 bg-white rounded-xl shadow-sm hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
}
