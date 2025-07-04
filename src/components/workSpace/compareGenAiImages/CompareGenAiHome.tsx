import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import CompareSlider from './CompareSlider';
import SideBySideCompare from './SideBySideCompare';
import AllGenAiImages from './AllGenAiImages';

const CompareGenAiHome: React.FC = () => {
  const { requests } = useSelector((state: RootState) => state.genAi);
  
  const [showCompareView, setShowCompareView] = useState(true);
  const [selectedGeneratedImage, setSelectedGeneratedImage] = useState<string>("https://testvizualizer.s3.us-east-2.amazonaws.com/uploads/images/42/styled_output_52f90df66fb8433e91a6c746f98c9d67 (1)_1751621500813_0bpn0m.png");
  
  // Original house image from the request
  const originalHouseImage = requests.houseUrl.length > 0 ? requests.houseUrl[0] : 'https://testvizualizer.s3.us-east-2.amazonaws.com/uploads/images/2025/06/26/styled_output_52f90df66fb8433e91a6c746f98c9d67+(1)_1750935293877_qebgfh.png';
  
  // Handle selecting an image from the generated variants
  // const handleSelectImage = (imageUrl: string) => {
  //   setSelectedGeneratedImage(imageUrl);
  //   setShowCompareView(true);
  // };
  
  // // Handle generate more variants
  // const handleGenerateMore = () => {
  //   // Here you would dispatch an action to generate more variants
  //   console.log('Generating more variants...');
  // };
  
  // Handle close compare view
  const handleCloseCompare = () => {
    setShowCompareView(false);
  };
  
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');

  // Toggle view mode between side-by-side and slider
  const handleToggleViewMode = (mode: 'slider' | 'side-by-side') => {
    setViewMode(mode);
  };

  return (
    <div className="flex flex-col h-full">
      {/* View mode tabs */}
      {showCompareView && selectedGeneratedImage && (
        <div className="flex justify-center mb-4">
          <div className="inline-flex border border-gray-200 rounded-lg overflow-hidden">
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
      {showCompareView && selectedGeneratedImage ? (
        <div className="h-[500px] mb-6">
          {viewMode === 'slider' ? (
            <CompareSlider
              beforeImage={originalHouseImage}
              afterImage={selectedGeneratedImage}
              onClose={handleCloseCompare}
            />
          ) : (
            <SideBySideCompare
              beforeImage={originalHouseImage}
              afterImage={selectedGeneratedImage}
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
