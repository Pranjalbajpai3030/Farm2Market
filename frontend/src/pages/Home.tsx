import { TrendingUp, MapPin, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="bg-green-50 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-green-800">
          Welcome back, John!
        </h2>
        <p className="text-green-600 mt-1">
          Your marketplace activity at a glance
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <TrendingUp className="w-6 h-6 text-green-500" />
          <p className="mt-2 text-2xl font-bold">₹15,240</p>
          <p className="text-gray-600 text-sm">Today's Sales</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <Clock className="w-6 h-6 text-green-500" />
          <p className="mt-2 text-2xl font-bold">8</p>
          <p className="text-gray-600 text-sm">Active Orders</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-green-800">Recent Activity</h3>
        </div>
        <div className="divide-y">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4 flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3 flex-1">
                <p className="font-medium">New order received</p>
                <p className="text-sm text-gray-600">2kg Tomatoes • ₹160</p>
              </div>
              <span className="text-sm text-gray-500">2h ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
