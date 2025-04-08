import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  ShoppingCart,
  Users,
  Popcorn,
  Search,
  Eye,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

interface PendingTransaction {
  id: number;
  order_id: number;
  transaction_id: string;
  submitted_at: string;
  is_verified: boolean;
}

const Admin_checkPayment = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [pendingTransactions, setPendingTransactions] = useState<
    PendingTransaction[]
  >([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<PendingTransaction | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchPendingTransactions = async () => {
    setLoader(true);
    setError("");

    const token = localStorage.getItem("jwtToken");

    try {
      const response = await fetch(
        "https://farm2market-pearl.vercel.app/api/get-pending-transactions",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch pending transactions. Try logging in again."
        );
      }

      const data = await response.json();
      setPendingTransactions(data.pendingTransactions);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while fetching pending transactions.");
      }
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchPendingTransactions();
  }, []);

  const handleVerifyPayment = async () => {
    if (!selectedTransaction) return;

    setUpdating(true);
    setError("");

    const token = localStorage.getItem("jwtToken");

    try {
      const response = await fetch(
        `https://farm2market-pearl.vercel.app/api/orders/${selectedTransaction.order_id}/payment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentStatus: "Paid",
            transactionId: selectedTransaction.transaction_id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify payment. Please try again.");
      }

      // Refresh the pending transactions list
      fetchPendingTransactions();
      setSelectedTransaction(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while verifying the payment.");
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
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
        } fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "w-64" : "lg:w-20"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <h2
              className={`text-xl font-bold text-green-800 ${
                !sidebarOpen && "lg:hidden"
              }`}
            >
              Admin Panel
            </h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-green-100 rounded-lg lg:hidden"
            >
              <X size={20} />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-green-100 rounded-lg hidden lg:block"
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
                  className="flex items-center p-2 text-gray-700 hover:bg-green-100 rounded-lg"
                >
                  <Users size={20} />
                  {sidebarOpen && <span className="ml-3">Customers</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/check-payment"
                  className="flex items-center p-2 text-gray-700 bg-green-100 rounded-lg"
                >
                  <CheckCircle size={20} />
                  {sidebarOpen && <span className="ml-3">Check Payments</span>}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 space-y-4 sm:space-y-0">
            <div className="flex items-center w-full sm:w-auto">
              <button
                onClick={() => setSidebarOpen(true)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                <Menu size={20} />
              </button>
              <div className="relative flex-1 sm:flex-initial">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Pending Transactions
          </h1>

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

          {/* Pending Transactions Table */}
          {!loader && !error && (
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted At
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-gray-50"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.transaction_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{transaction.order_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.submitted_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-green-600 hover:text-green-900">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Transaction Details Modal */}
          {selectedTransaction && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                      Transaction Details
                    </h2>
                    <button
                      onClick={() => setSelectedTransaction(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-800">
                        Transaction ID:
                      </span>{" "}
                      {selectedTransaction.transaction_id}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-800">
                        Order ID:
                      </span>{" "}
                      #{selectedTransaction.order_id}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-800">
                        Submitted At:
                      </span>{" "}
                      {new Date(
                        selectedTransaction.submitted_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={() => setSelectedTransaction(null)}
                      className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors duration-200"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleVerifyPayment}
                      disabled={updating}
                      className={`px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors duration-200 ${
                        updating ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {updating ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        "Verify Payment"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin_checkPayment;
