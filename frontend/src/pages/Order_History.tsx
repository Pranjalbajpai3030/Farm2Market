import React, { useState, useEffect } from "react";
import {
  Package,
  ChevronRight,
  RefreshCcw,
  X,
  Truck,
  Calendar,
  CreditCard,
  MapPin,
  Loader2,
} from "lucide-react";

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
  total_price: number;
}

interface Order {
  order_id: number;
  total_amount: number;
  payment_status: string;
  transaction_id: string;
  order_timestamp: string;
  payment_timestamp: string;
  buyer_first_name: string;
  buyer_last_name: string;
  buyer_email: string;
  items: OrderItem[];
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("jwtToken");

      if (!token) {
        setError("You are not logged in. Please log in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://farm2market-pearl.vercel.app/api/farmer/orders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch orders.");
        }

        const data = await response.json();

        // Group items by order_id
        const groupedOrders: { [key: number]: Order } = {};
        data.orders.forEach((item: any) => {
          if (!groupedOrders[item.order_id]) {
            groupedOrders[item.order_id] = {
              order_id: item.order_id,
              total_amount: parseFloat(item.total_amount),
              payment_status: item.payment_status,
              transaction_id: item.transaction_id,
              order_timestamp: item.order_timestamp,
              payment_timestamp: item.payment_timestamp,
              buyer_first_name: item.buyer_first_name,
              buyer_last_name: item.buyer_last_name,
              buyer_email: item.buyer_email,
              items: [],
            };
          }
          groupedOrders[item.order_id].items.push({
            product_name: item.product_name,
            quantity: parseFloat(item.quantity),
            price: parseFloat(item.price),
            total_price: parseFloat(item.total_price),
          });
        });

        setOrders(Object.values(groupedOrders));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-2 mb-8">
          <Package className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
        </div>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center text-gray-600">
            <p>No orders found. Start selling your products today!</p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Order #{order.order_id}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {new Date(order.order_timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <RefreshCcw className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          {order.payment_status}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2 text-green-600 hover:text-green-700 px-4 py-2 rounded-lg hover:bg-green-50"
                      >
                        View Details
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">
                            {item.product_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm font-medium text-green-600">
                            ₹{item.total_price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">Total</span>
                      <span className="font-medium text-green-600">
                        ₹{order.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSelectedOrder(null)}
            />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Order Details
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Order Summary */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">
                        Order #{selectedOrder.order_id}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedOrder.payment_status === "Paid"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {selectedOrder.payment_status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Ordered on{" "}
                        {new Date(
                          selectedOrder.order_timestamp
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Buyer Information */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-800">
                        Buyer Information
                      </span>
                    </div>
                    <p className="ml-7 text-gray-600">
                      {selectedOrder.buyer_first_name}{" "}
                      {selectedOrder.buyer_last_name} (
                      {selectedOrder.buyer_email})
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800">Order Items</h3>
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">
                            {item.product_name}
                          </h4>
                          <p className="text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                          <p className="font-medium text-green-600">
                            ₹{item.total_price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">
                        Total
                      </span>
                      <span className="text-lg font-semibold text-green-600">
                        ₹{selectedOrder.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
