import { Search, Filter } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'Fresh Organic Tomatoes',
    price: 2.99,
    location: 'Sacramento, CA',
    image:
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    name: 'Local Honey',
    price: 8.99,
    location: 'Portland, OR',
    image:
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80',
  },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, Farmer</h1>
        <div className="flex items-center gap-2">
          <Input
            className="flex-1"
            placeholder="Search for products or buyers"
            prefix={<Search className="h-5 w-5 text-gray-400" />}
          />
          <Button variant="outline">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Featured Listings
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:-translate-y-1"
            >
              <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.location}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-orange-500">
                    ${product.price}
                  </span>
                  <Button size="sm">Contact Seller</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}