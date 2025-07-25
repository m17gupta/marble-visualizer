import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import dzinlylogo from "../../../public/assets/image/dzinly-logo.svg";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img className="w-44 h-16" src={dzinlylogo} alt="dzinly logo" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a>
            <Button variant="outline" className="mr-2">
              <a href="/login">Sign In</a>
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <a href="/workspace" className='text-white'>Get Started</a>
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 focus:outline-none"
              aria-label="Toggle Mobile Menu"
            >
              <div className="w-6 h-6 relative">
                <span
                  className={`block absolute h-0.5 w-6 bg-gray-800 transform transition duration-300 ease-in-out ${
                    mobileMenuOpen ? 'rotate-45 top-2.5' : 'top-1'
                  }`}
                />
                <span
                  className={`block absolute h-0.5 w-6 bg-gray-800 transition-all duration-300 ease-in-out ${
                    mobileMenuOpen ? 'opacity-0' : 'top-2.5'
                  }`}
                />
                <span
                  className={`block absolute h-0.5 w-6 bg-gray-800 transform transition duration-300 ease-in-out ${
                    mobileMenuOpen ? '-rotate-45 top-2.5' : 'top-4'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 space-y-4 pb-4">
            <a href="#features" className="block text-gray-600 hover:text-gray-900">Features</a>
            <a href="#pricing" className="block text-gray-600 hover:text-gray-900">Pricing</a>
            <a href="#testimonials" className="block text-gray-600 hover:text-gray-900">Reviews</a>
            <a href="/login" className="block text-gray-600 hover:text-gray-900">Sign In</a>
            <a
              href="/workspace"
              className="block text-center text-white px-4 py-2 rounded bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-colors"
            >
              Get Started
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
