import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/store";
import { Home } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const SegmentHome = () => {
  const { list: jobs } = useSelector((state: RootState) => state.jobs);
 

  const handleGetMaskSegment = async () => {};

const handleAddSegment = () => {
  // Logic to add a new segment
}

  return (
    <>
      <h1 className=" text-lg font-bold">Segment Jobs</h1>
      {/* create icon to All segments */}
      <div className="flex items-center justify-between mb-4">
        <TooltipProvider >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="bg-white text-black hover:bg-gray-100"
                onClick={handleAddSegment}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house-plus-icon lucide-house-plus">
                  <path d="M12.662 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v2.475"/>
                  <path d="M14.959 12.717A1 1 0 0 0 14 12h-4a1 1 0 0 0-1 1v8"/>
                  <path d="M15 18h6"/>
                  <path d="M18 15v6"/>
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Segment</p>
            </TooltipContent>
          </Tooltip>
          </TooltipProvider>
      </div>
      <>
        {jobs[0] &&
        jobs[0] !== undefined &&
        jobs[0].segments &&
        Object.keys(jobs[0].segments).length > 0 ? (
          <>
            <h4>Available Jobs:</h4>
          </>
        ) : (
          <Button onClick={handleGetMaskSegment}>Get mask segment</Button>
        )}
      </>
    </>
  );
};

export default SegmentHome;
