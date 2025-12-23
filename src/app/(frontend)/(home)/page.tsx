import FaqSection from "@/app/(frontend)/(home)/_sections/FaqSection";
import FeaturesSection from "@/app/(frontend)/(home)/_sections/FeaturesSection";
import HeroSection from "@/app/(frontend)/(home)/_sections/HeroSection";
import HowItWorksSection from "@/app/(frontend)/(home)/_sections/HowItWorksSection";
import Navbar from "@/components/v1/Navbar";

import Footer from "./_sections/Footer";

export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <section id="pricing" className="bg-gray-100 py-20">
          <FeaturesSection />
        </section>
        <FaqSection />
        <Footer />
      </main>
    </div>
  );
}
