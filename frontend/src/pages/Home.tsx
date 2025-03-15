import React, { useEffect, useState } from 'react';
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
  Droplets,
  RefreshCw,
} from "lucide-react";

export default function Home({ userRole }) {
  const [location, setLocation] = useState("Fetching location...");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [weatherData, setWeatherData] = useState({
    temp: "Loading...",
    condition: "Loading...",
    humidity: "Loading...",
    lastUpdated: null as Date | null,
  });
  const [activeTab, setActiveTab] = useState("prices");
  const [recentActivity, setRecentActivity] = useState([
    {
      type: "order",
      title: "New order received",
      details: "2kg Tomatoes • ₹160",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      icon: <ShoppingCart className="w-5 h-5 text-white" />,
      bgColor: "bg-green-500",
    },
    {
      type: "price",
      title: "Price alert",
      details: "Onion prices up by 8.3%",
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      icon: <TrendingUp className="w-5 h-5 text-white" />,
      bgColor: "bg-blue-500",
    },
    {
      type: "weather",
      title: "Weather update",
      details: "Loading forecast...",
      timestamp: new Date(),
      icon: <Cloud className="w-5 h-5 text-white" />,
      bgColor: "bg-purple-500",
    },
  ]);

  // OpenWeather API key using Vite's environment variable syntax
  const WEATHER_API_KEY = '48ceb3e2568f56c11d131ba71baaeeb9';

  // Function to format relative time
  const getRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Function to fetch weather data
  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      console.log(`[Weather] Fetching weather data for coordinates:`, { lat, lon });
      
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );
      
      if (!currentResponse.ok) {
        throw new Error(`Weather API responded with status: ${currentResponse.status}`);
      }
      
      const currentData = await currentResponse.json();
      console.log('[Weather] Current weather data received:', currentData);
      
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );
      
      if (!forecastResponse.ok) {
        throw new Error(`Forecast API responded with status: ${forecastResponse.status}`);
      }
      
      const forecastData = await forecastResponse.json();
      console.log('[Weather] Forecast data received:', forecastData);
      
      // Get tomorrow's forecast (24 hours from now)
      const tomorrowForecast = forecastData.list.find((item: any) => {
        const forecastTime = new Date(item.dt * 1000);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0); // Noon tomorrow
        return forecastTime > tomorrow;
      });

      console.log('[Weather] Tomorrow\'s forecast:', tomorrowForecast);

      // Update weather state
      const newWeatherData = {
        temp: `${Math.round(currentData.main.temp)}°C`,
        condition: currentData.weather[0].main,
        humidity: `${currentData.main.humidity}%`,
        lastUpdated: new Date(),
      };
      
      console.log('[Weather] Updating weather state with:', newWeatherData);
      setWeatherData(newWeatherData);

      // Update recent activity with forecast
      if (tomorrowForecast) {
        setRecentActivity(prev => {
          const newActivity = [...prev];
          const weatherIndex = newActivity.findIndex(item => item.type === 'weather');
          if (weatherIndex !== -1) {
            newActivity[weatherIndex] = {
              ...newActivity[weatherIndex],
              details: `Tomorrow: ${Math.round(tomorrowForecast.main.temp)}°C, ${tomorrowForecast.weather[0].main}`,
              timestamp: new Date(),
            };
          }
          return newActivity;
        });
      }

    } catch (error) {
      console.error("[Weather] Error fetching weather data:", error);
      setWeatherData({
        temp: "N/A",
        condition: "Error",
        humidity: "N/A",
        lastUpdated: new Date(),
      });
    }
  };

  // Function to fetch user's location and weather
  useEffect(() => {
    console.log('[Geolocation] Requesting user location...');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('[Geolocation] Position received:', { latitude, longitude });

          // Fetch weather data immediately with the coordinates
          await fetchWeatherData(latitude, longitude);

          try {
            console.log('[Location] Fetching location name from coordinates...');
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            console.log('[Location] Location data received:', data);

            if (data.address) {
              const locationName = `${
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.county
              }, ${data.address.country}`;
              console.log('[Location] Setting location name:', locationName);
              setLocation(locationName);
            } else {
              const fallbackLocation = `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`;
              console.log('[Location] Using fallback location:', fallbackLocation);
              setLocation(fallbackLocation);
            }
          } catch (error) {
            console.error("[Location] Error fetching location:", error);
            setLocation(
              `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`
            );
          }
        },
        (error) => {
          console.error("[Geolocation] Error getting position:", error);
          setLocation("Location unavailable");
          setWeatherData({
            temp: "N/A",
            condition: "Error",
            humidity: "N/A",
            lastUpdated: new Date(),
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.log('[Geolocation] Geolocation not supported by browser');
      setLocation("Geolocation not supported");
      setWeatherData({
        temp: "N/A",
        condition: "Error",
        humidity: "N/A",
        lastUpdated: new Date(),
      });
    }

    // Refresh weather data every 15 minutes
    const refreshInterval = setInterval(() => {
      console.log('[Weather] Refreshing weather data...');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            await fetchWeatherData(position.coords.latitude, position.coords.longitude);
          },
          (error) => console.error("[Weather] Error refreshing weather:", error)
        );
      }
    }, 900000); // 15 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  // Get current date and time
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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

  // Function to filter crops based on search query
  useEffect(() => {
    const filtered = cropPrices.filter((crop) =>
      crop.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCrops(filtered);
  }, [searchQuery]);

  // Weather icon component based on condition
  const WeatherIcon = () => {
    const condition = weatherData.condition.toLowerCase();
    if (condition.includes('cloud')) {
      return <Cloud className="w-8 h-8 mx-auto text-gray-200" />;
    } else if (condition.includes('rain')) {
      return <Droplets className="w-8 h-8 mx-auto text-blue-200" />;
    } else {
      return <Sun className="w-8 h-8 mx-auto text-yellow-300" />;
    }
  };

  return (
    <div className="max-w-full mx-auto p-4 space-y-6">
      {/* Welcome Banner with Weather */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              Welcome, {userRole === "admin" ? "Admin" : "Farmer"}!
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
              <WeatherIcon />
              <p className="text-xl font-bold mt-1">{weatherData.temp}</p>
              <p className="text-sm opacity-90">{weatherData.condition}</p>
              {weatherData.lastUpdated && (
                <p className="text-xs opacity-75 mt-1">
                  Updated {getRelativeTime(weatherData.lastUpdated)}
                </p>
              )}
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
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold">₹15,240</p>
          <p className="text-gray-600 text-sm">Today's Sales</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <Clock className="w-6 h-6 text-blue-500" />
            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold">8</p>
          <p className="text-gray-600 text-sm">Pending Orders</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <BarChart3 className="w-6 h-6 text-purple-500" />
            <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              +5
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold">24</p>
          <p className="text-gray-600 text-sm">Market Listings</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <Calendar className="w-6 h-6 text-amber-500" />
            <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
              Today
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold">3</p>
          <p className="text-gray-600 text-sm">Scheduled Pickups</p>
        </div>
      </div>

      {/* Trending Crops Section */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800 text-lg">
            Trending Crops
          </h3>
          <button className="text-green-600 text-sm font-medium flex items-center">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {["Wheat", "Rice", "Maize", "Tomato", "Sugarcane"].map(
            (crop, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50 to-emerald-100 text-green-700 px-5 py-3 rounded-xl text-sm font-medium border border-green-200 hover:shadow-md transition-shadow cursor-pointer flex-shrink-0"
              >
                {crop}
              </div>
            )
          )}
        </div>
      </div>

      {/* Crop Price Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 text-lg">
              Market Insights
            </h3>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                  activeTab === "prices"
                    ? "bg-green-100 text-green-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("prices")}
              >
                Prices
              </button>
              <button
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                  activeTab === "demand"
                    ? "bg-green-100 text-green-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("demand")}
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
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      crop.trend === "up"
                        ? "text-green-600 bg-green-100"
                        : "text-red-600 bg-red-100"
                    }`}
                  >
                    {crop.change}
                  </span>
                </div>
                <p className="text-lg font-bold mt-2 text-gray-900">
                  {crop.price}
                </p>
                <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      crop.trend === "up" ? "bg-green-500" : "bg-red-500"
                    }`}
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
            <h3 className="font-semibold text-gray-800 text-lg">
              Recent Activity
            </h3>
            <button className="text-green-600 text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="divide-y">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="p-4 flex items-center hover:bg-gray-50 transition-colors"
            >
              <div
                className={`w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center shadow-sm`}
              >
                {activity.icon}
              </div>
              <div className="ml-4 flex-1">
                <p className="font-medium text-gray-800">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.details}</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">
                  {getRelativeTime(activity.timestamp)}
                </span>
                <button className="block text-green-600 text-xs mt-1">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800 text-lg">
            Upcoming Events
          </h3>
          <button className="text-green-600 text-sm font-medium">
            View Calendar
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center shadow-sm">
              <span className="text-blue-600 text-xs font-medium">JUN</span>
              <span className="text-gray-800 font-bold">15</span>
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-800">Farmer's Market</p>
              <p className="text-sm text-gray-600">
                9:00 AM - 2:00 PM • City Center
              </p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
            <div className="w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center shadow-sm">
              <span className="text-amber-600 text-xs font-medium">JUN</span>
              <span className="text-gray-800 font-bold">18</span>
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-800">Agricultural Workshop</p>
              <p className="text-sm text-gray-600">
                10:30 AM - 12:30 PM • Community Hall
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}