import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Amit Patel',
    rating: 5,
    date: '2 days ago',
    comment: 'Great quality tomatoes! Will definitely buy again.',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 2,
    name: 'Priya Singh',
    rating: 4,
    date: '1 week ago',
    comment: 'Fresh vegetables and good service. Delivery was a bit delayed.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 3,
    name: 'Rahul Sharma',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Best organic produce in the area. Very satisfied with the quality.',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100'
  }
];

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export default function Reviews() {
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-2xl font-semibold mb-4">Reviews & Ratings</h2>
        <div className="flex items-center space-x-4">
          <div className="text-4xl font-bold text-green-600">{averageRating.toFixed(1)}</div>
          <div>
            <RatingStars rating={Math.round(averageRating)} />
            <p className="text-sm text-gray-600 mt-1">{reviews.length} reviews</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-start space-x-4">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{review.name}</h3>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <RatingStars rating={review.rating} />
                <p className="mt-2 text-gray-600">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}