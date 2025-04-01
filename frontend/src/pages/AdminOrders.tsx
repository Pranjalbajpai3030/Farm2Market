import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  ShoppingCart,
  Users,
  Settings,
  Bell,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Download,
  MoreVertical,
  Package,
  CreditCard,
  Truck,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  order_id: number;
  buyer_first_name: string;
  buyer_last_name: string;
  buyer_email: string;
  total_amount: string;
  payment_status: "Paid" | "Pending" | "Failed";
  transaction_id: string | null;
  order_timestamp: string;
}

type TabType = "details" | "items" | "shipping" | "payment";

const AdminOrders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [editingStatus, setEditingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] =
    useState<Order["payment_status"]>("Pending");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const getStatusColor = (status: Order["payment_status"]) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoader(true);
      setError("");

      const token = localStorage.getItem("jwtToken");

      try {
        const response = await fetch(
          "https://farm2market-pearl.vercel.app/api/admin/get-all-orders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders. Try logging in again.");
        }

        const data = await response.json();
        setOrders(data.orders);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred while fetching orders.");
        }
      } finally {
        setLoader(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setCurrentStatus(order.payment_status);
    setActiveTab("details");
    setEditingStatus(false);
  };

  const handleStatusUpdate = () => {
    if (selectedOrder) {
      setSelectedOrder({ ...selectedOrder, payment_status: currentStatus });
      setEditingStatus(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <h2
              className={`text-xl font-bold text-green-800 ${
                !sidebarOpen && "hidden"
              }`}
            >
              Admin Panel
            </h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-green-100 rounded-lg"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center p-2 text-gray-700 hover:bg-green-100 rounded-lg"
                >
                  <Home size={20} />
                  {sidebarOpen && <span className="ml-3">Dashboard</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/orders"
                  className="flex items-center p-2 text-gray-700 bg-green-100 rounded-lg"
                >
                  <ShoppingCart size={20} />
                  {sidebarOpen && <span className="ml-3">Orders</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/customers"
                  className="flex items-center p-2 text-gray-700 hover:bg-green-100 rounded-lg"
                >
                  <Users size={20} />
                  {sidebarOpen && <span className="ml-3">Customers</span>}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center flex-1">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-700">Admin User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={16} className="mr-2" />
                <span>Filter</span>
                <ChevronDown size={16} className="ml-2" />
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Export Orders
              </button>
            </div>
          </div>

          {/* Loader */}
          {loader && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Orders Table */}
          {!loader && !error && (
            <div className="bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr
                      key={order.order_id}
                      className="hover:bg-gray-50"
                      onClick={() => handleOrderSelect(order)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.order_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.buyer_first_name} {order.buyer_last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.order_timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{order.total_amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            order.payment_status
                          )}`}
                        >
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-green-600 hover:text-green-900">
                            <Eye size={18} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Download size={18} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminOrders;
