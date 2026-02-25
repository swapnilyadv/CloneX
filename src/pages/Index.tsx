import Navbar from "@/components/Navbar";
import Hero from "@/components/landing/Hero";
import AboutSection from "@/components/landing/AboutSection";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Tips from "@/components/landing/Tips";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <AboutSection />
      <Features />
      <HowItWorks />
      <Tips />
      <Footer />
    </div>
  );
};

export default Index;
