import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: 'Upload Photo',
      description: 'Upload a photo of your room or space that you want to renovate',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      number: 2,
      title: 'Describe Vision',
      description: 'Describe your renovation goals or choose from our design styles',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      number: 3,
      title: 'Get Results',
      description: 'Our AI generates stunning renovation visuals in seconds',
      gradient: 'from-pink-500 to-red-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How Dzinly Works
          </h2>
          <p className="text-xl text-gray-600">
            Transform your space in 3 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold`}>
                {step.number}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 text-lg">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
