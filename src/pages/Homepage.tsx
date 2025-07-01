import React from 'react';
import Navigation from '@/components/homepage/Navigation';
import HeroSection from '@/components/homepage/HeroSection';
import FeaturesSection from '@/components/homepage/FeaturesSection';
import HowItWorksSection from '@/components/homepage/HowItWorksSection';
import TestimonialsSection from '@/components/homepage/TestimonialsSection';
import PricingSection from '@/components/homepage/PricingSection';
import CTASection from '@/components/homepage/CTASection';
import Footer from '@/components/homepage/Footer';

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
    </div>
  );
};

export default Homepage;