import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import CompareSlider from './CompareSlider';
import SideBySideCompare from './SideBySideCompare';
import AllGenAiImages from './AllGenAiImages';
import { setIsGenerated } from '@/redux/slices/visualizerSlice/workspaceSlice';
import { resetRequest, updateGeneratedImage, updateOriginalHouseImage } from '@/redux/slices/visualizerSlice/genAiSlice';
import { GenAiChat } from '@/models/genAiModel/GenAiModel';

const CompareGenAiHome: React.FC = () => {
  const dispatch = useDispatch()

  const { genAiImages } = useSelector((state: RootState) => state.genAi);
  const { generatedImage, originalHouseImage } = useSelector((state: RootState) => state.genAi);
  const [showCompareView, setShowCompareView] = useState(true);
  const selectedGeneratedImage = useRef<string | null>(null);


  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [allGenAiImages, setAllGenAiImages] = useState<GenAiChat[]>(genAiImages);

  // update all GenAiImages
  useEffect(() => {
    if (genAiImages.length > 0) {
      // Sort the genAiImages based on created date, latest first
      const sortedImages = [...genAiImages].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
      setAllGenAiImages(sortedImages);
    }
  }, [genAiImages]);

  useEffect(() => {
    if (allGenAiImages && allGenAiImages.length > 0 && !isAuthenticated) {

      dispatch(updateGeneratedImage(allGenAiImages[0].output_image));
      dispatch(updateOriginalHouseImage(allGenAiImages[0].master_image_path));


    }
  }, [allGenAiImages, isAuthenticated])



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

  const handleInspirationSection = () => {
    dispatch(setIsGenerated(false));
    dispatch(resetRequest())
  }
  return (
    <div className="flex flex-col h-full w-full p-6 bg-gray-100">
      <button
        onClick={handleInspirationSection}>
        back to Inspiration
      </button>
      {/* View mode tabs */}
      {showCompareView && originalHouseImage && (
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
      {showCompareView && originalHouseImage ? (
        <div className="h-[500px] mb-6">
          {originalHouseImage &&
            generatedImage &&
            viewMode === 'slider' ? (
            <CompareSlider
              // beforeImage={originalHouseImage.current }
              // afterImage={selectedGeneratedImage.current }
              onClose={handleCloseCompare}
            />
          ) : (
            <SideBySideCompare
              beforeImage={originalHouseImage ?? ""}
              afterImage={generatedImage ?? ""}
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
