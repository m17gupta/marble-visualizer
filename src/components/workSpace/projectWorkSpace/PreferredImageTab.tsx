import { InspirationImageModel } from '@/models/inspirational/Inspirational';
import { RootState } from '@/redux/store';
import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const tabs = [
  { id: 0, name: 'All' }
];

// const renovationLevels = ['Tweak', 'Enhance', 'Renovate', 'Transform'];

const StyleAndRenovationPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showAll, setShowAll] = useState(false);
  // const [level, setLevel] = useState(2); // Renovate
  const { inspirational_colors } = useSelector((state: RootState) => state.inspirationalColors);

  const { Inspirational_images } = useSelector((state: RootState) => state.inspirationalImages);
  
  const stylesToShow = useRef<InspirationImageModel[]>([]);

  const handleTabColor = (tabId: number) => {
    console.log('Tab ID:', tabId);
    setActiveTab(tabId);
    stylesToShow.current = Inspirational_images.filter((item) => item.color_family_id === tabId);
  }
  const handleAllTabImage = () => {
    setActiveTab(0);
    stylesToShow.current = Inspirational_images;
  };

  // Initialize images when component mounts
  useEffect(() => {
    stylesToShow.current = Inspirational_images;
  }, [Inspirational_images]);
  
  return (
    <div className="max-w-md mx-auto p-1 space-y-6">
      {/* Tabs */}


      {/* Style Card */}
      <div className="bg-white border rounded-xl p-4">

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


        <div className="grid grid-cols-3 gap-4">
          {
            stylesToShow.current
              .slice(0, showAll ? stylesToShow.current.length : 9)
              .map((style, i) => (
                <div key={i} className="flex flex-col items-center">
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-32 object-cover rounded-2xl shadow"
                />
                <span className="text-sm text-gray-800 mt-1 text-center truncate w-full">
                  {style.name}
                </span>
              </div>
            ))}
        </div>

        {/* Show More */}
        {stylesToShow.current.length > 9 && (
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

      {/* Preserve Objects */}
      <div className="bg-white border rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-lg">3. Preserve Objects</h3>
        <p className="text-sm text-gray-600">
          If you want to preserve some parts of the original image, you can scan the objects and preserve the original image.
        </p>
        <button
          className="w-full mt-3 py-2 border border-gray-300 rounded-xl text-sm text-blue-700 hover:bg-gray-50 transition"
        >
          Preserve Objects
        </button>
      </div>
    </div>
  );
};

export default StyleAndRenovationPanel;
