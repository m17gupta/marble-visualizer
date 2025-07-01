import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PricingSection = () => {
  const pricingPlans = [
    {
      name: 'Starter',
      price: 13,
      period: 'month',
      credits: 300,
      features: [
        '300 Credits / month',
        'Access to all (100+) styles',
        'Residential interior & exterior',
        '10 seconds turnaround',
        'Unlimited cloud storage',
        'Watermark included'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: 24,
      period: 'month',
      credits: 700,
      features: [
        '700 Credits / month',
        'Commercial spaces & styles',
        'Early access to new features',
        'Commercial license',
        '10 seconds turnaround',
        'No watermark'
      ],
      popular: true
    },
    {
      name: 'Business',
      price: 99,
      period: 'month',
      credits: 3000,
      features: [
        '3000 Credits / month',
        'Ultra Quality 4K renders',
        'Priority support',
        'API access on request',
        'Dedicated customer success',
        'Custom watermark'
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600">
            Start renovating your space with our advanced AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`relative shadow-xl border-0 ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ${plan.price}
                  <span className="text-lg text-gray-600 font-normal">/{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.credits} Credits / month</p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full py-3 text-lg font-semibold ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
