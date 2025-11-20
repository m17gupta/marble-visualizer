import React, { useState } from 'react';
import { SegmentImageProps } from './types';
import { Check, Copy } from 'lucide-react';

export const SegmentImage: React.FC<SegmentImageProps> = ({
  imageUrl,
  alt = 'Segment Image',
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

const handleCopys = async () => {
    if (!imageUrl) return;
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopy = async () => {
    if (!imageUrl) return; 
    try {
      await navigator.clipboard.writeText (imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  if (!imageUrl) {
    return (
      <div className={`w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg ${className}`}>
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }

  return (
    <div className={`space-y-2 border p-2 rounded-md h-full mt-4 ${className}`}>
      <div className="text-sm font-medium text-gray-700 flex items-center justify-between">
        <h5>Image</h5>
         <button className="p-1 text-gray-500 hover:text-green-600 transition-colors" onClick={handleCopys} title="Copy">
            {copied ? (
             <Check size={16} className="text-green-600" /> 
                ) : (
             <Copy size={16} />
             )}
          </button>
        </div>
      
      {/* Image URL Display */}
      <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded font-mono break-all">
        {imageUrl}
      </div>
      
      {/* Image Preview */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-auto max-h-96 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span class="text-gray-500">Failed to load image</span>
                </div>
              `;
            }
          }}
        />
      </div>
    </div>
  );
};