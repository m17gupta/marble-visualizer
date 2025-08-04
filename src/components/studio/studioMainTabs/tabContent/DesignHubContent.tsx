import React from 'react'
import AllSegments from '../../segment/AllSegments'

import StudioSegmentsTabs from '../../../designHub/StudioSegmentsTabs';
import { SwatchRecommendations } from '@/components/swatch/SwatchRecommendations';
// import { SwatchRecommendations } from '@/components/swatch/SwatchRecommendations';

const DesignHubContent = () => {


  return (
    <>
      {/* All Segments - Left Side */}
        <div className="flex flex-row">
      <div className="flex border-r">
        <AllSegments />
      </div>

      {/* Studio Sidebar - Right Side */}
      <div className="w-10/12">
        <StudioSegmentsTabs />
         <SwatchRecommendations />
       {/* <SwatchRecommendations /> */}
      </div>
      </div>
    </>
  )
}

export default DesignHubContent;
