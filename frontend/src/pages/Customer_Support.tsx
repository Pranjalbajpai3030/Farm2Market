import React, { useState } from 'react';
import { HeadphonesIcon, MessageSquare, Phone, Clock, Globe2 } from 'lucide-react';

const CustomerSupport = () => {
  const redirectToChatbot = () => {
    window.open('https://www.chatbase.co/chatbot-iframe/ta2YCraWj-bOBDEpfWBCQ', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col items-center text-center mb-12">
            <HeadphonesIcon className="w-16 h-16 text-green-600 animate-bounce mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              How Can We Help You?
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Our dedicated support team is here to assist you 24/7. Choose your preferred way to connect with us.
            </p>
          </div>
        </div>
      </div>

      {/* Support Options */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Chat Support Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="bg-green-600 p-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-white" />
                <h2 className="text-2xl font-bold text-white">Live Chat Support</h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <p className="text-gray-600 text-lg">
                  Get instant help from our expert support team through live chat. No waiting queues, just immediate assistance.
                </p>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>Available 24/7</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Globe2 className="w-5 h-5" />
                  <span>Support in multiple languages</span>
                </div>
                <button
                  onClick={redirectToChatbot}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 group"
                >
                  <MessageSquare className="w-5 h-5 group-hover:animate-bounce" />
                  Start Live Chat
                </button>
              </div>
            </div>
          </div>

          {/* Phone Support Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="bg-blue-600 p-4">
              <div className="flex items-center gap-3">
                <Phone className="w-8 h-8 text-white" />
                <h2 className="text-2xl font-bold text-white">Phone Support</h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <p className="text-gray-600 text-lg">
                  Prefer to talk? Our phone support team is ready to help you with any questions or concerns.
                </p>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>Monday to Friday, 9 AM - 5 PM EST</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <p className="text-3xl font-bold text-blue-600 mb-2">9118604416</p>
                  <p className="text-sm text-gray-500">Toll-free for US and Canada</p>
                </div>
                <a
                  href="tel:18001234567"
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group"
                >
                  <Phone className="w-5 h-5 group-hover:animate-bounce" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            Need help outside of our regular hours? Our comprehensive{' '}
            <a href="#" className="text-green-600 hover:underline">knowledge base</a>{' '}
            is available 24/7 with answers to common questions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;