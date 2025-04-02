import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
        when: "beforeChildren",
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const mobileMenuVariants = {
    closed: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    open: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  return (
    <motion.header 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div variants={itemVariants}>
            <Link 
              to="/" 
              className="text-3xl font-black tracking-tight bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 bg-clip-text text-transparent hover:from-green-600 hover:to-teal-700 transition-all duration-300"
            >
              Farm2Market
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            variants={containerVariants}
            className="hidden md:flex items-center space-x-10"
          >
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} variants={itemVariants}>
                {item.label}
              </NavLink>
            ))}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
            >
              <span>Get Started</span>
              <motion.span
                className="inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.div variants={itemVariants} className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2 group"
              aria-label="Toggle menu"
            >
              <svg className="h-7 w-7 fill-current text-gray-700 group-hover:text-green-600 transition-colors" viewBox="0 0 24 24">
                <motion.path
                  animate={isOpen ? "open" : "closed"}
                  variants={{
                    closed: { d: "M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" },
                    open: { d: "M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" }
                  }}
                  transition={{ duration: 0.2 }}
                />
              </svg>
            </button>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden mt-6 pb-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100/50"
            >
              <div className="space-y-4 px-4 pt-4">
                {navItems.map((item) => (
                  <NavLink 
                    key={item.href} 
                    href={item.href} 
                    mobile 
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Get Started
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

const NavLink = ({
  href,
  children,
  mobile = false,
  onClick,
  variants,
}) => {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      variants={variants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${
        mobile 
          ? "block text-lg py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200" 
          : "text-gray-700 font-medium"
      } relative group`}
    >
      {children}
      {!mobile && (
        <motion.span
          className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
        />
      )}
    </motion.a>
  );
};

export default Header;