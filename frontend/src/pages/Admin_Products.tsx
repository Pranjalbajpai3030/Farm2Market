import React, { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  Filter,
  Home,
  Popcorn,
  ShoppingCart,
  Users,
  ChevronDown,
  X,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  product_id: number;
  product_name: string;
  description: string;
  category: string;
  price: string;
  unit: string;
  amount: string;
  image_url: string;
  created_at: string;
  seller_id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoader(true);
      setError("");

      const token = localStorage.getItem("jwtToken");

      try {
        const response = await fetch(
          "https://farm2market-pearl.vercel.app/api/admin/get-all-products",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products. Try logging in again.");
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred while fetching products.");
        }
      } finally {
        setLoader(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = (productId: number) => {
    console.log("Delete product:", productId);
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
                  to="/admin/products"
                  className="flex items-center p-2 text-gray-700 bg-green-100 rounded-lg"
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">Products</h1>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={16} className="mr-2" />
                <span>Filter</span>
                <ChevronDown size={16} className="ml-2" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
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

          {/* Products Table */}
          {!loader && !error && (
            <div className="bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seller
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.product_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.image_url}
                            alt={product.product_name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.product_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{product.price}/{product.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.first_name} {product.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(product.product_id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
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

export default AdminProducts;
