import { motion } from "framer-motion";
import { Leaf, TrendingUp, Users } from "lucide-react";

const features = [
  {
    icon: <Leaf className="h-12 w-12 text-green-600" />,
    title: "Direct-to-Market",
    description:
      "Eliminate intermediaries and connect directly with markets for better profit margins.",
    image: "/images/direct.svg",
  },
  {
    icon: <TrendingUp className="h-12 w-12 text-green-600" />,
    title: "Fair Pricing",
    description:
      "Get fair prices for your produce without traditional bottlenecks.",
    image: "/images/fresh.svg",
  },
  {
    icon: <Users className="h-12 w-12 text-green-600" />,
    title: "Larger Market Access",
    description:
      "Reach a wider customer base and expand your farming business.",
    image: "/images/largeMarket.svg",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose Farm2Market?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {feature.description}
              </p>
              <img
                src={feature.image}
                alt={feature.title}
                width={300}
                height={200}
                className="mx-auto mb-4 rounded-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
