import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

const Cart = () => {
  const navigate = useNavigate();
  interface CartItem {
    cart_id: number;
    product_name: string;
    farmer_name: string;
    price: number;
    unit: string;
    total_price: string;
    quantity: number;
    image_url: string;
  }

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("jwtToken");

      try {
        const response = await fetch(
          "https://farm2market-pearl.vercel.app/api/get-cart",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 404) {
          toast.error("Cart is empty");
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }

        const data = await response.json();
        console.log(data);
        setCartItems(data.cart_items);
        // Extract required fields and store in local storage
        const requiredItems = data.cart_items.map((item: any) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        }));
        localStorage.setItem(
          "cartItemsForPayment",
          JSON.stringify({ cartItems: requiredItems })
        );
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred while fetching cart items.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveItem = (cartId: number): void => {
    // Implement remove item functionality
    toast.success("Item removed from cart");
  };

  const handleIncreaseQuantity = (cartId: number): void => {
    // Implement increase quantity functionality
    alert(`Increase quantity for cart ID ${cartId}`);
  };

  const handleDecreaseQuantity = (cartId: number): void => {
    // Implement decrease quantity functionality
    alert(`Decrease quantity for cart ID ${cartId}`);
  };

  const getTotalAmount = () => {
    return cartItems
      .reduce((total, item) => total + parseFloat(item.total_price), 0)
      .toFixed(2);
  };

  const handleCheckout = () => {
    setShowModal(true);
    setTimeout(() => {
      navigate("/payment");
    }, 2000);
  };

  const shippingCost = 9.99;
  const subtotal = parseFloat(getTotalAmount());
  const total = (subtotal + shippingCost).toFixed(2);
  localStorage.setItem("totalPrice", JSON.stringify(total));

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center gap-2 mb-8">
          <ShoppingCart className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
        </div>
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
        <div className="grid grid-cols-1 gap-6">
          {cartItems.map((item) => (
            <div
              key={item.cart_id}
              className="bg-white rounded-lg shadow-md p-4 flex items-center"
            >
              <img
                src={item.image_url}
                alt={item.product_name}
                className="w-24 h-24 object-cover rounded-lg mr-4"
              />
              <div className="flex-1">
                <h2 className="text-lg font-bold">{item.product_name}</h2>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">Farmer:</span>{" "}
                  <span className="text-green-600">{item.farmer_name}</span>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">Price:</span>{" "}
                  <span className="text-green-600">
                    {" "}
                    ₹{item.price} per {item.unit}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">Total:</span>{" "}
                  <span className="text-green-600">₹{item.total_price}</span>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">Quantity:</span>{" "}
                  <span className="text-green-600">{item.quantity}</span>
                </p>
              </div>
              <button
                className="ml-4 px-3 py-2 bg-red-500 text-white rounded-lg"
                onClick={() => handleRemoveItem(item.cart_id)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 mt-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-green-600">₹{subtotal}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Shipping</span>
            <span className="text-green-600">₹{shippingCost.toFixed(2)}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between mb-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-semibold text-green-600">
              ₹{total}
            </span>
          </div>
        </div>
        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg w-full"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
      {/* Checkout Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Redirecting to Payment
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Please wait while we redirect you to the payment page...
            </p>
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
