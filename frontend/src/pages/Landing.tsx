import Header from "../components/Landing/Headers";
import Hero from "../components/Landing/Hero";
import Features from "../components/Landing/Features";
import ConsumerBenefits from "../components/Landing/ConsumerBenefits";
import CTA from "../components/Landing/CTA";

export default function Landing() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <ConsumerBenefits />
      <CTA />
    </main>
  );
}
