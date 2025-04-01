import React, { useState, useEffect } from "react";
import {
  Package,
  Pencil,
  Trash2,
  Plus,
  DollarSign,
  Tag,
  Box,
  Layers,
  Filter,
  ChevronDown,
} from "lucide-react";

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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
    // Implement delete functionality
    console.log("Delete product:", productId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Package className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          </div>
          <div className="flex gap-4">
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

        {/* Products Grid */}
        {!loader && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.product_id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {product.product_name}
                    </h2>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {product.category}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-800">
                        ₹{product.price}/{product.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Box className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">
                        ₹{product.amount} total
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        {product.first_name} {product.last_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsEditing(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.product_id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Product Modal */}
        {selectedProduct && isEditing && (
          <div className="fixed inset-0 z-50">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => {
                setSelectedProduct(null);
                setIsEditing(false);
              }}
            />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Edit Product
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      setIsEditing(false);
                    }}
                    className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full"
                  >
                    ×
                  </button>
                </div>

                <div className="p-6">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedProduct.product_name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        defaultValue={selectedProduct.description}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            defaultValue={selectedProduct.price}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Unit
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedProduct.unit}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Image URL
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedProduct.image_url}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProduct(null);
                          setIsEditing(false);
                        }}
                        className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
