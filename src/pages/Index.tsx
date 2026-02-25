import Navbar from "@/components/Navbar";
import Hero from "@/components/landing/Hero";
import AboutSection from "@/components/landing/AboutSection";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Tips from "@/components/landing/Tips";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {/* Global Background Dotted Grid */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <AboutSection />
        <Features />
        <HowItWorks />
        <Tips />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
