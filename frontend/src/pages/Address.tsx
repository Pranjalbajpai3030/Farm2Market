import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Check, ChevronRight } from 'lucide-react';

const Address = () => {
  const navigate = useNavigate();
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(1);

  const savedAddresses = [
    {
      id: 1,
      name: "John Doe",
      street: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      phone: "(555) 123-4567",
      isDefault: true
    },
    {
      id: 2,
      name: "John Doe",
      street: "456 Market Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      phone: "(555) 987-6543",
      isDefault: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-2 mb-8">
          <MapPin className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Shipping Address</h1>
        </div>

        {/* Saved Addresses */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Saved Addresses</h2>
          
          <div className="space-y-4">
            {savedAddresses.map((address) => (
              <div 
                key={address.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedAddressId === address.id 
                    ? 'border-green-600 bg-green-50' 
                    : 'border-gray-200 hover:border-green-600'
                }`}
                onClick={() => setSelectedAddressId(address.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{address.name}</h3>
                      {address.isDefault && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{address.street}</p>
                    <p className="text-gray-600">{`${address.city}, ${address.state} ${address.zipCode}`}</p>
                    <p className="text-gray-600 mt-1">{address.phone}</p>
                  </div>
                  <div className="flex items-center">
                    {selectedAddressId === address.id ? (
                      <Check className="w-6 h-6 text-green-600" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Address Button */}
          <button
            onClick={() => setShowNewAddressForm(!showNewAddressForm)}
            className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-600 hover:text-green-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Address
          </button>
        </div>

        {/* New Address Form */}
        {showNewAddressForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">New Address</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="makeDefault"
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="makeDefault" className="text-sm text-gray-600">
                  Make this my default address
                </label>
              </div>
            </form>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 px-6 py-3 border border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            Back to Cart
          </button>
          <button
            onClick={() => navigate('/payment')}
            disabled={!selectedAddressId}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Address;