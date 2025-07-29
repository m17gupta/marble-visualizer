
import { Button } from "@/components/ui/button";
import { AppDispatch, RootState } from "@/redux/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MasterGroupModel, MasterModel } from "@/models/jobModel/JobModel";
import { updatedSelectedGroupSegment } from "@/redux/slices/MasterArraySlice";
import { setCanvasType, updateHoverGroup } from "@/redux/slices/canvasSlice";

// import { Swiper, SwiperSlide } from 'swiper/react';

const AllSegments = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { selectedMasterArray, selectedGroupSegment} = useSelector((state: RootState) => state.masterArray);

  const [masterArray, setmasterArray] = useState<MasterModel | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [currentSelectedGroupSegment, setCurrentSelectedGroupSegment] = useState<MasterGroupModel | null>(null);
  // update the selected MasterArray
  useEffect(() => {
    if (selectedMasterArray) {
      setmasterArray(selectedMasterArray);
       setmasterArray(selectedMasterArray);
      if(selectedMasterArray && selectedMasterArray.allSegments && selectedMasterArray.allSegments.length > 0) {
        // console.log("Selected Master Array:", selectedMasterArray);
        // dispatch(updatedSelectedGroupSegment(selectedMasterArray.allSegments[0]));
        setActiveTab(selectedMasterArray.allSegments[0].groupName);
      }
    } else {
      setmasterArray(null);
    }
  }, [selectedMasterArray]);

  // update the active 
  useEffect(() => {
    if (selectedGroupSegment &&
       selectedGroupSegment.groupName &&
        selectedGroupSegment.segments.length > 0
    ) {
      setActiveTab(selectedGroupSegment.groupName);
      setCurrentSelectedGroupSegment(selectedGroupSegment);
    }else{
      setCurrentSelectedGroupSegment(null);
    }
  }, [selectedGroupSegment]);

  const handleAddGroupSegment = () => {
    console.log("Add Segment Clicked",currentSelectedGroupSegment);
      if(currentSelectedGroupSegment== null) {
        alert("please select the group segment")
      }else{
        dispatch(setCanvasType("draw"));
      }
    
  } 


  const handldeGroupSegmentClick = (group: MasterGroupModel) => {
    console.log("Group clicked:", group)
    setActiveTab(group.groupName);
    dispatch(updatedSelectedGroupSegment(group));
    
  }

  const handleAddSegment=()=>{
     dispatch(setCanvasType("draw"));
  }

  const handleGroupHover = (group: MasterGroupModel) => {
    console.log("Group hovered:", group.groupName);
    const allSeg= group?.segments || [];
    const allSegName:string []=[]
    if(allSeg && allSeg.length > 0) {
      allSeg.forEach(seg => {
        allSegName.push(seg.short_title??"");
      });
    }
   dispatch(updateHoverGroup(allSegName));
    // You can add any additional logic here if needed
  };

  const handleLeaveGroupHover = () => {
    dispatch(updateHoverGroup(null));
  };

  return (
    <>
      

      {masterArray &&
        masterArray !== undefined &&
        masterArray.name &&
        masterArray.allSegments &&
        masterArray.allSegments.length == 0 ? (
        <>
        <h1 className=" text-lg font-bold">No segment available in {masterArray.name??""}. Please add segment</h1>
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
                      <TabsTrigger
                        value={group.groupName}
                        className={`text-xs p-1 flex items-center ${activeTab === group.groupName ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}
                      onMouseEnter={() => handleGroupHover(group)}
                      onMouseLeave={handleLeaveGroupHover}
                        onClick={() => handldeGroupSegmentClick(group)}
                      >
                        <Home className="h-3 w-3 mr-1" />
                        {group.groupName}
                      </TabsTrigger>
                    </div>
                  ))}
               <TooltipProvider >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white text-black hover:bg-gray-100"
                    onClick={handleAddGroupSegment}
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