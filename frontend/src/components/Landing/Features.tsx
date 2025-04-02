// Features.tsx
import { motion } from "framer-motion";
import { Globe, Leaf, TrendingUp } from "lucide-react";

const features = [
  {
    icon: <Leaf className="h-14 w-14 text-emerald-600" />,
    title: "Smart Farming Analytics",
    description: "Real-time data insights for optimized crop production",
    image: "/images/supply.svg", // Fixed path
  },
  {
    icon: <Globe className="h-14 w-14 text-emerald-600" />,
    title: "Global Marketplace",
    description: "Direct access to international buyers and distributors",
    image: "/images/local.svg", // Fixed path
  },
  {
    icon: <TrendingUp className="h-14 w-14 text-emerald-600" />,
    title: "Growth Tracking",
    description: "AI-powered predictions and market trend analysis",
    image: "/images/price.svg", // Fixed path
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center text-gray-900 mb-16"
        >
          Next-Gen Agricultural Platform
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Image Background */}
              <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-white w-fit p-4 rounded-2xl shadow-lg mb-6"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
