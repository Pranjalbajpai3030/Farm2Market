import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-white py-24 relative overflow-hidden">
      {/* Main Container */}
      <div className="container mx-auto px-6 max-w-screen-xl relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Text Section (Left) */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="md:w-1/2 text-center md:text-left mb-12 md:mb-0"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              It’s Not Just Farming
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-md mx-auto md:mx-0 leading-relaxed">
              It’s smarter, sustainable, and connected agriculture with our
              innovative platform.
            </p>
            <motion.div
              whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="inline-block bg-gradient-to-r from-emerald-600 to-lime-500 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Growing Now
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Section: 3D Farmer Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="md:w-1/2 w-full flex justify-center relative"
          >
            {/* 3D Image Wrapper */}
            
              {/* Farmer Illustration */}
              <img
                src="/images/farmerField.svg"
                alt="Farmer"
                className="w-[350px] h-[450px]  "
              />

              
        
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
