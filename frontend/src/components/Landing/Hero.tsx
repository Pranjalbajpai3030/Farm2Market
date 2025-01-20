import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-green-50 py-20">
      <div className="container mx-auto px-1 max-w-screen-lg">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 text-center md:text-left mb-8 md:mb-0"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
              Connecting <span className="text-lime-600">Farmers</span> Directly
              to Markets
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Empowering farmers with fair prices and direct access to larger
              markets.
            </p>
            <Link
              to="/login"
              className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors duration-300"
            >
              Get Started
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 ml-14"
          >
            <img
              src="/images/farmerField.svg"
              alt="Farmer in a field"
              width={400}
              height={200}
              className="rounded-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
