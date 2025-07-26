
import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MasterModel } from "@/models/jobModel/JobModel";
// import { Swiper, SwiperSlide } from 'swiper/react';

const AllSegments = () => {
  const { list: jobs } = useSelector((state: RootState) => state.jobs);

  const { selectedMasterArray } = useSelector((state: RootState) => state.masterArray);

  const [masterArray, setmasterArray] = useState<MasterModel | null>(null);


  // update the selected MasterArray
  useEffect(() => {
    if (selectedMasterArray) {
      setmasterArray(selectedMasterArray);
    } else {
      setmasterArray(null);
    }
  }, [selectedMasterArray]);

  const handleAddSegment = () => {
    // Logic to add a new segment
  }

  return (
    <>
      <h1 className=" text-lg font-bold">Segment Jobs</h1>

      {masterArray &&
        masterArray !== undefined &&
        masterArray.allSegments &&
        masterArray.allSegments.length == 0 ? (
        <>
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
                      <path d="M12.662 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v2.475" />
                      <path d="M14.959 12.717A1 1 0 0 0 14 12h-4a1 1 0 0 0-1 1v8" />
                      <path d="M15 18h6" />
                      <path d="M18 15v6" />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Segment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      ) : (<>
        {masterArray &&
          masterArray.allSegments &&
          masterArray.allSegments.length > 0 && (
            <Tabs defaultValue={masterArray.allSegments[0].groupName} className="mb-4">
              <TabsList className="flex w-full h-9 overflow-x-auto no-scrollbar">
               
                  {masterArray.allSegments.map((group) => (
                    <div key={group.groupName} style={{ width: 'auto', display: 'inline-block' }}>
                      <TabsTrigger value={group.groupName} className="text-xs p-1 flex items-center">
                        <Home className="h-3 w-3 mr-1" />
                        {group.groupName}
                      </TabsTrigger>
                    </div>
                  ))}
              
              </TabsList>
              {/* TabsContent per group */}
              {masterArray.allSegments.map((group) => (
                <TabsContent key={group.groupName} value={group.groupName} className="space-y-6 mt-0">
                  <h2>Tab content for {group.groupName}</h2>
                </TabsContent>
              ))}
            </Tabs>
          )}

      </>)}
      {/* create icon to All segments */}

      {/* <>
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
      </> */}
    </>
  );
};

export default AllSegments;