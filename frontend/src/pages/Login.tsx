import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, ArrowRight, Leaf } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        {/* Floating leaves animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            >
              <Leaf className="w-6 h-6 text-emerald-200 transform rotate-45" />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-full bg-white shadow-xl mb-4 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center relative overflow-hidden">
                <Sprout className="w-8 h-8 text-white transform -rotate-45" />
                <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-green-700/50 to-transparent" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3 tracking-tight">Farm2Market</h1>
            <p className="text-gray-600 text-lg">
              {isLogin ? 'Welcome to your harvest hub!' : 'Join our growing community'}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100">
            <div className="mb-8 flex justify-center space-x-4">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-6 py-2 rounded-lg transition-all ${
                  isLogin
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-6 py-2 rounded-lg transition-all ${
                  !isLogin
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all flex items-center justify-center space-x-2 group shadow-lg shadow-emerald-500/30"
              >
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Demo Credentials */}
            {isLogin && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-center text-sm text-gray-500 mb-2">Demo Credentials</p>
                <div className="text-center text-sm text-gray-600">
                  <p>Email: rajesh@farmconnect.com</p>
                  <p>Password: password123</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}