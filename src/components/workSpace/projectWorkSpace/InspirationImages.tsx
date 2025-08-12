import { InspirationImageModel } from '@/models/inspirational/Inspirational';
import { addInspirationImage, updateInspirationNames } from '@/redux/slices/visualizerSlice/genAiSlice';
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch, useSelector } from 'react-redux';

const tabs = [{ id: 0, name: 'All' }];
const InspirationImages = () => {
    const dispatch = useDispatch();
      const [activeTab, setActiveTab] = useState<number>(0);
      const [showAll, setShowAll] = useState(false);
      const [isLoading, setIsLoading] = useState(false);
      const [selectedImage, setSelectedImage] = useState<string | null>(null);
      const [stylesToShow, setStylesToShow] = useState<InspirationImageModel[]>([]);
    
      const { inspirational_colors } = useSelector((state: RootState) => state.inspirationalColors);
      const { Inspirational_images } = useSelector((state: RootState) => state.inspirationalImages);
    
      const handleTabColor = async (tabId: number) => {
        setIsLoading(true);
        setActiveTab(tabId);
        setStylesToShow(Inspirational_images.filter((item) => item.color_family_id === tabId));
        setIsLoading(false);
      };
    
      const handleAllTabImage = async () => {
        setIsLoading(true);
        setActiveTab(0);
        await new Promise((resolve) => setTimeout(resolve, 100));
        setStylesToShow(Inspirational_images);
        setIsLoading(false);
      };
    
      useEffect(() => {
        if(Inspirational_images && Inspirational_images.length > 0) {
          setStylesToShow(Inspirational_images);
        } else if (Inspirational_images && Inspirational_images.length === 0) {
          console.warn('No inspirational images available');
          setStylesToShow([]);
        }
      }, [Inspirational_images]);
    
      const handleInspirationImage = (image: string, name: string) => {
        dispatch(updateInspirationNames(name));
        dispatch(addInspirationImage(image));
        setSelectedImage(image); // ✅ Set selected image
      };
  return (
    <>
     <div >
        {/* <h3 className="font-semibold text-lg mb-3" >1. Choose Your Preferred Style</h3> */}
        <div className="flex flex-wrap gap-2 justify-start mb-4">
          <button
            key={tabs[0].id}
            onClick={handleAllTabImage}
            className={`px-4 py-1 rounded-full text-sm ${
              activeTab === 0
                ? 'bg-purple-200 text-purple-900 font-semibold'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {tabs[0].name}
          </button>

          {inspirational_colors?.map((tab) => {
            if(tab.is_commercial==1) return null; // Skip commercial tabs
            return (
              <button
                key={tab.id}
                onClick={() => handleTabColor(Number(tab.id))}
                className={`px-4 py-1 rounded-full text-sm ${
                    activeTab === Number(tab.id)
                  ? 'bg-purple-200 text-purple-900 font-semibold'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {tab.name}
            </button>
          )})}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[100vh] sm:max-h-[100vh]
 ">
      {stylesToShow
  .slice(0, showAll ? stylesToShow.length : 9)
  .map((style: InspirationImageModel, i: number) => (
    <div
      key={i}
      onClick={() => handleInspirationImage(style?.dp??"", style.name??"")}
      className={`relative flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-105 rounded-xl border-2 ${
        selectedImage === style.dp
          ? 'border-green-500 scale-105 '
          : 'border-transparent'
      }`}
    >
      <LazyLoadImage
        src={style.dp}
        alt={style.name}
        className="w-26 h-26 object-cover rounded-xl"
      />

      {/* ✅ Green Circular Checkbox Centered */}
      {selectedImage === style.dp && (
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="bg-green-500 text-white rounded-full p-[6px] w-8 h-8 flex items-center justify-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
))}

        </div>

        {/* Show More */}
        {!isLoading && stylesToShow.length > 9 && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-800 flex items-center gap-1 transition-colors"
            >
              <span>{showAll ? 'Show Less' : 'Show More'}</span>
              <span
                className={`transition-transform duration-200 ${
                  showAll ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default InspirationImages