import React from "react";
import Navigation from "@/components/homepage/Navigation";
import HeroSection from "@/components/homepage/HeroSection";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import HowItWorksSection from "@/components/homepage/HowItWorksSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import PricingSection from "@/components/homepage/PricingSection";
import CTASection from "@/components/homepage/CTASection";
import Footer from "@/components/homepage/Footer";
import MaterialData from "@/components/swatchBookData/materialData/MaterialData";
import GetPlanFeatures from "@/components/planfeatures/GetPlanFeatures";
import GetuserProfile from "../auth/login/GetuserProfile";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
      <MaterialData />
      <GetPlanFeatures />

      {/* get user Profile */}
      <GetuserProfile />
    </div>
  );
};

export default Homepage;
