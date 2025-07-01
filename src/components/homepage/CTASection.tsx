import React from 'react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Transform Your Space?
        </h2>
        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
          Join thousands of homeowners, realtors, and designers using AI to create stunning spaces in seconds.
          Start your renovation journey today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 font-semibold">
            <a href="/signup">Start Free Trial</a>
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
