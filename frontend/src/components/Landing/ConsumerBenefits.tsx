import { motion } from "framer-motion";

const benefits = [
  {
    title: "Fresh, Local Produce",
    description:
      "Get access to the freshest fruits and vegetables straight from local farms.",
    image: "src/images/fresh.svg",
  },
  {
    title: "Support Local Farmers",
    description:
      "By buying directly from farmers, you're supporting local agriculture and communities.",
    image: "src/images/local.svg",
  },
  {
    title: "Transparent Supply Chain",
    description:
      "Know exactly where your food comes from and how it was grown.",
    image: "src/images/supply.svg",
  },
  {
    title: "Competitive Prices",
    description:
      "Enjoy fair prices for high-quality produce without middleman markups.",
    image: "src/images/competitive.svg",
  },
];

const ConsumerBenefits = () => {
  return (
    <section id="about" className="py-20 bg-green-50">
      <div className="container mx-auto px-6 hover:">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 ">
          Benefits for Consumers
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md text-center transition ease-in-out delay-50 hover:bg-green-100 transition-all duration-50"
            >
              <img
                src={benefit.image}
                alt={benefit.title}
                width={150}
                height={150}
                className="mx-auto mb-4 rounded-full"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsumerBenefits;
