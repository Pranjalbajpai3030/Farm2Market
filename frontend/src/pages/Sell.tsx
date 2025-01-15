import React from 'react';
import { Camera, Plus } from 'lucide-react';

export default function Sell() {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold">List Your Product</h2>

      {/* Image Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Camera className="w-12 h-12 text-gray-400 mx-auto" />
        <p className="mt-2 text-sm text-gray-600">Upload product images</p>
        <button className="mt-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm">
          Choose Files
        </button>
      </div>

      {/* Product Details Form */}
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Fresh Tomatoes"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>kg</option>
              <option>dozen</option>
              <option>piece</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={4}
            placeholder="Describe your product..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available Quantity
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter quantity"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          List Product
        </button>
      </form>
    </div>
  );
}