import React from "react";
import Navigation from "@/components/homepage/new/Navigation";
import HeroSection from "@/components/homepage/new/HeroSection";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import HowItWorksSection from "@/components/homepage/HowItWorksSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import PricingSection from "@/components/homepage/PricingSection";
import CTASection from "@/components/homepage/CTASection";
import Footer from "@/components/homepage/Footer";
import MaterialData from "@/components/swatchBookData/materialData/MaterialData";
import GetPlanFeatures from "@/components/planfeatures/GetPlanFeatures";
import GetuserProfile from "../auth/login/GetuserProfile";
import Template from "@/components/homepage/Template";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer /> */}
      <Template />
      <MaterialData />
      <GetPlanFeatures />

      {/* get user Profile */}
      <GetuserProfile />
    </div>
  );
};

export default Homepage;
