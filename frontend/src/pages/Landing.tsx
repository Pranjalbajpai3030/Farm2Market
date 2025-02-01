import Header from "../components/Landing/Headers";
import Hero from "../components/Landing/Hero";
import Features from "../components/Landing/Features";
import ConsumerBenefits from "../components/Landing/ConsumerBenefits";
import CTA from "../components/Landing/CTA";
import DemoVideo from "../components/Landing/DemoVideo";

export default function Landing() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <Hero />
      <DemoVideo/>
      <Features />
      <ConsumerBenefits />
     
      <CTA />
    </main>
  );
}
