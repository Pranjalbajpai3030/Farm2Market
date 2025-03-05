import React, { useState } from 'react';
import { Search, MoreVertical, Phone, Video, Send, Smile, Paperclip } from 'lucide-react';

const chats = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    lastMessage: 'Is the tomato stock still available?',
    time: '2m ago',
    unread: 2,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    online: true,
    lastSeen: 'Last seen today at 10:32 AM',
    messages: [
      { id: 1, text: 'Hello, I wanted to check about the vegetables', sender: 'them', time: '10:30 AM' },
      { id: 2, text: 'Is the tomato stock still available?', sender: 'them', time: '10:31 AM' },
      { id: 3, text: 'Yes, we have fresh tomatoes in stock. How many kg would you like?', sender: 'me', time: '10:32 AM' }
    ]
  },
  {
    id: 2,
    name: 'Priya Patel',
    lastMessage: 'I would like to order 10kg potatoes',
    time: '1h ago',
    unread: 0,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    online: true,
    lastSeen: 'Last seen today at 9:21 AM',
    messages: [
      { id: 1, text: 'Hi, do you have potatoes available?', sender: 'them', time: '9:20 AM' },
      { id: 2, text: 'I would like to order 10kg potatoes', sender: 'them', time: '9:21 AM' }
    ]
  },
  {
    id: 3,
    name: 'Amit Singh',
    lastMessage: 'Thank you for the delivery',
    time: '2h ago',
    unread: 0,
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100',
    online: false,
    lastSeen: 'Last seen yesterday at 8:45 PM',
    messages: [
      { id: 1, text: 'Thank you for the delivery', sender: 'them', time: '8:45 AM' }
    ]
  }
];

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setNewMessage('');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with chat list */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 bg-green-600 text-white">
          <h1 className="text-xl font-semibold">Messages</h1>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${selectedChat?.id === chat.id ? 'bg-gray-50' : ''}`}
            >
              <div className="relative">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                )}
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                  <span className="text-sm text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <div className="ml-2 bg-green-500 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h2 className="font-semibold text-gray-900">{selectedChat.name}</h2>
                  <p className="text-sm text-gray-500">
                    {selectedChat.online ? 'Online' : selectedChat.lastSeen}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="w-5 h-5 text-gray-500 cursor-pointer hover:text-green-600 transition-colors" />
                <Video className="w-5 h-5 text-gray-500 cursor-pointer hover:text-green-600 transition-colors" />
                <MoreVertical className="w-5 h-5 text-gray-500 cursor-pointer hover:text-green-600 transition-colors" />
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {selectedChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === 'me'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-900'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'me' ? 'text-green-100' : 'text-gray-500'
                  }`}>{message.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="text-gray-500 hover:text-green-600 transition-colors"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 py-2 px-4 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                className="text-gray-500 hover:text-green-600 transition-colors"
              >
                <Smile className="w-5 h-5" />
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <h2 className="text-xl font-semibold mb-2">Welcome to Messages</h2>
            <p>Select a chat to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}