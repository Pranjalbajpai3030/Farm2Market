import {
  X,
  Home,
  ShoppingCart,
  PlusCircle,
  MessageCircle,
  User,
  Settings,
  HeadphonesIcon,
  HistoryIcon,
  PackagePlus,
  Leaf,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { MdInventory } from "react-icons/md";
import { useEffect, useState } from "react";
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuItem = ({
  icon: Icon,
  label,
  to,
  onClick,
}: {
  icon: any;
  label: string;
  to: string;
  onClick: () => void;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-3 px-6 py-3 rounded-lg mx-3 transition-all duration-200 group ${
        isActive
          ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
          : "text-gray-600 hover:bg-green-50"
      }`}
    >
      <div
        className={`${
          isActive ? "text-white" : "text-green-500 group-hover:text-green-600"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <span
        className={`font-medium ${
          isActive ? "" : "group-hover:translate-x-1"
        } transition-transform duration-200`}
      >
        {label}
      </span>
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
      )}
    </Link>
  );
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [userType, setUserType] = useState<string>("");
  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(
          `https://farm2market-pearl.vercel.app/api/user`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUserType(data.user_type);
          console.log(data.user_type);
        } else {
          console.log("Error while fetching the type of user.");
        }
      } catch (error) {
        console.log("Error while fetching the type of user.");
      }
    };

    fetchUserType();
  }, []);
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 rounded-r-2xl flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-green-400 to-green-600 p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Farm2Market
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Menu Items - Now with overflow scrolling */}
        <nav className="py-5 space-y-1.5 flex-1 overflow-y-auto">
          <MenuItem icon={Home} label="Home" to="/" onClick={onClose} />
          <MenuItem
            icon={ShoppingCart}
            label="Market"
            to="/market"
            onClick={onClose}
          />
          {userType === "farmer" && (
            <MenuItem
              icon={PlusCircle}
              label="Sell"
              to="/sell"
              onClick={onClose}
            />
          )}
          <MenuItem
            icon={MessageCircle}
            label="Messages"
            to="/messages"
            onClick={onClose}
          />
          <MenuItem
            icon={User}
            label="Profile"
            to="/profile"
            onClick={onClose}
          />
          <MenuItem
            icon={HistoryIcon}
            label="History"
            to="/history"
            onClick={onClose}
          />
          {userType === "farmer" && (
            <div className="px-6 py-3">
              <div className="border-t border-gray-200"></div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-3 mb-1 px-2">
                Farmer
              </p>
            </div>
          )}
          {userType === "farmer" && (
            <MenuItem
              icon={PackagePlus}
              label="Orders Recieved"
              to="/orders-history"
              onClick={onClose}
            />
          )}
          {userType === "farmer" && (
            <MenuItem
              icon={MdInventory}
              label="Products Listed"
              to="/products"
              onClick={onClose}
            />
          )}
          {userType !== "farmer" && (
            <MenuItem
              icon={PackagePlus}
              label="Your Orders"
              to="/orders-history"
              onClick={onClose}
            />
          )}
          <div className="px-6 py-3">
            <div className="border-t border-gray-200"></div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-3 mb-1 px-2">
              Settings
            </p>
          </div>

          <MenuItem
            icon={Settings}
            label="Settings"
            to="/settings"
            onClick={onClose}
          />
          <MenuItem
            icon={HeadphonesIcon}
            label="Help & Support"
            to="/Customer_Support"
            onClick={onClose}
          />
        </nav>

        {/* Footer - Now positioned properly with flex layout */}
        <div className="p-5 mt-auto">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
            <p className="text-sm text-green-800 font-medium">Need help?</p>
            <p className="text-xs text-green-600 mt-1">
              Contact our support team
            </p>
            <button className="mt-3 text-xs bg-white text-green-600 px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 font-medium">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
