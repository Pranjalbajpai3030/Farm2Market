import React from 'react';
import { X, Home, ShoppingCart, PlusCircle, MessageCircle, User, Settings, HelpCircle,HeadphonesIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuItem = ({ icon: Icon, label, to, onClick }: { icon: any; label: string; to: string; onClick: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 hover:bg-green-50 transition-colors ${
        isActive ? 'text-green-600 bg-green-50' : 'text-gray-700'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-0">FarmConnect</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="py-4">
          <MenuItem icon={Home} label="Home" to="/" onClick={onClose} />
          <MenuItem icon={ShoppingCart} label="Market" to="/market" onClick={onClose} />
          <MenuItem icon={PlusCircle} label="Sell" to="/sell" onClick={onClose} />
          <MenuItem icon={MessageCircle} label="Messages" to="/messages" onClick={onClose} />
          <MenuItem icon={User} label="Profile" to="/profile" onClick={onClose} />
          
          <div className="border-t my-4" />
          
          <MenuItem icon={Settings} label="Settings" to="/settings" onClick={onClose} />
          <MenuItem icon={HeadphonesIcon} label="Help & Support" to="/Customer_Support" onClick={onClose} />
        </nav>
      </div>
    </>
  );
}