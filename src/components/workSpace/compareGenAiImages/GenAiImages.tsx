import { GenAiChat } from '@/models/genAiModel/GenAiModel';
import { updateGeneratedImage, updateOriginalHouseImage } from '@/redux/slices/visualizerSlice/genAiSlice';
import { setIsGenerated, updateActiveTab } from '@/redux/slices/visualizerSlice/workspaceSlice';
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react'

import { IoCheckmarkCircle } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
const GenAiImages = () => {
    console.log('GenAiImages component mounted/rendered');

    const dispatch = useDispatch();
    const { genAiImages, loading, error, isFetchingGenAiImages } = useSelector((state: RootState) => state.genAi);
    
    const [selectedImageId] = useState<string | null>(null);
    const [allGenAiImages, setAllGenAiImages] = useState<GenAiChat[]>([]);
    const [componentError, setComponentError] = useState<string | null>(null);

    // Update all GenAiImages
    useEffect(() => {
        try {
            console.log('GenAiImages useEffect - genAiImages changed:', genAiImages);
            if(genAiImages && genAiImages.length > 0) {
                // Sort the genAiImages based on created date, latest first
                const sortedImages = [...genAiImages].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
                setAllGenAiImages(sortedImages);
                console.log('GenAiImages - sorted images set:', sortedImages);
            } else {
                setAllGenAiImages([]);
                console.log('GenAiImages - no images available, setting empty array');
            }
            setComponentError(null);
        } catch (err) {
            console.error('Error in GenAiImages useEffect:', err);
            setComponentError(err instanceof Error ? err.message : 'Unknown error');
        }
    }, [genAiImages]);
    

    const handleImageSelect = (imageSet: GenAiChat) => {
           console.log('Image selected:', imageSet);
           // const imageId = `${imageSet.id}-${index}`;
              dispatch(setIsGenerated(true))
              dispatch(updateActiveTab('insipiration'));
              dispatch(updateGeneratedImage(imageSet.output_image));
              dispatch(updateOriginalHouseImage(imageSet.master_image_path));
              // If you want to toggle selection, uncomment the line below
          //  setSelectedImageId(prevId => prevId === imageId ? null : imageId);
        };
    


  return (
    <div className="genai-images-container border border-gray-200 rounded-lg p-4 bg-white">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Generated AI Images</h3>
      
      {/* Show error state */}
      {(error || componentError) && (
        <div className="flex items-center justify-center p-4 text-red-500 bg-red-50 rounded-lg mb-4">
          <p className="text-sm">Error: {error || componentError}</p>
        </div>
      )}

      {/* Show loading state */}
      {isFetchingGenAiImages && (
        <div className="flex items-center justify-center p-4 text-gray-500">
          <p className="text-sm">Loading images...</p>
        </div>
      )}

      <div className="flex grid-cols-1 gap-6">
        {/* Show empty state */}
        {!isFetchingGenAiImages && genAiImages.length === 0 && (
          <div className="flex items-center justify-center p-4 text-gray-500">
            <p className="text-sm">No generated images available</p>
          </div>
        )}
        
        {/* Render images if available */}
        {allGenAiImages && allGenAiImages.length > 0 && 
          allGenAiImages.map((imageSet, index) => (
            <div key={imageSet.id} className="space-y-4">
              <div className="relative group rounded-md">
                <img 
                  src={imageSet.output_image} 
                  alt={`Generated Image ${index + 1}`} 
                  width={100}
                  height={100}
                  className='rounded-lg cursor-pointer hover:opacity-80 transition-opacity'
                  onClick={() => handleImageSelect(imageSet)}
                  onError={(e) => {
                    console.error('Image failed to load:', imageSet.output_image);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {/* Checkmark overlay for selected image */}
                {selectedImageId === `${imageSet}-${index}` && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <IoCheckmarkCircle className="text-white text-3xl" />
                  </div>
                )}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default GenAiImages