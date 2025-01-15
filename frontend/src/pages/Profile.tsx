import React from 'react';
import { Settings, ChevronRight, ShoppingBag, Star, MapPin, CreditCard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="pb-6">
      {/* Profile Header */}
      <div className="bg-green-50 p-6">
        <div className="flex items-center">
          <img
            src={user?.avatar}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-4 border-white"
          />
          <div className="ml-4">
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-gray-600">Farmer since 2020</p>
            <div className="flex items-center mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm">4.8 (120 reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">152</p>
          <p className="text-sm text-gray-600">Products</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">4.8k</p>
          <p className="text-sm text-gray-600">Sales</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">₹45k</p>
          <p className="text-sm text-gray-600">Earnings</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm">
          {[
            { icon: ShoppingBag, label: 'My Products', count: '15', path: '/products' },
            { icon: Star, label: 'Reviews', count: '120', path: '/reviews' },
            { icon: MapPin, label: 'Delivery Locations', count: '3', path: '/locations' },
            { icon: CreditCard, label: 'Payment Methods', count: '2', path: '/payments' }
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border-b last:border-b-0 cursor-pointer"
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center">
                <item.icon className="w-5 h-5 text-green-600" />
                <span className="ml-3">{item.label}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">{item.count}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/settings')}
          className="w-full flex items-center justify-center space-x-2 p-4 bg-white rounded-lg shadow-sm"
        >
          <Settings className="w-5 h-5 text-gray-600" />
          <span>Settings</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 p-4 text-red-600 bg-white rounded-lg shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}