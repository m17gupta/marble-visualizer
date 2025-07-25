// src/components/ui/LoadingOverlay.tsx
import React from 'react';

const LoadingOverlay: React.FC<{ message?: string }> = ({ message }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500 mb-4"></div>
      <span className="text-white text-lg font-semibold">{message || "Processing..."}</span>
    </div>
  </div>
);

export default LoadingOverlay;