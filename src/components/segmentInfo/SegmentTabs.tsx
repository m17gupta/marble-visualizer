import React from 'react';
import { SegmentTabsProps, TabType } from './types';

export const SegmentTabs: React.FC<SegmentTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'information', label: 'Information' },
    { id: 'jsonData', label: 'JSON Data' },
    // { id: 'groundTruthValue', label: 'Ground Truth Value' }
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8 " aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-2 px-4 bg-transparent focus:outline-none focus:ring-0 border-0 rounded-none border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? 'border-blue-500 text-black '
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};