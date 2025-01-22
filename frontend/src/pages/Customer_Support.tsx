import React, { useState } from 'react';
import { HeadphonesIcon, MessageSquare, Phone, X } from 'lucide-react';

const CustomerSupport = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-2 mb-8">
          <HeadphonesIcon className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Customer Support</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Chat Support Option */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Chat Support</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Connect with our support team instantly through live chat. Available 24/7.
            </p>
            <button
              onClick={() => setShowChat(true)}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Start Chat
            </button>
          </div>

          {/* Phone Support Option */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Phone Support</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Speak directly with our support team. Available Monday to Friday, 9 AM - 5 PM EST.
            </p>
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-600">1-800-123-4567</p>
              <p className="text-sm text-gray-500 mt-2">Toll-free number for US and Canada</p>
            </div>
          </div>
        </div>

        {/* Chat Window */}
        {showChat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-800">Live Chat Support</h3>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="h-96 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm text-gray-800">
                        Hello! How can I help you today?
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Support Agent • Just now</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSupport;