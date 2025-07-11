import { GenAiChat } from '@/models/genAiModel/GenAiModel';
import { setIsGenerated, updateActiveTab } from '@/redux/slices/visualizerSlice/workspaceSlice';
import { RootState } from '@/redux/store';
import React, { useState } from 'react'

import { IoCheckmarkCircle } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
const GenAiImages = () => {

    const dispatch = useDispatch();
      const { genAiImages } = useSelector((state: RootState) => state.genAi);
      
      const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
        
    const handleImageSelect = (imageSet: GenAiChat, index: number) => {
            const imageId = `${imageSet.id}-${index}`;
              dispatch(setIsGenerated(true))
              dispatch(updateActiveTab('insipiration'));
            setSelectedImageId(prevId => prevId === imageId ? null : imageId);
        };
    
  return (
    <div className="flex grid-cols-1 gap-6">
        {genAiImages.map((imageSet, index) => (
          <div key={imageSet.id} className="space-y-4">
          
            <div className="relative group rounded-md">
              <img 
                src={imageSet.output_image} 
                alt={`Generated Image ${index + 1}`} 
                width={100}
                height={100}
                className='rounded-lg'
                //className={`w-full h-64 object-cover rounded-lg cursor-pointer ${selectedImageId === `${imageSet.id}-${index}` ? 'border-2 border-blue-500' : ''}`}
             onClick={() => handleImageSelect(imageSet, index)}
              />
              
              {/* Checkmark overlay for selected image */}
              {selectedImageId === `${imageSet}-${index}` && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <IoCheckmarkCircle className="text-white text-3xl" />
                </div>
              )}
            </div>
            
            
                               
           
          </div>
        ))}
      </div>
  )
}

export default GenAiImages