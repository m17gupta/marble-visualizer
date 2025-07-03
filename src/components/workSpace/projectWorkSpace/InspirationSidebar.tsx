import React from 'react';
import PreferredImageTab from './PreferredImageTab';

const styles = [
  'Modern', 'Traditional', 'Colonial',
  'Victorian', 'Craftsman', 'Tudor',
  'Cape Cod', 'Cottage', 'Queen Anne',
  'Contemporary', 'Industrial', 'Brutalist',
];

const InspirationSidebar: React.FC = () => (
  <div className="p-4 h-full overflow-auto">
    <h2 className="text-lg font-semibold mb-4">1. Choose Your Preferred Style</h2>
   

   <PreferredImageTab/>



    {/* <input
      type="text"
      placeholder="Search styles..."
      className="w-full mb-4 px-2 py-1 border rounded"
    /> */}
    {/* <div className="grid grid-cols-3 gap-4">
      {styles.map((style) => (
        <div key={style} className="relative cursor-pointer">
          <div className="w-full h-20 bg-gray-200 rounded-lg flex items-center justify-center">
            <img src="https://dzinly.com/files/inspirational-houses/blacks/black-01.jpg"></img>
            <span className="text-sm text-gray-600">{style}</span>
          </div>
        
        </div>
      ))}

     
    </div> */}
   
    {/* <p className="mt-2 text-xs text-gray-500">Want to design your own style for your business?</p> */}
  </div>
);

export default InspirationSidebar;
