import { useState } from "react";
import { motion } from "framer-motion";
import { Play, ChevronRight, X } from "lucide-react";

const DemoVideo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="container mx-auto px-6 max-w-screen-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500">
            Discover How It Works
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Explore our intuitive guide to effortlessly sell your produce directly to buyers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative group"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <img
                src="https://img.youtube.com/vi/XSIUXQpy0-E/maxresdefault.jpg"
                alt="Platform Demo Preview"
                className="w-full h-[320px] object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                  onClick={() => setIsOpen(true)}
                >
                  <Play className="w-10 h-10 text-white ml-2" />
                </motion.div>
              </div>
            </div>

            {/* Modal */}
            {isOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="relative bg-white rounded-2xl overflow-hidden w-full max-w-3xl">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div className="w-full aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/XSIUXQpy0-E"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="space-y-8"
          >
            {[
              { title: "Create Your Account", desc: "Quick setup with just a few clicks." },
              { title: "List Your Produce", desc: "Showcase your crops with stunning visuals." },
              { title: "Connect with Buyers", desc: "Chat directly with eager customers." },
            ].map((step, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 10 }}
                className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-teal-500/10 p-3 rounded-full">
                  <ChevronRight className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DemoVideo;
