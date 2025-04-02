import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="relative py-32 bg-gradient-to-br from-emerald-950 via-teal-900 to-lime-700 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-teal-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-lime-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 max-w-screen-xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Side Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-lime-300 to-teal-200">
              Elevate Your Farming Future
            </h2>
            <p className="text-lg md:text-xl text-teal-100 mb-10 max-w-lg leading-relaxed">
              Join a thriving community of farmers revolutionizing agriculture with our cutting-edge platform.
            </p>
            <motion.div
              whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/signup"
                className="bg-gradient-to-r from-lime-400 to-teal-500 text-gray-900 px-10 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Start Free Trial
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="lg:w-1/2 w-full flex justify-center"
          >
            <div className="relative bg-gradient-to-br from-white/20 to-teal-900/20 backdrop-blur-xl rounded-3xl p-2 shadow-2xl overflow-hidden border border-teal-500/30">
              {/* Image Wrapper */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <img
                  src="/images/cta.svg"
                  alt="Platform Dashboard"
                  className="w-full h-auto max-w-[450px] max-h-[340px] rounded-2xl object-cover"
                />
                {/* Subtle Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/30 to-transparent rounded-2xl"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;