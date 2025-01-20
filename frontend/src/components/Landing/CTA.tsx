import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section id="contact" className="bg-green-100 py-20">
      <div className="container mx-auto px-1 max-w-screen-lg">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 text-center md:text-left mb-8 md:mb-0"
          >
            <h2 className="text-3xl font-bold text-black mb-4">
              Ready to Transform Your Farming Business?
            </h2>
            <p className="text-xl text-black-300 mb-8">
              Join Farm2Market today and start selling directly to markets at
              fair prices. Our platform offers:
            </p>
            <ul className="text-black-100 mb-8 list-disc list-inside">
              <li>Easy-to-use marketplace interface</li>
              <li>Secure payment processing</li>
              <li>Real-time market insights</li>
              <li>Logistics support for deliveries</li>
            </ul>
            <Link
              to="/login"
              className="bg-white text-green-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-100 transition-colors duration-300"
            >
              Sign Up Now
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 ml-14"
          >
            <img
              src="/images/cta.svg"
              alt="Farmer using Farm2Market platform"
              width={400}
              height={200}
              className="rounded-lg shadow-sm"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
