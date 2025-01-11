import { useState } from 'react';
import { Camera, MapPin, Mail, Phone } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const USER = {
  name: 'John Smith',
  email: 'john@example.com',
  phone: '+1 (555) 123-4567',
  location: 'Sacramento, CA',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
  role: 'seller',
};

const USER_LISTINGS = [
  {
    id: '1',
    name: 'Fresh Organic Tomatoes',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80',
    status: 'active',
  },
  {
    id: '2',
    name: 'Local Honey',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80',
    status: 'sold',
  },
];

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative">
            <img
              src={USER.avatar}
              alt={USER.name}
              className="h-32 w-32 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 rounded-full bg-orange-500 p-2 text-white shadow-lg hover:bg-orange-600">
              <Camera className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 space-y-4 text-center sm:text-left">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{USER.name}</h1>
              <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-medium capitalize text-orange-800">
                {USER.role}
              </span>
            </div>
            <div className="flex flex-col gap-2 text-gray-500 sm:flex-row sm:gap-6">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <MapPin className="h-5 w-5" />
                <span>{USER.location}</span>
              </div>
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <Mail className="h-5 w-5" />
                <span>{USER.email}</span>
              </div>
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <Phone className="h-5 w-5" />
                <span>{USER.phone}</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="sm:self-start"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {isEditing && (
          <form className="mt-8 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Input label="Name" defaultValue={USER.name} />
              <Input label="Email" type="email" defaultValue={USER.email} />
              <Input label="Phone" type="tel" defaultValue={USER.phone} />
              <Input label="Location" defaultValue={USER.location} />
            </div>
            <div className="flex justify-end gap-4">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        )}
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Your Listings</h2>
          <div className="space-x-2">
            <button className="text-sm text-orange-500 hover:underline">
              Active
            </button>
            <button className="text-sm text-gray-500 hover:text-gray-900 hover:underline">
              Sold
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {USER_LISTINGS.map((listing) => (
            <div
              key={listing.id}
              className="group overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:-translate-y-1"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div
                  className={`absolute right-2 top-2 rounded-full px-3 py-1 text-xs font-medium ${
                    listing.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {listing.status}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{listing.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-orange-500">
                    ${listing.price}
                  </span>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}