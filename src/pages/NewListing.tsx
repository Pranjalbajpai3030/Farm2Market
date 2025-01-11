import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function NewListing() {
  const [images, setImages] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
      
      <div className="rounded-lg bg-white p-6 shadow-md">
        <form className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Product Name"
              placeholder="e.g., Organic Tomatoes"
              required
            />
            
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Price"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">Select a category</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="grains">Grains</option>
                  <option value="dairy">Dairy</option>
                  <option value="meat">Meat</option>
                  <option value="honey">Honey</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Quantity"
                type="number"
                placeholder="0"
                min="0"
                required
              />
              <Input
                label="Unit"
                placeholder="e.g., kg, lbs, pieces"
                required
              />
            </div>

            <Input
              label="Location"
              placeholder="e.g., Sacramento, CA"
              required
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={4}
                placeholder="Describe your product..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Product Images
              </label>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="h-full w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <span className="mt-2 block text-sm text-gray-500">
                      Add Image
                    </span>
                  </div>
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button">
              Save Draft
            </Button>
            <Button type="submit">
              Publish Listing
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}