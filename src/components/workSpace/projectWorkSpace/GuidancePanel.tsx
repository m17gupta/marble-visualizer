import React from 'react';

const GuidancePanel: React.FC = () => (
  <div className="p-4 bg-white">
    <h2 className="text-lg font-semibold mb-2">AI Guidance</h2>
    <textarea
      className="w-full p-2 border rounded mb-4"
      placeholder="Enter guidance..."
      rows={3}
    />
    <div className="flex flex-wrap gap-2 mb-4">
      <span className="px-2 py-1 bg-gray-200 rounded">change the color</span>
      <span className="px-2 py-1 bg-gray-200 rounded">Craftsman</span>
      <span className="px-2 py-1 bg-gray-200 rounded">Tudor</span>
      <span className="px-2 py-1 bg-gray-200 rounded">Queen Anne</span>
    </div>
    <div className="flex justify-between items-center">
      <button className="text-sm text-blue-600">History</button>
      <button className="text-sm text-blue-600">Add Inspiration</button>
      <button className="px-4 py-2 bg-blue-600 text-white rounded">Visualize</button>
    </div>
  </div>
);

export default GuidancePanel;
