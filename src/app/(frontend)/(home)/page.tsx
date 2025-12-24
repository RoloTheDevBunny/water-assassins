// src/app/(frontend)/(home)/page.tsx
import FaqSection from "@/app/(frontend)/(home)/_sections/FaqSection";
import FeaturesSection from "@/app/(frontend)/(home)/_sections/FeaturesSection";
import HeroSection from "@/app/(frontend)/(home)/_sections/HeroSection";
import HowItWorksSection from "@/app/(frontend)/(home)/_sections/HowItWorksSection";
import Navbar from "@/components/v1/Navbar";
import Footer from "./_sections/Footer";
import HomeClient from "@/components/v1/HomeClient";

export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />
      <main>
        {/* We wrap HeroSection here so it renders on the server 
            but is placed inside the client-side logic container */}
        <HomeClient>
          <HeroSection />
          <HowItWorksSection />
        </HomeClient>

        <section id="pricing" className="bg-gray-100 py-20">
          <FeaturesSection />
        </section>
        <FaqSection />
        <Footer />
      </main>
    </div>
  );
}