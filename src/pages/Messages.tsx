import { useState } from 'react';
import { Search, Send } from 'lucide-react';
import { Input } from '../components/Input';

const CONVERSATIONS = [
  {
    id: '1',
    user: {
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
    },
    lastMessage: {
      content: 'Are the tomatoes still available?',
      timestamp: '2024-03-10T14:30:00Z',
      unread: true,
    },
  },
  {
    id: '2',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
    },
    lastMessage: {
      content: "Great! I'll take 20 pounds.",
      timestamp: '2024-03-09T18:15:00Z',
      unread: false,
    },
  },
];

const MESSAGES = [
  {
    id: '1',
    senderId: 'user',
    content: "Hi, I'm interested in your organic tomatoes.",
    timestamp: '2024-03-10T14:00:00Z',
  },
  {
    id: '2',
    senderId: 'other',
    content: "Hello! Yes, they're still available. How many pounds would you like?",
    timestamp: '2024-03-10T14:15:00Z',
  },
  {
    id: '3',
    senderId: 'user',
    content: "I'm thinking about 10 pounds. What's your best price?",
    timestamp: '2024-03-10T14:20:00Z',
  },
  {
    id: '4',
    senderId: 'other',
    content: "For 10 pounds, I can do $2.50 per pound. They're freshly harvested!",
    timestamp: '2024-03-10T14:25:00Z',
  },
];

export function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(CONVERSATIONS[0]);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      <div className="w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-md lg:block">
        <div className="border-b p-4">
          <Input
            placeholder="Search messages"
            prefix={<Search className="h-5 w-5 text-gray-400" />}
          />
        </div>
        <div className="divide-y overflow-y-auto">
          {CONVERSATIONS.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`w-full p-4 text-left transition-colors hover:bg-gray-50 ${
                selectedConversation.id === conversation.id ? 'bg-orange-50' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={conversation.user.avatar}
                  alt={conversation.user.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {conversation.user.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(conversation.lastMessage.timestamp).toLocaleTimeString(
                        [],
                        { hour: '2-digit', minute: '2-digit' }
                      )}
                    </span>
                  </div>
                  <p className="truncate text-sm text-gray-500">
                    {conversation.lastMessage.content}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-lg bg-white shadow-md">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <div className="flex items-center gap-4">
              <img
                src={selectedConversation.user.avatar}
                alt={selectedConversation.user.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold text-gray-900">
                  {selectedConversation.user.name}
                </h2>
                <span className="text-sm text-gray-500">Online</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {MESSAGES.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.senderId === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="mt-1 block text-right text-xs opacity-75">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t p-4">
            <form className="flex items-center gap-4">
              <Input
                className="flex-1"
                placeholder="Type your message..."
                autoComplete="off"
              />
              <button
                type="submit"
                className="rounded-full bg-orange-500 p-2 text-white transition-colors hover:bg-orange-600"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}