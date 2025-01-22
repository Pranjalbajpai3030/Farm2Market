import React, { useState } from 'react';
import { Package, ChevronRight, RefreshCcw, X, Truck, Calendar, CreditCard, MapPin } from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
  deliveryDate: string;
  trackingNumber: string;
}

const OrderHistory = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const orders: Order[] = [
    {
      id: "ORD-12345",
      date: "March 15, 2024",
      total: 509.97,
      status: "Delivered",
      items: [
        {
          name: "Premium Wireless Headphones",
          quantity: 1,
          price: 199.99,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
        },
        {
          name: "Smart Watch Series 5",
          quantity: 1,
          price: 299.99,
          image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500"
        }
      ],
      shippingAddress: "123 Main Street, San Francisco, CA 94105",
      paymentMethod: "Visa ending in 4242",
      deliveryDate: "March 18, 2024",
      trackingNumber: "1Z999AA1234567890"
    },
    {
      id: "ORD-12344",
      date: "March 10, 2024",
      total: 299.99,
      status: "In Transit",
      items: [
        {
          name: "Smart Watch Series 5",
          quantity: 1,
          price: 299.99,
          image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500"
        }
      ],
      shippingAddress: "456 Market Street, San Francisco, CA 94103",
      paymentMethod: "Mastercard ending in 5555",
      deliveryDate: "March 20, 2024",
      trackingNumber: "1Z999AA1234567891"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-2 mb-8">
          <Package className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Order {order.id}</h2>
                    <p className="text-sm text-gray-600">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <RefreshCcw className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">{order.status}</span>
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
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm font-medium text-green-600">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-800">Total</span>
                    <span className="font-medium text-green-600">${order.total}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedOrder(null)} />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
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
                      <h3 className="font-semibold text-gray-800">Order {selectedOrder.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Ordered on {selectedOrder.date}</span>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-800">Delivery Information</span>
                    </div>
                    <div className="ml-7 space-y-2">
                      <p className="text-gray-600">Expected Delivery: {selectedOrder.deliveryDate}</p>
                      <p className="text-gray-600">Tracking Number: {selectedOrder.trackingNumber}</p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-800">Shipping Address</span>
                    </div>
                    <p className="ml-7 text-gray-600">{selectedOrder.shippingAddress}</p>
                  </div>

                  {/* Payment Information */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-800">Payment Information</span>
                    </div>
                    <p className="ml-7 text-gray-600">{selectedOrder.paymentMethod}</p>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800">Order Items</h3>
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                          <p className="font-medium text-green-600">${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">Total</span>
                      <span className="text-lg font-semibold text-green-600">${selectedOrder.total}</span>
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