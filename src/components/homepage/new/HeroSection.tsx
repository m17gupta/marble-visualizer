import React from 'react';
import { Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const HeroSection = () => {

  const navigator = useNavigate()
    const dispatch = useDispatch();
  const handleTryVisualizer = () => {
    navigator("/try-visualizer")
  }
  return (
    <section className=" py-20 relative overflow-hidden h-[90vh] flex items-center">
      <div className="absolute inset-0 opacity-20 bg-[url('/assets/marble/hero-images.png')] bg-cover bg-center pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-marble-charcoal mb-6 leading-tight">
            Plan your home renovation with{' '}
            <span className="bg-gradient-to-r from-yellow-700 to-yellow-400 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
          <p className="text-xl text-marble-gray-dark mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your space in seconds with AI-powered design. Upload a photo, describe your vision,
            and watch our advanced AI create stunning renovations that bring your dreams to life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-gradient-to-r from-yellow-700 to-yellow-400 hover:from-yellow-800 hover:to-yellow-500 text-lg px-8 py-4"
                 onClick={handleTryVisualizer}
            >
               Try Visualizer
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-yellow-700 text-yellow-700 hover:bg-yellow-700 hover:text-white">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-700 mb-2">1K+</div>
              <div className="text-marble-gray-dark">Renovations Daily</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-700 mb-2">50+</div>
              <div className="text-marble-gray-dark">Design Styles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-700 mb-2">10M</div>
              <div className="text-marble-gray-dark">Satisfied Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-700 mb-2">4.8⭐</div>
              <div className="text-marble-gray-dark">App Store Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
