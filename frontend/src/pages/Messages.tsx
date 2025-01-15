import React from 'react';
import { Search } from 'lucide-react';

const chats = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    lastMessage: 'Is the tomato stock still available?',
    time: '2m ago',
    unread: 2,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 2,
    name: 'Priya Patel',
    lastMessage: 'I would like to order 10kg potatoes',
    time: '1h ago',
    unread: 0,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 3,
    name: 'Amit Singh',
    lastMessage: 'Thank you for the delivery',
    time: '2h ago',
    unread: 0,
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100'
  }
];

export default function Messages() {
  return (
    <div className="h-full">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="divide-y">
        {chats.map((chat) => (
          <div key={chat.id} className="flex items-center p-4 hover:bg-gray-50 cursor-pointer">
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{chat.name}</h3>
                <span className="text-sm text-gray-500">{chat.time}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{chat.lastMessage}</p>
            </div>
            {chat.unread > 0 && (
              <div className="ml-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {chat.unread}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}