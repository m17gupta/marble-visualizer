import { InspirationImageModel } from '@/models/inspirational/Inspirational';
import { RootState } from '@/redux/store';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SidebarObject from './SidebarObject';
import { addInspirationImage, updateInspirationNames } from '@/redux/slices/visualizerSlice/genAiSlice';
import ImageQuality from './ImageQuality';
import ExteriorSeg from './ExteriorSeg';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import InspirationImages from './InspirationImages';
// const tabs = [{ id: 0, name: 'All' }];

const StyleAndRenovationPanel: React.FC = () => {

  const { Inspirational_images } = useSelector((state: RootState) => state.inspirationalImages);




  // useEffect(() => {
  //   if(Inspirational_images && Inspirational_images.length > 0) {
  //     setStylesToShow(Inspirational_images);
  //   } else if (Inspirational_images && Inspirational_images.length === 0) {
  //     console.warn('No inspirational images available');
  //     setStylesToShow([]);
  //   }
  // }, [Inspirational_images]);



  return (
    <div className="mx-auto p-1 space-y-6 py-1 px-2">
      {/* Tabs */}
      <div className="bg-white border rounded-xl p-3">
        <h3 className="font-semibold text-lg mb-3" >1. Choose Your Preferred Style</h3>
        <InspirationImages />
      </div>

      {/* Additional Sections */}
      <ImageQuality />
      <SidebarObject />
      <ExteriorSeg />
    </div>
  );
};

export default StyleAndRenovationPanel;
