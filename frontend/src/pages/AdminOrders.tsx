import React, { useState } from 'react';
import { 
  Menu,
  X,
  Home,
  ShoppingCart,
  Users,
  Settings,
  Bell,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Download,
  MoreVertical,
  Package,
  CreditCard,
  Truck,
  User
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentMethod: {
    type: string;
    lastFour: string;
  };
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "John Doe",
    date: "2024-03-10",
    total: 299.99,
    status: "pending",
    items: [
      { id: "ITEM-1", name: "Premium Headphones", quantity: 1, price: 199.99 },
      { id: "ITEM-2", name: "Wireless Charger", quantity: 2, price: 49.99 }
    ],
    shippingAddress: {
      street: "123 Main St",
      city: "Boston",
      state: "MA",
      zip: "02108"
    },
    paymentMethod: {
      type: "Credit Card",
      lastFour: "4242"
    }
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    date: "2024-03-09",
    total: 159.50,
    status: "completed",
    items: [
      { id: "ITEM-3", name: "Smart Watch", quantity: 1, price: 159.50 }
    ],
    shippingAddress: {
      street: "456 Oak Ave",
      city: "Chicago",
      state: "IL",
      zip: "60601"
    },
    paymentMethod: {
      type: "PayPal",
      lastFour: "N/A"
    }
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    date: "2024-03-08",
    total: 499.99,
    status: "processing",
    items: [
      { id: "ITEM-4", name: "4K Monitor", quantity: 1, price: 399.99 },
      { id: "ITEM-5", name: "Keyboard", quantity: 1, price: 100.00 }
    ],
    shippingAddress: {
      street: "789 Pine St",
      city: "Seattle",
      state: "WA",
      zip: "98101"
    },
    paymentMethod: {
      type: "Credit Card",
      lastFour: "1234"
    }
  }
];

type TabType = 'details' | 'items' | 'shipping' | 'payment';

const AdminOrders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [editingStatus, setEditingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<Order['status']>('pending');

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setCurrentStatus(order.status);
    setActiveTab('details');
    setEditingStatus(false);
  };

  const handleStatusUpdate = () => {
    if (selectedOrder) {
      setSelectedOrder({ ...selectedOrder, status: currentStatus });
      setEditingStatus(false);
    }
  };

  const renderTabContent = () => {
    if (!selectedOrder) return null;

    switch (activeTab) {
      case 'details':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Order ID</p>
                <p className="mt-1 text-sm text-gray-900">{selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Customer</p>
                <p className="mt-1 text-sm text-gray-900">{selectedOrder.customer}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="mt-1 text-sm text-gray-900">{selectedOrder.date}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                {editingStatus ? (
                  <select
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value as Order['status'])}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                ) : (
                  <p className={`mt-1 text-sm inline-flex px-2 rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="text-sm text-gray-900">${(selectedOrder.total * 0.9).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Tax</span>
                  <span className="text-sm text-gray-900">${(selectedOrder.total * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-base font-medium text-gray-900">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'items':
        return (
          <div className="space-y-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedOrder.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'shipping':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
              <div className="text-sm text-gray-600">
                <p>{selectedOrder.shippingAddress.street}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}</p>
              </div>
            </div>
          </div>
        );
      case 'payment':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Method</h4>
              <div className="text-sm text-gray-600">
                <p>{selectedOrder.paymentMethod.type}</p>
                {selectedOrder.paymentMethod.lastFour !== 'N/A' && (
                  <p>Ending in {selectedOrder.paymentMethod.lastFour}</p>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300`}>
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <h2 className={`text-xl font-bold text-green-800 ${!sidebarOpen && 'hidden'}`}>Admin Panel</h2>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-green-100 rounded-lg">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <a href="/frontend/src/pages/AdminDashboard.tsx" className="flex items-center p-2 text-gray-700 hover:bg-green-100 rounded-lg">
                  <Home size={20} />
                  {sidebarOpen && <span className="ml-3">Dashboard</span>}
                </a>
              </li>
              <li>
                <a href="/frontend/src/pages/AdminOrders.tsx" className="flex items-center p-2 text-gray-700 bg-green-100 rounded-lg">
                  <ShoppingCart size={20} />
                  {sidebarOpen && <span className="ml-3">Orders</span>}
                </a>
              </li>
              <li>
                <a href="/frontend/src/pages/AdminCustomers.tsx" className="flex items-center p-2 text-gray-700 hover:bg-green-100 rounded-lg">
                  <Users size={20} />
                  {sidebarOpen && <span className="ml-3">Customers</span>}
                </a>
              </li>
              <li>
                <a href="/frontend/src/pages/AdminSettings" className="flex items-center p-2 text-gray-700 hover:bg-green-100 rounded-lg">
                  <Settings size={20} />
                  {sidebarOpen && <span className="ml-3">Settings</span>}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center flex-1">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-700">Admin User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={16} className="mr-2" />
                <span>Filter</span>
                <ChevronDown size={16} className="ml-2" />
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Export Orders
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOrderSelect(order)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Eye size={18} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Download size={18} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
              <span className="font-medium">20</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`${
                      activeTab === 'details'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <Package className="w-5 h-5 mr-2" />
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab('items')}
                    className={`${
                      activeTab === 'items'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Items
                  </button>
                  <button
                    onClick={() => setActiveTab('shipping')}
                    className={`${
                      activeTab === 'shipping'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <Truck className="w-5 h-5 mr-2" />
                    Shipping
                  </button>
                  <button
                    onClick={() => setActiveTab('payment')}
                    className={`${
                      activeTab === 'payment'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              {renderTabContent()}

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                {activeTab === 'details' && (
                  editingStatus ? (
                    <button
                      onClick={handleStatusUpdate}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                      Save Status
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingStatus(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                      Edit Status
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;