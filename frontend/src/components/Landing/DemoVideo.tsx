import { motion } from "framer-motion";
import { Play, ChevronRight } from "lucide-react";

const DemoVideo = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-screen-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            See How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch our simple guide on how to use the platform to sell your produce directly to buyers
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group"
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              {/* Replace with your actual video thumbnail */}
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=80"
                alt="Platform Demo Preview"
                className="w-full h-[300px] object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center cursor-pointer"
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <ChevronRight className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Create Your Account</h3>
                <p className="text-gray-600">Simple registration process with your basic details</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <ChevronRight className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">List Your Produce</h3>
                <p className="text-gray-600">Add photos and details of your crops for buyers to see</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <ChevronRight className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Connect with Buyers</h3>
                <p className="text-gray-600">Get direct messages from interested buyers</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DemoVideo;