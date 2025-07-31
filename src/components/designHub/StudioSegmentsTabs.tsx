import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Button } from "@/components/ui/button";
import { MasterGroupModel, MasterModel } from "@/models/jobModel/JobModel";
import { setCanvasType, updateHoverGroup } from "@/redux/slices/canvasSlice";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updatedSelectedGroupSegment } from "@/redux/slices/MasterArraySlice";
import EachSegmentTabs from "./EachSegmentTabs";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { TooltipContent } from "../ui/tooltip";
import TabNavigation from "./tabNavigation/TabNavigation";

const StudioTabs = () => {

  const dispatch = useDispatch<AppDispatch>();

  const [activeTab, setActiveTab] = useState<string>("");
  const [innerTabMap, setInnerTabMap] = useState<Record<string, string>>({});
  const [masterArray, setmasterArray] = useState<MasterModel | null>(null);

  const { selectedMasterArray, selectedGroupSegment } = useSelector(
    (state: RootState) => state.masterArray
  );

  const [currentSelectedGroupSegment, setCurrentSelectedGroupSegment] =
    useState<MasterGroupModel | null>(null);


  // update the selected MasterArray
  useEffect(() => {
    if (selectedMasterArray) {
      setmasterArray(selectedMasterArray);
      setmasterArray(selectedMasterArray);
      if (selectedMasterArray && selectedMasterArray.allSegments && selectedMasterArray.allSegments.length > 0) {

        setActiveTab(selectedMasterArray.allSegments[0].groupName);

        setCurrentSelectedGroupSegment(selectedMasterArray.allSegments[0]);
      }
    } else {
      setmasterArray(null);
    }
  }, [selectedMasterArray]);

  useEffect(() => {
    if (
      selectedGroupSegment &&
      selectedGroupSegment.groupName &&
      selectedGroupSegment.segments.length > 0
    ) {
      setCurrentSelectedGroupSegment(selectedGroupSegment);
    } else {
      setCurrentSelectedGroupSegment(null);
    }
  }, [selectedGroupSegment]);

  const handleAddGroupSegment = () => {
    if (currentSelectedGroupSegment == null) {
      alert("Please select a group segment");
    } else {
      dispatch(setCanvasType("draw"));
    }
  };

  const handleGroupSegmentClick = (group: MasterGroupModel) => {
    setActiveTab(group.groupName);
    dispatch(updatedSelectedGroupSegment(group));

    // Set default inner tab for this wall
    if (group.segments && group.segments.length > 0) {
      setInnerTabMap((prev) => ({
        ...prev,
        [group.groupName]: group.segments[0].short_title ?? "default",
      }));
    }
  };

  const handleInnerTabClick = (wall: string, shortTitle: string) => {
    setInnerTabMap((prev) => ({
      ...prev,
      [wall]: shortTitle,
    }));
  };

  const handleAddSegment = () => {
    dispatch(setCanvasType("draw"));
  }

  const handleGroupHover = (group: MasterGroupModel) => {

    const allSeg = group?.segments || [];
    const allSegName: string[] = []
    if (allSeg && allSeg.length > 0) {
      allSeg.forEach(seg => {
        allSegName.push(seg.short_title ?? "");
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


      {
        masterArray &&
          masterArray.allSegments &&
          masterArray.allSegments.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No segments available. Please add a segment.</p>

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
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full">
          

                 <div className="flex items-center justify-between border-b bg-[#f8f9fa] px-2 py-2 w-42">
                   <TabsList className="flex overflow-x-auto whitespace-nowrap border-b no-scrollbar px-2 py-1 bg-white">
                <Swiper spaceBetween={8} slidesPerView="auto" className="max-w-[100%] flex-1 ml-0 gap-0">
                  {masterArray?.allSegments.map((tab) => (
                    <SwiperSlide key={tab.groupName} className="!w-auto">
                      <TabsTrigger
                        onClick={() => handleGroupSegmentClick(tab)}
                        onMouseEnter={() => handleGroupHover(tab)}
                        onMouseLeave={handleLeaveGroupHover}
                        value={tab.groupName}
                        className="px-4 py-2 text-sm rounded-t-md bg-transparent text-gray-600 data-[state=active]:bg-cyan-200 data-[state=active]:text-black"
                      >
                        {tab.groupName}
                      </TabsTrigger>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </TabsList>

              <Button
                variant="ghost"
                className="ml-2 p-2 bg-white hover:bg-gray-200 rounded-md shadow-sm"
                onClick={handleAddGroupSegment}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12.662 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v2.475" />
                  <path d="M14.959 12.717A1 1 0 0 0 14 12h-4a1 1 0 0 0-1 1v8" />
                  <path d="M15 18h6" />
                  <path d="M18 15v6" />
                </svg>
              </Button>
            </div>

            {/* Wall Content Tabs */}
            {masterArray?.allSegments.map((wall) => (
              <TabsContent value={wall.groupName} key={wall.groupName}>
                <Tabs value={innerTabMap[wall.groupName] || wall.segments[0]?.short_title} className="w-full">
                  <TabsList className="flex overflow-x-auto whitespace-nowrap border-b no-scrollbar py-1 bg-white !min-w-0 !w-full">
                    <div className="flex min-w-0 w-full">
                      <Swiper spaceBetween={8} slidesPerView="auto" className="flex min-w-0 w-full">
                        <EachSegmentTabs
                          groupSegments={wall}
                          onTabClick={(tabId) => handleInnerTabClick(wall.groupName, tabId)}
                        />
                      </Swiper>
                    </div>
                  </TabsList>

                  {currentSelectedGroupSegment?.segments.map((segment) => (
                    <TabsContent key={segment.short_title} value={segment.short_title ?? ""} className="p-4">
                      <div className="text-gray-700 font-medium">
                        <TabNavigation />
                      </div>
                    </TabsContent>
                   ))} 
                </Tabs>
              </TabsContent>
            ))}
          </Tabs>)}
    </>

  );
};

export default StudioTabs;
