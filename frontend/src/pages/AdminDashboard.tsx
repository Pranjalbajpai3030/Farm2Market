import React from "react";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  LineChart,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
const Dashboard = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "$54,239.00",
      change: "+12.5%",
      increasing: true,
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: "1,429",
      change: "+8.2%",
      increasing: true,
      icon: ShoppingBag,
    },
    {
      title: "Total Customers",
      value: "3,642",
      change: "+5.7%",
      increasing: true,
      icon: Users,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-0.8%",
      increasing: false,
      icon: TrendingUp,
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      amount: "$299.99",
      status: "completed",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      amount: "$159.50",
      status: "pending",
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      amount: "$499.99",
      status: "processing",
    },
  ];

  const topProducts = [
    { name: "Premium Headphones", sales: 245, revenue: "$48,756" },
    { name: "Wireless Charger", sales: 187, revenue: "$9,322" },
    { name: "Smart Watch", sales: 156, revenue: "$24,927" },
    { name: "4K Monitor", sales: 124, revenue: "$49,599" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Navbar */}
      <nav className="bg-white p-2 rounded-lg shadow-sm mb-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-green-600">Farm2Market</h1>
        <div className="flex space-x-6">
          <Link
            to="/admin/products"
            className="text-gray-700 hover:text-green-600 transition-colors font-medium"
          >
            Admin Product
          </Link>
          <Link
            to="/admin/orders"
            className="text-gray-700 hover:text-green-600 transition-colors font-medium"
          >
            Admin Order
          </Link>
          <Link
            to="/admin/customers"
            className="text-gray-700 hover:text-green-600 transition-colors font-medium"
          >
            Admin Customer
          </Link>
        </div>
      </nav>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-green-100 rounded-lg">
                <stat.icon className="h-6 w-6 text-green-600" />
              </div>
              <span
                className={`flex items-center text-sm ${
                  stat.increasing ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change}
                {stat.increasing ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
              </span>
            </div>
            <h3 className="text-2xl font-bold mt-4">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <button className="text-gray-500 hover:text-gray-700">
              <BarChart2 size={20} />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500">Revenue Chart Placeholder</p>
          </div>
        </div>

        {/* Sales Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Sales Trends</h2>
            <button className="text-gray-500 hover:text-gray-700">
              <LineChart size={20} />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500">Sales Chart Placeholder</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <button className="text-sm text-green-600 hover:text-green-700">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white rounded-lg">
                    <Package className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-medium">{order.amount}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Top Products</h2>
            <button className="text-sm text-green-600 hover:text-green-700">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white rounded-lg">
                    <ShoppingBag className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.sales} sales
                    </p>
                  </div>
                </div>
                <span className="font-medium">{product.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
