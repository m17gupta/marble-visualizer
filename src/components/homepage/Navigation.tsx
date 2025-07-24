import React from 'react';
import { Button } from '@/components/ui/button';
import dzinlylogo from "../../../public/assets/image/dzinly-logo.svg";
const Navigation = () => {
  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
           <img className='w-44 h-16' src={dzinlylogo} alt='dzinly logo'></img>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a>
            <Button variant="outline" className="mr-2">
              <a href="/login">Sign In</a>
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <a href="/workspace" className="text-white">Get Started</a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
