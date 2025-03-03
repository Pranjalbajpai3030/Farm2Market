import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  MapPin, 
  Clock, 
  ShoppingCart, 
  Leaf, 
  Search, 
  BarChart3, 
  Calendar, 
  ArrowUpRight, 
  ChevronRight, 
  Sun, 
  Cloud, 
  Droplets
} from "lucide-react";

export default function Home({ userRole }) {
  const [location, setLocation] = useState("Fetching location...");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [weatherData, setWeatherData] = useState({
    temp: "28°C",
    condition: "Sunny",
    humidity: "65%"
  });
  const [activeTab, setActiveTab] = useState("prices");

  // Hardcoded crop price data
  const cropPrices = [
    { name: "Wheat", price: "₹2200/quintal", trend: "up", change: "+2.5%" },
    { name: "Rice", price: "₹2800/quintal", trend: "up", change: "+1.8%" },
    { name: "Maize", price: "₹1900/quintal", trend: "down", change: "-0.7%" },
    { name: "Sugarcane", price: "₹3200/ton", trend: "up", change: "+3.2%" },
    { name: "Tomato", price: "₹25/kg", trend: "up", change: "+5.1%" },
    { name: "Potato", price: "₹18/kg", trend: "down", change: "-1.2%" },
    { name: "Onion", price: "₹35/kg", trend: "up", change: "+8.3%" },
    { name: "Garlic", price: "₹120/kg", trend: "up", change: "+2.0%" },
    { name: "Carrot", price: "₹30/kg", trend: "down", change: "-0.5%" },
    { name: "Cabbage", price: "₹20/kg", trend: "down", change: "-1.8%" },
    { name: "Cauliflower", price: "₹25/kg", trend: "up", change: "+1.5%" },
    { name: "Green Peas", price: "₹50/kg", trend: "up", change: "+3.7%" },
    { name: "Chili", price: "₹100/kg", trend: "up", change: "+4.2%" },
    { name: "Coriander", price: "₹40/kg", trend: "down", change: "-0.9%" },
    { name: "Ginger", price: "₹90/kg", trend: "up", change: "+2.8%" },
    { name: "Turmeric", price: "₹80/kg", trend: "up", change: "+1.3%" },
    { name: "Soybean", price: "₹4000/quintal", trend: "up", change: "+2.1%" },
    { name: "Groundnut", price: "₹5200/quintal", trend: "up", change: "+3.5%" },
    { name: "Cotton", price: "₹6200/quintal", trend: "down", change: "-0.8%" },
    { name: "Mustard", price: "₹5000/quintal", trend: "up", change: "+1.9%" },
  ];

  // Recent activity data
  const recentActivity = [
    { 
      type: "order", 
      title: "New order received", 
      details: "2kg Tomatoes • ₹160", 
      time: "2h ago", 
      icon: <ShoppingCart className="w-5 h-5 text-white" />,
      bgColor: "bg-green-500"
    },
    { 
      type: "price", 
      title: "Price alert", 
      details: "Onion prices up by 8.3%", 
      time: "4h ago", 
      icon: <TrendingUp className="w-5 h-5 text-white" />,
      bgColor: "bg-blue-500"
    },
    { 
      type: "weather", 
      title: "Weather update", 
      details: "Rain expected tomorrow", 
      time: "6h ago", 
      icon: <Cloud className="w-5 h-5 text-white" />,
      bgColor: "bg-purple-500"
    }
  ];

  // Function to filter crops based on search query
  useEffect(() => {
    const filtered = cropPrices.filter((crop) =>
      crop.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCrops(filtered);
  }, [searchQuery]);

  // Function to fetch user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();

            if (data.address) {
              setLocation(`${data.address.city || data.address.town || data.address.village || data.address.county}, ${data.address.country}`);
            } else {
              setLocation(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
            }
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocation(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation("Location unavailable");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  // Get current date and time
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-full mx-auto p-4 space-y-6">
    

      {/* Welcome Banner with Weather */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              Welcome back, {userRole === "admin" ? "Admin" : "Farmer"}!
            </h2>
            <p className="opacity-90">{currentDate}</p>
            <div className="flex items-center mt-4">
              <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium flex items-center shadow-md hover:bg-green-50 transition-colors">
                Market Dashboard
                <ArrowUpRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl flex items-center space-x-6">
            <div className="text-center">
              <Sun className="w-8 h-8 mx-auto text-yellow-300" />
              <p className="text-xl font-bold mt-1">{weatherData.temp}</p>
              <p className="text-sm opacity-90">{weatherData.condition}</p>
            </div>
            <div className="text-center">
              <Droplets className="w-6 h-6 mx-auto text-blue-200" />
              <p className="text-lg font-bold mt-1">{weatherData.humidity}</p>
              <p className="text-sm opacity-90">Humidity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="mt-3 text-2xl font-bold">₹15,240</p>
          <p className="text-gray-600 text-sm">Today's Sales</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <Clock className="w-6 h-6 text-blue-500" />
            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Active</span>
          </div>
          <p className="mt-3 text-2xl font-bold">8</p>
          <p className="text-gray-600 text-sm">Pending Orders</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <BarChart3 className="w-6 h-6 text-purple-500" />
            <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">+5</span>
          </div>
          <p className="mt-3 text-2xl font-bold">24</p>
          <p className="text-gray-600 text-sm">Market Listings</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <Calendar className="w-6 h-6 text-amber-500" />
            <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">Today</span>
          </div>
          <p className="mt-3 text-2xl font-bold">3</p>
          <p className="text-gray-600 text-sm">Scheduled Pickups</p>
        </div>
      </div>

      {/* Trending Crops Section */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800 text-lg">Trending Crops</h3>
          <button className="text-green-600 text-sm font-medium flex items-center">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {["Wheat", "Rice", "Maize", "Tomato", "Sugarcane"].map((crop, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-green-50 to-emerald-100 text-green-700 px-5 py-3 rounded-xl text-sm font-medium border border-green-200 hover:shadow-md transition-shadow cursor-pointer flex-shrink-0"
            >
              {crop}
            </div>
          ))}
        </div>
      </div>

      {/* Crop Price Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 text-lg">Market Insights</h3>
            <div className="flex space-x-2">
              <button 
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${activeTab === 'prices' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('prices')}
              >
                Prices
              </button>
              <button 
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${activeTab === 'demand' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('demand')}
              >
                Demand
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Search crop..."
              className="w-full border border-gray-200 rounded-xl p-3 pl-11 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Price Grid */}
        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredCrops.slice(0, 8).map((crop, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-100 p-4 rounded-xl hover:shadow-md transition-all duration-300 hover:border-green-200"
              >
                <div className="flex justify-between items-start">
                  <p className="font-medium text-gray-800">{crop.name}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${crop.trend === 'up' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                    {crop.change}
                  </span>
                </div>
                <p className="text-lg font-bold mt-2 text-gray-900">{crop.price}</p>
                <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${crop.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`} 
                    style={{ width: `${Math.random() * 50 + 50}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredCrops.length > 8 && (
            <div className="mt-4 text-center">
              <button className="text-green-600 font-medium hover:text-green-700 transition-colors">
                Show More Crops
              </button>
            </div>
          )}
          
          {filteredCrops.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No crops found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 text-lg">Recent Activity</h3>
            <button className="text-green-600 text-sm font-medium">View All</button>
          </div>
        </div>
        <div className="divide-y">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-4 flex items-center hover:bg-gray-50 transition-colors">
              <div className={`w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center shadow-sm`}>
                {activity.icon}
              </div>
              <div className="ml-4 flex-1">
                <p className="font-medium text-gray-800">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.details}</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">{activity.time}</span>
                <button className="block text-green-600 text-xs mt-1">Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800 text-lg">Upcoming Events</h3>
          <button className="text-green-600 text-sm font-medium">View Calendar</button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center shadow-sm">
              <span className="text-blue-600 text-xs font-medium">JUN</span>
              <span className="text-gray-800 font-bold">15</span>
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-800">Farmer's Market</p>
              <p className="text-sm text-gray-600">9:00 AM - 2:00 PM • City Center</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
            <div className="w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center shadow-sm">
              <span className="text-amber-600 text-xs font-medium">JUN</span>
              <span className="text-gray-800 font-bold">18</span>
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-800">Agricultural Workshop</p>
              <p className="text-sm text-gray-600">10:30 AM - 12:30 PM • Community Hall</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}