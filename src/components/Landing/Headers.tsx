import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // If you're using react-router-dom for navigation

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="text-2xl font-bold text-green-600">
              Farm2Market
            </Link>
          </motion.div>
          <div className="hidden md:flex space-x-4">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-600"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 space-y-2"
          >
            <NavLink href="#features" mobile>
              Features
            </NavLink>
            <NavLink href="#about" mobile>
              About
            </NavLink>
            <NavLink href="#contact" mobile>
              Contact
            </NavLink>
          </motion.div>
        )}
      </nav>
    </header>
  );
};

const NavLink = ({
  href,
  children,
  mobile = false,
}: {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
}) => {
  return (
    <a
      href={href}
      className={`text-gray-600 hover:text-green-600 transition-colors duration-300 ${
        mobile ? "block" : ""
      }`}
    >
      {children}
    </a>
  );
};

export default Header;
