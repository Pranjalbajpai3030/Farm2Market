import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Lock, CheckCircle, Loader2 } from "lucide-react";

const Payment = () => {
  const navigate = useNavigate();
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    const token = localStorage.getItem("jwtToken");
    const cartItemsForPayment = JSON.parse(
      localStorage.getItem("cartItemsForPayment") || "{}"
    );

    try {
      // Step 1: Call the /api/orders API
      const orderResponse = await fetch(
        "https://farm2market-pearl.vercel.app/api/orders",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cartItemsForPayment),
        }
      );

      if (!orderResponse.ok) {
        throw new Error("Failed to place the order. Please try again.");
      }

      const orderData = await orderResponse.json();
      const orderId = orderData.orderId; // Extract the order_id from the response
      localStorage.setItem("order_id", orderId); // Store the order_id in local storage
      // Step 2: Call the /api/pending-transactions API
      const pendingTransactionResponse = await fetch(
        "https://farm2market-pearl.vercel.app/api/pending-transactions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
            transaction_id: transactionId,
          }),
        }
      );

      if (!pendingTransactionResponse.ok) {
        throw new Error("Failed to submit the transaction. Please try again.");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/confirmation");
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-2 mb-8">
          <CreditCard className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Payment Details</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <img
              src="https://via.placeholder.com/300x300.png?text=UPI+QR+Code"
              alt="UPI QR Code"
              className="mx-auto w-64 h-64 object-cover rounded-lg shadow-md"
            />
            <p className="mt-4 text-gray-600">
              Scan the QR code above to make the payment. Once the payment is
              completed, enter the transaction ID below to confirm your order.
            </p>
          </div>
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-gray-800">
              Amount to be Paid:{" "}
              <span className="font-bold">
                {localStorage.getItem("totalPrice")}
              </span>
            </p>
          </div>
          <div className="mt-6">
            <label
              htmlFor="transactionId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Transaction ID
            </label>
            <input
              type="text"
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter your transaction ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mt-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mt-4">
              Payment successful! Redirecting to confirmation page...
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate("/address")}
              className="flex-1 px-6 py-3 border border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !transactionId}
              className={`flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors ${
                loading || !transactionId ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                "Submit Payment"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
