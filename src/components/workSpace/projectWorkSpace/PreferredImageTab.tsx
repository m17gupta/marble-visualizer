import React, { useState } from 'react';

const tabs = [
  'All', 'Blacks', 'Blues', 'Grays'
];

const stylesByTab: Record<string, { src: string; label: string }[]> = {
  Blacks: [
    { src: 'https://i.imgur.com/f3gVnQ3.png', label: 'Modern' },
    { src: 'https://i.imgur.com/mLaLqzH.png', label: 'Urban' },
    { src: 'https://i.imgur.com/QlF2LVj.png', label: 'Contemporary' },
  ],
  Blues: [
    { src: 'https://i.imgur.com/V8xTe9O.png', label: 'Scandinavian' },
    { src: 'https://i.imgur.com/xFbNs9I.png', label: 'Digital Nomad' },
    { src: 'https://i.imgur.com/B1RfGQk.png', label: 'Maximalist' },
  ],
  Grays: [
    { src: 'https://i.imgur.com/6ftkCE5.png', label: 'French Provincial' },
    { src: 'https://i.imgur.com/NHgTR1d.png', label: 'English Country' },
    { src: 'https://i.imgur.com/EWf4sqO.png', label: 'Baroque' },
  ]
};

const renovationLevels = ['Tweak', 'Enhance', 'Renovate', 'Transform'];

const StyleAndRenovationPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Blacks');
  const [showAll, setShowAll] = useState(false);
  const [level, setLevel] = useState(2); // Renovate

  const allStyles = activeTab === 'All'
    ? Object.values(stylesByTab).flat()
    : stylesByTab[activeTab] || [];

  const stylesToShow = showAll ? allStyles : allStyles.slice(0, 6);

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setShowAll(false); // reset when tab changes
            }}
            className={`px-4 py-1 rounded-full text-sm ${
              activeTab === tab
                ? 'bg-purple-200 text-purple-900 font-semibold'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Style Card */}
      <div className="bg-white border rounded-xl p-4">
        <div className="grid grid-cols-3 gap-4">
          {stylesToShow.map((style, i) => (
            <div key={i} className="flex flex-col items-center">
              <img
                src={style.src}
                alt={style.label}
                className="w-full h-32 object-cover rounded-2xl shadow"
              />
              <span className="text-sm text-gray-800 mt-1 text-center truncate w-full">
                {style.label}
              </span>
            </div>
          ))}
        </div>

        {/* Show More */}
        {allStyles.length > 6 && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-black flex items-center gap-1"
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
