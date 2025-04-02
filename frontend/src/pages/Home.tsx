import React, { useEffect, useState } from "react";
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
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HomeProps {
  userRole: "admin" | "farmer";
}

interface Crop {
  name: string;
  price: string;
  trend: "up" | "down";
  change: string;
  recommended_selling_price: string;
  govt_price: string;
  market_price: string;
  profitability: "High" | "Medium" | "Low";
}

export default function Home({ userRole }: HomeProps) {
  const [location, setLocation] = useState("Fetching location...");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);
  const [cropPrices, setCropPrices] = useState<Crop[]>([]);
  const [loadingCropPrices, setLoadingCropPrices] = useState(false);
  const [weatherData, setWeatherData] = useState({
    temp: "Loading...",
    condition: "Loading...",
    humidity: "Loading...",
    lastUpdated: null as Date | null,
  });
  const [activeTab, setActiveTab] = useState<"prices" | "demand">("prices");
  const [currentIndex, setCurrentIndex] = useState(0); // For sliding window
  const cardsPerPage = 3; // Number of cards per slide

  const [recentActivity, setRecentActivity] = useState([
    {
      type: "order",
      title: "New Order Received",
      details: "2kg Tomatoes • ₹160",
      timestamp: new Date(Date.now() - 7200000),
      icon: <ShoppingCart className="w-5 h-5 text-white" />,
      bgColor: "bg-green-500",
    },
    {
      type: "price",
      title: "Price Alert",
      details: "Onion prices up by 8.3%",
      timestamp: new Date(Date.now() - 14400000),
      icon: <TrendingUp className="w-5 h-5 text-white" />,
      bgColor: "bg-blue-500",
    },
    {
      type: "weather",
      title: "Weather Update",
      details: "Loading forecast...",
      timestamp: new Date(),
      icon: <Cloud className="w-5 h-5 text-white" />,
      bgColor: "bg-purple-500",
    },
  ]);

  const WEATHER_API_KEY = "48ceb3e2568f56c11d131ba71baaeeb9";

  const getRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );
      const currentData = await currentResponse.json();
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );
      const forecastData = await forecastResponse.json();

      const tomorrowForecast = forecastData.list.find((item: any) => {
        const forecastTime = new Date(item.dt * 1000);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);
        return forecastTime > tomorrow;
      });

      const newWeatherData = {
        temp: `${Math.round(currentData.main.temp)}°C`,
        condition: currentData.weather[0].main,
        humidity: `${currentData.main.humidity}%`,
        lastUpdated: new Date(),
      };
      setWeatherData(newWeatherData);

      if (tomorrowForecast) {
        setRecentActivity((prev) => {
          const newActivity = [...prev];
          const weatherIndex = newActivity.findIndex((item) => item.type === "weather");
          newActivity[weatherIndex] = {
            ...newActivity[weatherIndex],
            details: `Tomorrow: ${Math.round(tomorrowForecast.main.temp)}°C, ${tomorrowForecast.weather[0].main}`,
            timestamp: new Date(),
          };
          return newActivity;
        });
      }
    } catch (error) {
      console.error("[Weather] Error:", error);
      setWeatherData({ temp: "N/A", condition: "Error", humidity: "N/A", lastUpdated: new Date() });
    }
  };

  const fetchCropPrices = async (lat: number, lon: number) => {
    setLoadingCropPrices(true);
    try {
      const response = await fetch(
        "https://farm2market-pearl.vercel.app/api/get-crop-prices",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude: lat, longitude: lon }),
        }
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setCropPrices(data);
        setFilteredCrops(data);
      } else {
        setCropPrices([]);
        setFilteredCrops([]);
      }
    } catch (error) {
      console.error("Error fetching crop prices:", error);
      setCropPrices([]);
      setFilteredCrops([]);
    } finally {
      setLoadingCropPrices(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchCropPrices(latitude, longitude);
          await fetchWeatherData(latitude, longitude);

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const locationName = data.address
            ? `${data.address.city || data.address.town || data.address.village || data.address.county}, ${data.address.country}`
            : `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`;
          setLocation(locationName);
        },
        () => {
          setLocation("Location unavailable");
          setWeatherData({ temp: "N/A", condition: "Error", humidity: "N/A", lastUpdated: new Date() });
        }
      );
    }

    const refreshInterval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) =>
          fetchWeatherData(position.coords.latitude, position.coords.longitude)
        );
      }
    }, 900000);

    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    const filtered = cropPrices.filter((crop) =>
      crop.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCrops(filtered);
    setCurrentIndex(0); // Reset to first slide when filtering
  }, [searchQuery, cropPrices]);

  const WeatherIcon = () => {
    const condition = weatherData.condition.toLowerCase();
    return condition.includes("cloud") ? (
      <Cloud className="w-10 h-10 text-gray-200" />
    ) : condition.includes("rain") ? (
      <Droplets className="w-10 h-10 text-blue-300" />
    ) : (
      <Sun className="w-10 h-10 text-yellow-400" />
    );
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const totalPages = Math.ceil(filteredCrops.length / cardsPerPage);
  const visibleCrops = filteredCrops.slice(
    currentIndex * cardsPerPage,
    (currentIndex + 1) * cardsPerPage
  );

  const handleNext = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
        className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white shadow-xl mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Welcome, {userRole === "admin" ? "Admin" : "Farmer"}!
            </h2>
            <p className="text-sm opacity-90 flex items-center gap-2 justify-center md:justify-start">
              <MapPin className="w-4 h-4" /> {location}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-green-700 px-5 py-2 rounded-full font-medium shadow-md hover:bg-green-50 transition-colors flex items-center gap-2"
            >
              Market Dashboard <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="bg-white/20 backdrop-blur-md p-5 rounded-xl flex items-center gap-6">
            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
              <WeatherIcon />
              <p className="text-2xl font-bold mt-2">{weatherData.temp}</p>
              <p className="text-sm opacity-90">{weatherData.condition}</p>
            </motion.div>
            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
              <Droplets className="w-6 h-6 mx-auto text-blue-200" />
              <p className="text-lg font-bold mt-2">{weatherData.humidity}</p>
              <p className="text-xs opacity-75">Humidity</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
      >
        {[
          { icon: TrendingUp, value: "₹15,240", label: "Today's Sales", color: "text-green-500", badge: "+12%", badgeColor: "bg-green-100 text-green-600" },
          { icon: Clock, value: "8", label: "Pending Orders", color: "text-blue-500", badge: "Active", badgeColor: "bg-blue-100 text-blue-600" },
          { icon: BarChart3, value: "24", label: "Market Listings", color: "text-purple-500", badge: "+5", badgeColor: "bg-purple-100 text-purple-600" },
          { icon: Calendar, value: "3", label: "Scheduled Pickups", color: "text-amber-500", badge: "Today", badgeColor: "bg-amber-100 text-amber-600" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.badgeColor}`}>
                {stat.badge}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Trending Crops */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white rounded-2xl shadow-md p-6 mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Trending Crops</h3>
          <motion.button
            whileHover={{ x: 5 }}
            className="text-green-600 text-sm font-medium flex items-center"
          >
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </motion.button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
          {["Wheat", "Rice", "Maize", "Tomato", "Sugarcane"].map((crop, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-green-50 to-emerald-100 text-green-700 px-5 py-3 rounded-xl font-medium border border-green-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex-shrink-0"
            >
              {crop}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Market Insights with Sliding Window */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-white rounded-2xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Market Insights</h3>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === "prices" ? "bg-white text-green-700 shadow-sm" : "text-gray-600"}`}
                onClick={() => setActiveTab("prices")}
              >
                Prices
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === "demand" ? "bg-white text-green-700 shadow-sm" : "text-gray-600"}`}
                onClick={() => setActiveTab("demand")}
              >
                Demand
              </motion.button>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} className="relative">
            <input
              type="text"
              placeholder="Search crops..."
              className="w-full bg-white/80 backdrop-blur-md border border-gray-200 rounded-full p-3 pl-12 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </motion.div>
        </div>
        <div className="p-6">
          {loadingCropPrices ? (
            <div className="flex justify-center items-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="p-2 rounded-full bg-white/80 backdrop-blur-md shadow-md disabled:opacity-50 hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNext}
                    disabled={currentIndex === totalPages - 1}
                    className="p-2 rounded-full bg-white/80 backdrop-blur-md shadow-md disabled:opacity-50 hover:bg-gray-100"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </motion.button>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {currentIndex + 1} / {totalPages}
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {visibleCrops.map((crop, index) => (
                    <motion.div
                      key={index}
                      variants={cardVariants}
                      whileHover={{ y: -5 }}
                      className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-lg hover:border-green-200 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-gray-800">{crop.name}</p>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${crop.trend === "up" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}
                        >
                          {crop.change}
                        </span>
                      </div>
                      <div className="mt-3 space-y-1">
                        <p className="text-sm text-gray-600">
                          Govt: <span className="font-medium text-gray-800">{crop.govt_price}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Market: <span className="font-medium text-gray-800">{crop.market_price}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Recommended: <span className="font-medium text-green-600">{crop.recommended_selling_price}</span>
                        </p>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${crop.profitability === "High" ? "bg-green-100 text-green-600" : crop.profitability === "Medium" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"}`}
                        >
                          {crop.profitability}
                        </span>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`w-3 h-3 rounded-full ${crop.trend === "up" ? "bg-green-500" : "bg-red-500"}`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
              {filteredCrops.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-gray-500"
                >
                  No crops found matching "{searchQuery}"
                </motion.div>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="bg-white rounded-2xl shadow-md overflow-hidden mt-8"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
            <motion.button whileHover={{ x: 5 }} className="text-green-600 text-sm font-medium">
              View All
            </motion.button>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ backgroundColor: "#f9fafb" }}
              className="p-5 flex items-center transition-colors"
            >
              <div className={`w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center shadow-md`}>
                {activity.icon}
              </div>
              <div className="ml-4 flex-1">
                <p className="font-medium text-gray-800">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.details}</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">{getRelativeTime(activity.timestamp)}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="block text-green-600 text-xs mt-1"
                >
                  Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}