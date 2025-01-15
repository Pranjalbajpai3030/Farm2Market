import React, { useState } from 'react';
import { Home, ShoppingCart, PlusCircle, MessageCircle, User, Bell, Menu } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const NavItem = ({ icon: Icon, label, to }: { icon: any; label: string; to: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className="flex flex-col items-center">
      <div className={`p-2 rounded-lg ${isActive ? 'bg-green-100' : ''}`}>
        <Icon className={`w-6 h-6 ${isActive ? 'text-green-600' : 'text-gray-600'}`} />
      </div>
      <span className={`text-xs mt-1 ${isActive ? 'text-green-600' : 'text-gray-600'}`}>{label}</span>
    </Link>
  );
};

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="ml-3 text-xl font-semibold text-green-600">Farm2Market</h1>
          </div>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center px-4 h-20">
          <NavItem icon={Home} label="Home" to="/" />
          <NavItem icon={ShoppingCart} label="Market" to="/market" />
          <NavItem icon={PlusCircle} label="Sell" to="/sell" />
          <NavItem icon={MessageCircle} label="Messages" to="/messages" />
          <NavItem icon={User} label="Profile" to="/profile" />
        </div>
      </nav>
    </div>
  );
}