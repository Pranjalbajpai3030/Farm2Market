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
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20";
      case "pending":
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20";
      case "processing":
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20";
      default:
        return "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/95">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-emerald-600">Farm2Market</h1>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex md:space-x-8">
              <Link
                to="/admin/products"
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
              >
                Admin Product
              </Link>
              <Link
                to="/admin/orders"
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
              >
                Admin Order
              </Link>
              <Link
                to="/admin/customers"
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
              >
                Admin Customer
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden border-b border-gray-100`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/admin/products"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
            >
              Admin Product
            </Link>
            <Link
              to="/admin/orders"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
            >
              Admin Order
            </Link>
            <Link
              to="/admin/customers"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
            >
              Admin Customer
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <stat.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <span
                  className={`flex items-center text-sm font-medium ${
                    stat.increasing ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                  {stat.increasing ? (
                    <ArrowUpRight size={16} className="ml-1" />
                  ) : (
                    <ArrowDownRight size={16} className="ml-1" />
                  )}
                </span>
              </div>
              <h3 className="text-2xl font-bold mt-4">{stat.value}</h3>
              <p className="text-gray-600 text-sm mt-1">{stat.title}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Revenue Overview</h2>
              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                <BarChart2 size={20} />
              </button>
            </div>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-500">Revenue Chart Placeholder</p>
            </div>
          </div>

          {/* Sales Trends */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Sales Trends</h2>
              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                <LineChart size={20} />
              </button>
            </div>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-500">Sales Chart Placeholder</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
              <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-white rounded-xl">
                      <Package className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-4">
                    <span className="font-medium text-gray-900">{order.amount}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Top Products</h2>
              <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-white rounded-xl">
                      <ShoppingBag className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-900">{product.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;