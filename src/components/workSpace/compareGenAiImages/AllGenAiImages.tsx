import React, { useState } from 'react';

import { IoCheckmarkCircle } from "react-icons/io5";


const AllGenAiImage = () => {
 
//   
const  genAiImages=[
    "https://testvizualizer.s3.us-east-2.amazonaws.com/uploads/images/2025/06/26/styled_output_52f90df66fb8433e91a6c746f98c9d67+(1)_1750935293877_qebgfh.png",
    "https://testvizualizer.s3.us-east-2.amazonaws.com/uploads/images/2025/06/26/styled_output_52f90df66fb8433e91a6c746f98c9d67+(1)_1750935293877_qebgfh.png"
]
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Design Variations</h2>
      
      {/* Generated images grid */}
      <div className="grid grid-cols-1 gap-6">
        {genAiImages.map((imageSet, index) => (
          <div key={imageSet || index} className="space-y-4">
          
            <div className="relative group">
              <img 
                src={imageSet} 
                alt={`Generated Image ${index + 1}`} 
                width={100}
                height={100}
                //className={`w-full h-64 object-cover rounded-lg cursor-pointer ${selectedImageId === `${imageSet.id}-${index}` ? 'border-2 border-blue-500' : ''}`}
               // onClick={() => handleImageSelect(imageSet, index)}
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
      
      {/* Empty state */}
      {/* {genAiImages.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-5xl mb-4">🏠</div>
          <h3 className="text-xl font-medium mb-2">No designs generated yet</h3>
          <p className="text-gray-600 max-w-md">
            Add a photo of your house, select a style preference, and click "Visualize" to see AI-generated design options.
          </p>
        </div>
      )} */}
      
      {/* Loading state */}
      {/* {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Generating designs...</p>
        </div>
      )} */}
      
      {/* Cancel and Save & Continue buttons */}
      <div className="mt-6 flex justify-between">
        <button 
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        
        <button 
          className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:bg-gray-300 disabled:text-gray-500"
          disabled={!selectedImageId}
        >
          Save & Continue To Next Step
        </button>
      </div>
    </div>
  );
};

export default AllGenAiImage;
