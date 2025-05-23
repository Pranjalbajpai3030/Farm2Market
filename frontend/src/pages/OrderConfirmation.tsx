import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Package } from "lucide-react";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const order_id = localStorage.getItem("order_id");
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Received!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your payment. We have received your transaction
            successfully.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-green-600" />
              <span className="font-medium">Order Id: {order_id}</span>
            </div>
            <p className="text-sm text-gray-600">
              Your payment is being verified by our admin. This process will
              take at most 2 to 3 hours. Once verified, your order will be
              processed and delivered to you shortly.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              A confirmation email will be sent to you. Please don't worry, and
              thank you for your patience!
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
