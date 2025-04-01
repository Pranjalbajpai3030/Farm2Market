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
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
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
          phone: "N/A", // Assuming phone is not provided in the response
          location: "N/A", // Assuming location is not provided in the response
          joinDate: new Date(customer.created_at).toLocaleDateString(),
          orders: 0, // Assuming orders count is not provided in the response
          spent: 0, // Assuming spent amount is not provided in the response
          status: customer.user_type === "buyer" ? "active" : "inactive", // Example logic for status
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
                  to="/admin/products"
                  className="flex items-center p-2 text-gray-700 hover:bg-green-100 rounded-lg"
                >
                  <Popcorn size={20} />
                  {sidebarOpen && <span className="ml-3">Products</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/orders"
                  className="flex items-center p-2 text-gray-700 hover:bg-green-100 rounded-lg"
                >
                  <ShoppingCart size={20} />
                  {sidebarOpen && <span className="ml-3">Orders</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/customers"
                  className="flex items-center p-2 text-gray-700 bg-green-100 rounded-lg"
                >
                  <Users size={20} />
                  {sidebarOpen && <span className="ml-3">Customers</span>}
                </Link>
              </li>
            </ul>
          </nav>
          {/* Logout Option */}
          <div className="p-4 mt-auto">
            <button
              onClick={() => {
                localStorage.removeItem("jwtToken"); // Clear the token
                window.location.href = "/login"; // Redirect to login page
              }}
              className="flex items-center w-full p-2 text-gray-700 hover:bg-red-100 rounded-lg"
            >
              <X size={20} className="text-red-600" />
              {sidebarOpen && <span className="ml-3 text-red-600">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={16} className="mr-2" />
                <span>Filter</span>
                <ChevronDown size={16} className="ml-2" />
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Export Customers
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
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
          {/* Customers Table */}
          {!loader && !error && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spent
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
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${customer.spent.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
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
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          View Details
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Customer Details
                    </h2>
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      ×
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                          <span className="text-2xl text-gray-600 font-medium">
                            {selectedCustomer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium">
                          {selectedCustomer.name}
                        </h3>
                        <p className="text-gray-500">{selectedCustomer.id}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-gray-500">
                          <Mail size={16} className="mr-2" />
                          {selectedCustomer.email}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Phone size={16} className="mr-2" />
                          {selectedCustomer.phone}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <MapPin size={16} className="mr-2" />
                          {selectedCustomer.location}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Calendar size={16} className="mr-2" />
                          Joined {selectedCustomer.joinDate}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                          Overview
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-2xl font-bold">
                              {selectedCustomer.orders}
                            </p>
                            <p className="text-sm text-gray-500">
                              Total Orders
                            </p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">
                              ${selectedCustomer.spent.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">Total Spent</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                          Status
                        </h4>
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            selectedCustomer.status
                          )}`}
                        >
                          {selectedCustomer.status.charAt(0).toUpperCase() +
                            selectedCustomer.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
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
