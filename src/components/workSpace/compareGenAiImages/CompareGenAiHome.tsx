import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import CompareSlider from './CompareSlider';
import SideBySideCompare from './SideBySideCompare';
import AllGenAiImages from './AllGenAiImages';

const CompareGenAiHome: React.FC = () => {
  const { genAiImages } = useSelector((state: RootState) => state.genAi);
  
  const [showCompareView, setShowCompareView] = useState(true);
  const selectedGeneratedImage = useRef<string | null>(null);
  
  // Original house image from the request
  const originalHouseImage = useRef<string | null>(null);

  useEffect(() => {
    if(genAiImages.length > 0) {

      //  sort the genAiImages based on created at lasted come st first
      genAiImages.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
      selectedGeneratedImage.current = genAiImages[0].output_image;
      originalHouseImage.current = genAiImages[0].master_image_path;
    
    }
  }, [genAiImages]);


  
  // Handle close compare view
  const handleCloseCompare = () => {
    console.log('Closing compare view');
    setShowCompareView(false);
  };
  
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');

  // Toggle view mode between side-by-side and slider
  const handleToggleViewMode = (mode: 'slider' | 'side-by-side') => {
    setViewMode(mode);
  };

  return (
    <div className="flex flex-col h-full w-full p-6 bg-gray-100">
      <button
      onClick={handleInspirationSection}>
        back to Inspiration
      </button>
      {/* View mode tabs */}
      {showCompareView && selectedGeneratedImage && (
        <div className="flex justify-center mb-4 absolute top-8 left-96 right-0 z-40">
          <div className="inline-flex gap-2 rounded-lg overflow-hidden">
            <button 
              className={`px-4 py-2 text-sm ${viewMode === 'side-by-side' ? 'bg-blue-50 text-blue-600 font-medium' : 'bg-white text-gray-700'}`}
              onClick={() => handleToggleViewMode('side-by-side')}
            >
              Side by Side
            </button>
            <button 
              className={`px-4 py-2 text-sm ${viewMode === 'slider' ? 'bg-blue-50 text-blue-600 font-medium' : 'bg-white text-gray-700'}`}
              onClick={() => handleToggleViewMode('slider')}
            >
              Slider
            </button>
          </div>
        </div>
      )}

      {/* Conditional rendering of compare view or image gallery */}
      {showCompareView && selectedGeneratedImage.current ? (
        <div className="h-[500px] mb-6">
          {originalHouseImage.current &&
          selectedGeneratedImage.current  &&
          viewMode === 'slider' ? (
            <CompareSlider
              beforeImage={originalHouseImage.current }
              afterImage={selectedGeneratedImage.current }
              onClose={handleCloseCompare}
            />
          ) : (
            <SideBySideCompare
              beforeImage={originalHouseImage.current ?? ""}
              afterImage={selectedGeneratedImage.current ?? ""}
              onClose={handleCloseCompare}
            />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[300px] bg-gray-100 mb-6 rounded-lg">
          <div className="text-center">
            <p className="text-xl font-medium mb-2">Select a Design to Compare</p>
            <p className="text-gray-600">
              Choose one of the generated designs below to see a comparison with your original house.
            </p>
          </div>
        </div>
      )}
      
      {/* Generated images gallery */}
      <AllGenAiImages
        // onSelectImage={handleSelectImage}
        // onGenerateMore={handleGenerateMore}
      />
    </div>
  );
};

export default CompareGenAiHome;
