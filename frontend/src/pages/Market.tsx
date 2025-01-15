import React from 'react';
import { Search, Filter, Star } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Fresh Tomatoes',
    farmer: 'Rajesh Kumar',
    price: '40',
    unit: 'kg',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 2,
    name: 'Organic Potatoes',
    farmer: 'Amit Singh',
    price: '30',
    unit: 'kg',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 3,
    name: 'Green Peas',
    farmer: 'Priya Patel',
    price: '60',
    unit: 'kg',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&q=80&w=300'
  }
];

export default function Market() {
  return (
    <div className="p-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Filter className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Categories */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy'].map((category) => (
          <button
            key={category}
            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm whitespace-nowrap hover:bg-green-50 hover:border-green-500"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-32 object-cover"
            />
            <div className="p-3">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.farmer}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="font-semibold">₹{product.price}/{product.unit}</p>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm">{product.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}