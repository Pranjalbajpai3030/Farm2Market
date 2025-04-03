import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock fetch function - replace with your actual API call
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // Simulated API call
        const mockNotifications: Notification[] = [
          {
            id: "1",
            type: "success",
            title: "Order Placed",
            message: "Your order #1234 has been successfully placed!",
            timestamp: "2025-04-03T10:30:00Z",
            read: false,
          },
          {
            id: "2",
            type: "info",
            title: "New Message",
            message: "Farmer John has sent you a message about your order.",
            timestamp: "2025-04-03T09:15:00Z",
            read: true,
          },
          {
            id: "3",
            type: "warning",
            title: "Payment Pending",
            message: "Payment for order #1233 is still pending.",
            timestamp: "2025-04-02T14:45:00Z",
            read: false,
          },
          {
            id: "4",
            type: "error",
            title: "Delivery Failed",
            message: "Delivery attempt for order #1232 failed.",
            timestamp: "2025-04-01T16:20:00Z",
            read: true,
          },
        ];
        
        // Replace with actual API call:
        // const response = await fetch("https://farm2market-pearl.vercel.app/api/notifications", {
        //   headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
        // });
        // const data = await response.json();
        // setNotifications(data);

        setNotifications(mockNotifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    // Add API call to update notification status on the server if needed
  };

  const getIconAndColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return { icon: <CheckCircle className="w-6 h-6" />, color: "text-emerald-500" };
      case "error":
        return { icon: <XCircle className="w-6 h-6" />, color: "text-red-500" };
      case "info":
        return { icon: <Info className="w-6 h-6" />, color: "text-blue-500" };
      case "warning":
        return { icon: <AlertTriangle className="w-6 h-6" />, color: "text-yellow-500" };
      default:
        return { icon: <Bell className="w-6 h-6" />, color: "text-gray-500" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Bell className="w-8 h-8" />
              Notifications
            </h2>
            <p className="mt-2 text-emerald-100">Stay updated with Farm2Market</p>
          </div>
          <span className="bg-emerald-700 text-white px-3 py-1 rounded-full text-sm font-medium">
            {notifications.filter((n) => !n.read).length} Unread
          </span>
        </div>

        {/* Notifications List */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <svg
                className="animate-spin h-8 w-8 text-emerald-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No notifications yet</p>
              <p className="text-gray-400">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const { icon, color } = getIconAndColor(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all ${
                    notification.read
                      ? "bg-gray-50 border-gray-200"
                      : "bg-white border-emerald-200 shadow-md hover:shadow-lg"
                  } flex items-start gap-4`}
                >
                  <div className={`${color} flex-shrink-0`}>{icon}</div>
                  <div className="flex-1">
                    <h3
                      className={`font-semibold ${
                        notification.read ? "text-gray-600" : "text-gray-800"
                      }`}
                    >
                      {notification.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        notification.read ? "text-gray-500" : "text-gray-700"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Back Button */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all flex items-center justify-center gap-2"
          >
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}