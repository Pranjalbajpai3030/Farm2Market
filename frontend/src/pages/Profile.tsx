import React from "react";
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
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 margin-bottom-20 overflow-hidden">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 p-8 relative">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-white">John Farmer</h2>
              <p className="text-green-100">Organic Farmer since 2020</p>
              <div className="flex items-center mt-2 bg-white/20 rounded-full px-3 py-1 w-fit">
                <Star className="w-4 h-4 text-yellow-300 fill-current" />
                <span className="ml-1 text-sm text-white">4.8 (120 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-full mx-auto -mt-8 overflow-hidden">
        <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-xl shadow-sm mx-4">
          <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">152</p>
            <p className="text-sm text-gray-600">Products</p>
          </div>
          <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">4.8k</p>
            <p className="text-sm text-gray-600">Sales</p>
          </div>
          <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">₹45k</p>
            <p className="text-sm text-gray-600">Earnings</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-full mx-auto px-4 mt-6 space-y-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {[
            {
              icon: ShoppingBag,
              label: "My Products",
              count: "15",
              path: "/products",
              color: "text-green-600",
              bgColor: "bg-green-100",
            },
            {
              icon: Star,
              label: "Reviews",
              count: "120",
              path: "/reviews",
              color: "text-yellow-600",
              bgColor: "bg-yellow-100",
            },
            {
              icon: MapPin,
              label: "Delivery Locations",
              count: "3",
              path: "/locations",
              color: "text-red-600",
              bgColor: "bg-red-100",
            },
            {
              icon: CreditCard,
              label: "Payment Methods",
              count: "2",
              path: "/payments",
              color: "text-purple-600",
              bgColor: "bg-purple-100",
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
                <span className="ml-3 font-medium text-gray-900">{item.label}</span>
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