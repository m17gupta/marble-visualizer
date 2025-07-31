import { InspirationImageModel } from '@/models/inspirational/Inspirational';
import { RootState } from '@/redux/store';
import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SidebarObject from './SidebarObject';
import { addInspirationImage, updateInspirationNames } from '@/redux/slices/visualizerSlice/genAiSlice';
import ImageQuality from './ImageQuality';
import ExteriorSeg from './ExteriorSeg';

const tabs = [
  { id: 0, name: 'All' }
];

// const renovationLevels = ['Tweak', 'Enhance', 'Renovate', 'Transform'];

const StyleAndRenovationPanel: React.FC = () => {

  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [level, setLevel] = useState(2); // Renovate
  const { inspirational_colors } = useSelector((state: RootState) => state.inspirationalColors);

  const { Inspirational_images } = useSelector((state: RootState) => state.inspirationalImages);

  const stylesToShow = useRef<InspirationImageModel[]>(Inspirational_images);

  const handleTabColor = async (tabId: number) => {
    setIsLoading(true);
    setActiveTab(tabId);

    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 100));

    stylesToShow.current = [];
    stylesToShow.current = Inspirational_images.filter((item) => item.color_family_id === tabId);

    setIsLoading(false);
  }
  const handleAllTabImage = async () => {
    setIsLoading(true);
    setActiveTab(0);

    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 100));

    stylesToShow.current = Inspirational_images;

    setIsLoading(false);
  };

  // Initialize images when component mounts
  useEffect(() => {
    stylesToShow.current = Inspirational_images;
  }, [Inspirational_images]);


  const handleInspirationImage = (image: string, name: string) => {
    dispatch(updateInspirationNames(name));
    dispatch(addInspirationImage(image));
  };
  return (
    <div className=" mx-auto p-1 space-y-6 py-1 px-2">
      {/* Tabs */}


      {/* Style Card */}
      <div className="bg-white border rounded-xl p-3">
        <h3 className="font-semibold text-lg mb-3">1. Choose Your Preferred Style</h3>
        <div className="flex flex-wrap gap-2 justify-start mb-4">

          <button
            key={tabs[0].id}
            onClick={handleAllTabImage}
            className={`px-4 py-1 rounded-full text-sm ${activeTab === 0
              ? 'bg-purple-200 text-purple-900 font-semibold'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
          >
            {tabs[0].name}
          </button>

          {inspirational_colors &&
            inspirational_colors.length > 0 &&
            inspirational_colors.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  handleTabColor(Number(tab.id));
                }}
                className={`px-4 py-1 rounded-full text-sm ${activeTab === Number(tab.id)
                  ? 'bg-purple-200 text-purple-900 font-semibold'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
              >
                {tab.name}
              </button>
            ))}
        </div>


        <div className="grid grid-cols-3 gap-2">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            ))
          ) : (
            stylesToShow.current
              .slice(0, showAll ? stylesToShow.current.length : 9)
              .map((style, i) => (
                <div key={i} className="flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-105 object-cover"
                  onClick={() => handleInspirationImage(style.image, style.name)}>
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-24 h-24 object-cover rounded-xl "
                  />
                </div>
              ))
          )}
        </div>

        {/* Show More */}
        {!isLoading && stylesToShow.current.length > 9 && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-800 flex items-center gap-1 transition-colors"
            >
              <span>{showAll ? 'Show Less' : 'Show More'}</span>
              <span className={`transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
          </div>
        )}

        {/* CTA */}

      </div>

      {/* Renovation Spectrum */}

      <ImageQuality />
      <SidebarObject />
      <ExteriorSeg />


    </div>
  );
};

export default StyleAndRenovationPanel;
