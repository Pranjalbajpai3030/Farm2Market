import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  amount: number;
  producer: string;
  image_url: string;
  rating: number;
};

const ProductCard: React.FC<{
  product: Product;
  onAddToCart: (id: number) => void;
}> = ({ product, onAddToCart }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {/* Product Card */}
      <div
        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-40 object-cover"
        />
        <div className="p-4">
          <h3 className="font-medium text-lg">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.producer}</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-semibold">
              ₹{product.price}/{product.unit}
            </p>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27l6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l5.46 4.73L6.82 21z" />
              </svg>
              <span className="ml-1 text-sm">{product.rating}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex justify-between items-center">
            <button
              className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product.id);
              }}
            >
              Add to Cart
            </button>
            <button
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                alert(`Contact Farmer: ${product.producer}`);
              }}
            >
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {showDetails && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowDetails(false)}
            >
              ✕
            </button>
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="text-lg font-bold mb-2">{product.name}</h2>
            <p className="text-sm text-gray-600 mb-4">{product.description}</p>
            <p className="text-sm">
              <strong>Farmer:</strong> {product.producer}
            </p>
            <p className="text-sm">
              <strong>Price:</strong> ₹{product.price}/{product.unit}
            </p>
            <p className="text-sm">
              <strong>Stock:</strong> {product.amount} {product.unit}
            </p>
            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
                onClick={() => {
                  onAddToCart(product.id);
                  setShowDetails(false);
                }}
              >
                Add to Cart
              </button>
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg"
                onClick={() => setShowDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Market: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("jwtToken");
      const category = ""; // Set category if needed

      try {
        const response = await fetch(
          "https://farm2market-pearl.vercel.app/api/get-products",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              category: category,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
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
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (productId: number) => {
    alert(`Product with ID ${productId} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4">
      <div className="container mx-auto px-8">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Market;
