import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Mail,
  Phone,
  Popcorn,
  MapPin,
  Calendar,
  ShoppingCart,
  Users,
  Home,
  Menu,
  X,
  LogOut,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  orders: number;
  spent: number;
  status: "active" | "inactive";
}

const Customers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
      : "bg-gray-50 text-gray-600 ring-1 ring-gray-500/20";
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoader(true);
      setError("");

      const token = localStorage.getItem("jwtToken");

      try {
        const response = await fetch(
          "https://farm2market-pearl.vercel.app/api/admin/get-customers",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch customers. Try logging in again.");
        }

        const data = await response.json();
        const mappedCustomers = data.customers.map((customer: any) => ({
          id: customer.id.toString(),
          name: `${customer.first_name} ${customer.last_name}`,
          email: customer.email,
          phone: "N/A",
          location: "N/A",
          joinDate: new Date(customer.created_at).toLocaleDateString(),
          orders: 0,
          spent: 0,
          status: customer.user_type === "buyer" ? "active" : "inactive",
        }));

        setCustomers(mappedCustomers);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred while fetching customers.");
        }
      } finally {
        setLoader(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50/95">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-sm border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "w-64" : "lg:w-20"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <h2
              className={`text-xl font-semibold text-gray-800 ${
                !sidebarOpen && "lg:hidden"
              }`}
            >
              Admin Panel
            </h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 lg:hidden"
            >
              <X size={20} />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-50 rounded-lg hidden lg:block"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200"
                >
                  <Home size={20} className="text-gray-500" />
                  {sidebarOpen && <span className="ml-3 font-medium">Dashboard</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/products"
                  className="flex items-center p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200"
                >
                  <Popcorn size={20} className="text-gray-500" />
                  {sidebarOpen && <span className="ml-3 font-medium">Products</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/orders"
                  className="flex items-center p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200"
                >
                  <ShoppingCart size={20} className="text-gray-500" />
                  {sidebarOpen && <span className="ml-3 font-medium">Orders</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/customers"
                  className="flex items-center p-3 text-gray-600 bg-emerald-50 rounded-xl"
                >
                  <Users size={20} className="text-emerald-600" />
                  {sidebarOpen && <span className="ml-3 font-medium text-emerald-600">Customers</span>}
                </Link>
              </li>
            </ul>
          </nav>
          {/* Logout Option */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => {
                localStorage.removeItem("jwtToken");
                window.location.href = "/login";
              }}
              className="flex items-center w-full p-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors duration-200"
            >
              <LogOut size={20} />
              {sidebarOpen && <span className="ml-3 font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-2xl font-semibold text-gray-800">Customers</h1>
            </div>
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <button className="flex items-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors duration-200 shadow-sm">
                <Filter size={18} className="mr-2" />
                <span className="font-medium">Filter</span>
                <ChevronDown size={18} className="ml-2" />
              </button>
              <button className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors duration-200 font-medium shadow-sm">
                Export
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
              />
              <Search
                className="absolute left-4 top-3 text-gray-400"
                size={20}
              />
            </div>
          </div>

          {/* Loader */}
          {loader && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-600"></div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-xl">
              {error}
            </div>
          )}

          {/* Customers Table */}
          {!loader && !error && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spent
                    </th>
                    <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                              <span className="text-emerald-600 font-medium">
                                {customer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {customer.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.location}
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ${customer.spent.toFixed(2)}
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            customer.status
                          )}`}
                        >
                          {customer.status.charAt(0).toUpperCase() +
                            customer.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="text-emerald-600 hover:text-emerald-700 font-medium mr-4 transition-colors duration-200 hidden sm:inline-block"
                        >
                          View Details
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Customer Details Modal */}
          {selectedCustomer && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                      Customer Details
                    </h2>
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-6">
                      <div>
                        <div className="h-16 sm:h-20 w-16 sm:w-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                          <span className="text-xl sm:text-2xl text-emerald-600 font-medium">
                            {selectedCustomer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-medium text-gray-800">
                          {selectedCustomer.name}
                        </h3>
                        <p className="text-gray-500 mt-1">{selectedCustomer.id}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center text-gray-600">
                          <Mail size={18} className="mr-3 text-gray-400" />
                          {selectedCustomer.email}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone size={18} className="mr-3 text-gray-400" />
                          {selectedCustomer.phone}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin size={18} className="mr-3 text-gray-400" />
                          {selectedCustomer.location}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar size={18} className="mr-3 text-gray-400" />
                          Joined {selectedCustomer.joinDate}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                      <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                        <h4 className="text-sm font-medium text-gray-500 mb-4">
                          Overview
                        </h4>
                        <div className="grid grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                              {selectedCustomer.orders}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Total Orders
                            </p>
                          </div>
                          <div>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                              ${selectedCustomer.spent.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Total Spent</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-3">
                          Status
                        </h4>
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            selectedCustomer.status
                          )}`}
                        >
                          {selectedCustomer.status.charAt(0).toUpperCase() +
                            selectedCustomer.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors duration-200"
                    >
                      Close
                    </button>
                    <button className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors duration-200">
                      Edit Customer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;