import { useState } from 'react';
import { MapPin, MessageSquare, Phone } from 'lucide-react';
import { Button } from '../components/Button';

const PRODUCT = {
  id: '1',
  name: 'Fresh Organic Tomatoes',
  price: 2.99,
  quantity: 100,
  unit: 'lbs',
  location: 'Sacramento, CA',
  description: 'Freshly harvested organic tomatoes grown without pesticides. Perfect for salads and cooking. Available in bulk quantities.',
  images: [
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524593166156-312f362cada0?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?auto=format&fit=crop&q=80',
  ],
  seller: {
    id: '1',
    name: 'John Smith',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
    rating: 4.8,
  },
};

export function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-6">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
        <img
          src={PRODUCT.images[selectedImage]}
          alt={PRODUCT.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {PRODUCT.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                selectedImage === index ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h1 className="text-3xl font-bold text-gray-900">{PRODUCT.name}</h1>
            <div className="mt-4 flex items-center gap-2 text-gray-500">
              <MapPin className="h-5 w-5" />
              <span>{PRODUCT.location}</span>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Price</span>
                <span className="text-2xl font-bold text-orange-500">
                  ${PRODUCT.price}/{PRODUCT.unit}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Available Quantity</span>
                <span className="font-medium">
                  {PRODUCT.quantity} {PRODUCT.unit}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">Description</h2>
            <p className="mt-4 text-gray-600">{PRODUCT.description}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="flex items-center gap-4">
              <img
                src={PRODUCT.seller.avatar}
                alt={PRODUCT.seller.name}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {PRODUCT.seller.name}
                </h3>
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-sm text-gray-500">Rating:</span>
                  <span className="font-medium text-orange-500">
                    {PRODUCT.seller.rating}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              <Button>
                <MessageSquare className="mr-2 h-5 w-5" />
                Message Seller
              </Button>
              <Button variant="outline">
                <Phone className="mr-2 h-5 w-5" />
                Call Seller
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="font-semibold text-gray-900">Make an Offer</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">$</span>
                <input
                  type="number"
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your offer"
                  min="0"
                  step="0.01"
                />
                <span className="text-gray-500">/{PRODUCT.unit}</span>
              </div>
              <Button className="w-full">Submit Offer</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}