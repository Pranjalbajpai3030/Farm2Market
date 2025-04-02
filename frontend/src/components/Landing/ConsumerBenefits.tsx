import { motion } from "framer-motion";

const benefits = [
  {
    title: "Fresh, Local Produce",
    description: "Savor the freshest picks straight from nearby farms.",
    image: "/images/fresh.svg",
  },
  {
    title: "Support Local Farmers",
    description: "Empower local agriculture with every purchase.",
    image: "/images/local.svg",
  },
  {
    title: "Transparent Supply Chain",
    description: "Trace your food’s journey from farm to table.",
    image: "/images/supply.svg",
  },
  {
    title: "Competitive Prices",
    description: "Quality produce at prices that make sense.",
    image: "/images/competitive.svg",
  },
];

const ConsumerBenefits = () => {
  return (
    <section id="about" className="py-24 bg-gradient-to-t from-green-100 to-white">
      <div className="container mx-auto px-6 max-w-screen-xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-16 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-green-500"
        >
          Why Choose Us?
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <motion.img
                src={benefit.image}
                alt={benefit.title}
                width={120}
                height={120}
                className="mx-auto mb-6 rounded-full border-4 border-teal-100 p-2"
                whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsumerBenefits;