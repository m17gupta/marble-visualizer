import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FeaturesSection = () => {
  const features = [
    {
      icon: '🎨',
      title: 'AI Renovate',
      description: 'Transform any space using advanced AI technology with photorealistic results'
    },
    {
      icon: '🪑',
      title: 'Virtual Staging',
      description: 'Add furniture, lighting & fixtures instantly for real estate professionals'
    },
    {
      icon: '📐',
      title: '2D to 3D',
      description: 'Transform elevations to realistic 3D renders in seconds'
    },
    {
      icon: '🔍',
      title: '4K Upscaling',
      description: 'Enhance blurry images to ultra-high 4K resolution'
    },
    {
      icon: '🏠',
      title: 'Exterior Design',
      description: 'Renovate exteriors with AI precision and unlimited creativity'
    },
    {
      icon: '✨',
      title: 'Object Removal',
      description: 'Remove unwanted objects effortlessly with intelligent AI'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            The Most Powerful AI Renovation Kit
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leverage advanced AI tools to renovate your space, exactly the way you want
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-md">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
