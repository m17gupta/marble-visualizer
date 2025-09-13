import AllSegments from "../../segment/AllSegments";

import StudioSegmentsTabs from "../../../designHub/StudioSegmentsTabs";


const DesignHubContent = () => {
  
  return (
    <>
      {/* All Segments - Left Side */}
      <div className="flex flex-row h-lvh">
        <div className="flex border-r">
          <AllSegments />
        </div>

        {/* Studio Sidebar - Right Side */}
        <div className="flex flex-col h-full w-[100vw] md:w-[21vw] lg:w-[20vw] xl:w-[21vw] 2xl:w-[25vw]">
          <StudioSegmentsTabs />
          {/* {memoizedSwatch} */}
        </div>
      </div>
    </>
  );
};

export default DesignHubContent;
  