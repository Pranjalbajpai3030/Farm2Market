import React, { useState } from 'react';
import { Package, ChevronRight, Clock, X, Truck, Calendar, CreditCard, MapPin, Phone, Mail, DollarSign } from 'lucide-react';

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
  status: 'Pending' | 'Processing' | 'Out for Delivery' | 'Delivered';
  items: OrderItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending';
  notes?: string;
}

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const orders: Order[] = [
    {
      id: "ORD-12345",
      date: "March 15, 2024 14:30",
      total: 509.97,
      status: "Pending",
      customer: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567"
      },
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
      paymentStatus: "Paid",
      notes: "Please handle with care"
    },
    {
      id: "ORD-12346",
      date: "March 15, 2024 15:45",
      total: 299.99,
      status: "Processing",
      customer: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1 (555) 987-6543"
      },
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
      paymentStatus: "Pending"
    }
  ];

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Out for Delivery': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800'
    };
    return colors[status];
  };

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    return status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Package className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">Incoming Orders</h1>
          </div>
          <div className="flex gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="out-for-delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
            <input
              type="text"
              placeholder="Search orders..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div 
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Order {order.id}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Clock className="w-4 h-4" />
                      <span>{order.date}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600 truncate">{order.shippingAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">{order.customer.phone}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
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
              <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
                <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
                    <p className="text-sm text-gray-600 mt-1">Order {selectedOrder.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Status and Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-600">{selectedOrder.date}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-gray-800">Customer Information</h3>
                    <div className="ml-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{selectedOrder.customer.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-600">{selectedOrder.customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-600">{selectedOrder.customer.phone}</span>
                      </div>
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-gray-800">Payment Information</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus}
                      </span>
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

                  {/* Notes */}
                  {selectedOrder.notes && (
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Order Notes</h3>
                      <p className="text-gray-600">{selectedOrder.notes}</p>
                    </div>
                  )}

                  {/* Order Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="text-lg font-semibold text-green-600">${selectedOrder.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                      Update Status
                    </button>
                    <button className="flex-1 px-6 py-3 border border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                      Print Order
                    </button>
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

export default AdminOrders;