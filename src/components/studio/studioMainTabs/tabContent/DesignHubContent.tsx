import { useMemo } from "react";
import AllSegments from "../../segment/AllSegments";

import StudioSegmentsTabs from "../../../designHub/StudioSegmentsTabs";
import { SwatchRecommendations } from "@/components/swatch/SwatchRecommendations";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
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
        <div className="flex flex-col">
          <StudioSegmentsTabs />
          {/* {memoizedSwatch} */}
          <SwatchRecommendations />
        </div>
      </div>
    </>
  );
};

export default DesignHubContent;
