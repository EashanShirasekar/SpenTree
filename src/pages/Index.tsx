import { useState, useEffect } from "react";
import PushkaraIntro from "@/components/PushkaraIntro";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorks from "@/components/HowItWorks";
import DailyTreeDemo from "@/components/DailyTreeDemo";
import ForestGrowth from "@/components/ForestGrowth";
import MobileAppSection from "@/components/MobileAppSection";
import FinalSection from "@/components/FinalSection";
import Footer from "@/components/Footer";

const Index = () => {

  const [showIntro, setShowIntro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem("spentree-intro-seen");

    if (!seen) {
      setShowIntro(true);
    }

    setLoading(false);
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem("spentree-intro-seen", "true");
    setShowIntro(false);
  };

  // 🔥 prevent blank flicker
  if (loading) return null;

  // 🔥 intro first
  if (showIntro) {
    return <PushkaraIntro onComplete={handleIntroComplete} />;
  }

  // 🔥 main site
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <DailyTreeDemo />
      <ForestGrowth />
      <MobileAppSection />
      <FinalSection />
      <Footer />
    </div>
  );
};

export default Index;