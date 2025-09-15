import React from 'react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
  <section className="py-20 bg-gradient-to-br from-yellow-400 via-white to-yellow-700 relative overflow-hidden">
      {/* Marble texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('/assets/marble/marble-after.jpg')] bg-cover bg-center pointer-events-none" />
  <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-marble-charcoal" style={{ fontFamily: 'serif' }}>
          Elevate Your Space with Luxury Marble
        </h2>
        <p className="text-xl text-marble-gray-dark mb-8 leading-relaxed font-medium">
          Experience world-class marble restoration, polishing, and protection. Let our experts transform your surfaces into timeless masterpieces. Get a free quote or visit our showroom today!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-gradient-to-r from-yellow-700 to-yellow-400 hover:from-yellow-800 hover:to-yellow-500 text-lg px-8 py-4 font-semibold text-marble-charcoal shadow-lg">
            <a href="/quote">Get Free Quote</a>
          </Button>
          <Button size="lg" variant="outline" className="border-marble-gold text-marble-gold hover:bg-marble-gold hover:text-marble-white text-lg px-8 py-4 font-semibold">
            <a href="/showroom">Visit Showroom</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
