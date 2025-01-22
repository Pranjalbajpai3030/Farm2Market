import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();

  const cartItems = [
    {
      id: 1,
      name: "Tomatoes",
      price: 199.99,
      quantity: 1,
      image: "url",
    },
    {
      id: 2,
      name: "Potatoes",
      price: 299.99,
      quantity: 1,
      image: "url",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-2 mb-8">
          <ShoppingCart className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 py-4 border-b last:border-b-0"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>
                <p className="text-green-600 font-medium">${item.price}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded ml-4">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">$499.98</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">$9.99</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-semibold text-green-600">
              $509.97
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate("/address")}
          className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
