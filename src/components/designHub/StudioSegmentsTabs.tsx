import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Button } from "@/components/ui/button";
import { MasterGroupModel, MasterModel } from "@/models/jobModel/JobModel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setCanvasType, updateHoverGroup } from "@/redux/slices/canvasSlice";
import { updatedSelectedGroupSegment } from "@/redux/slices/MasterArraySlice";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { TooltipContent } from "../ui/tooltip";
import TabNavigation from "./tabNavigation/TabNavigation";
import TestSlider from "./TestSlider";
 
const StudioTabs = () => {
  const dispatch = useDispatch<AppDispatch>();

  const SegTypeRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const [activeTab, setActiveTab] = useState("");
  const [innerTabValue, setInnerTabValue] = useState("");
  const [masterArray, setMasterArray] = useState<MasterModel | null>(null);
  const [currentSelectedGroupSegment, setCurrentSelectedGroupSegment] = useState<MasterGroupModel | null>(null);

  const { selectedMasterArray, selectedGroupSegment } = useSelector(
    (state: RootState) => state.masterArray
  );

  // Update master array
  useEffect(() => {
    if (selectedMasterArray && selectedMasterArray.allSegments.length > 0) {
      setMasterArray(selectedMasterArray);

      const firstGroup = selectedMasterArray.allSegments[0];
      setActiveTab(firstGroup.groupName);
      setInnerTabValue(firstGroup.segments[0]?.short_title ?? "");
      setCurrentSelectedGroupSegment(firstGroup);
    } else {
      setMasterArray(null);
    }
  }, [selectedMasterArray]);

  // Update current selected group
  useEffect(() => {
    if (selectedGroupSegment?.groupName && selectedGroupSegment.segments.length > 0) {
      setCurrentSelectedGroupSegment(selectedGroupSegment);
    } else {
      setCurrentSelectedGroupSegment(null);
    }
  }, [selectedGroupSegment]);

  // Scroll active tabs into view
  useEffect(() => {
    tabRefs.current[innerTabValue]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    SegTypeRefs.current[activeTab]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeTab, innerTabValue]);

  const handleGroupSegmentClick = (group: MasterGroupModel) => {
    setActiveTab(group.groupName);
    dispatch(updatedSelectedGroupSegment(group));
    setInnerTabValue(group.segments[0]?.short_title ?? "");
  };

  const handleInnerTabClick = (shortTitle: string) => {
    setInnerTabValue(shortTitle);
  };

  const handleGroupHover = (group: MasterGroupModel) => {
    const segmentTitles = group?.segments?.map(seg => seg.short_title ?? "") || [];
    dispatch(updateHoverGroup(segmentTitles));
  };

  const handleLeaveGroupHover = () => dispatch(updateHoverGroup(null));

  const handleAddGroupSegment = () => {
    if (!currentSelectedGroupSegment) {
      alert("Please select a group segment");
    } else {
      dispatch(setCanvasType("draw"));
    }
  };

  const handleAddSegment = () => dispatch(setCanvasType("draw"));

  // --- Render ---

  if (!masterArray || masterArray.allSegments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500 mb-2">No segments available. Please add a segment.</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleAddSegment}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-80">
      <div className="flex items-center justify-between border-b bg-[#f8f9fa] px-2 py-2">
        <TabsList className="flex-1 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar flex items-center gap-1 bg-transparent">
          <Swiper spaceBetween={8} slidesPerView="auto" className="max-w-full">
            {masterArray.allSegments.map(tab => (
              <SwiperSlide key={tab.groupName} className="!w-auto">
                <TabsTrigger
                  ref={el => (SegTypeRefs.current[tab.groupName] = el)}
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

        <Button variant="ghost" className="ml-2 p-2 bg-white hover:bg-gray-200 rounded-md shadow-sm" onClick={handleAddGroupSegment}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.662 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v2.475" />
            <path d="M14.959 12.717A1 1 0 0 0 14 12h-4a1 1 0 0 0-1 1v8" />
            <path d="M15 18h6" />
            <path d="M18 15v6" />
          </svg>
        </Button>
      </div>

      {masterArray.allSegments.map(wall => (
        <TabsContent value={wall.groupName} key={wall.groupName}>
          <Tabs value={innerTabValue} className="w-full">
            <TabsList className="flex overflow-x-auto whitespace-nowrap border-b no-scrollbar py-1 bg-white w-full">
              <Swiper spaceBetween={8} slidesPerView="auto" className="flex w-full">
                {wall.segments.map(tab => (
                  <SwiperSlide key={tab.short_title} className="!w-auto">
                    <TabsTrigger
                      value={tab.short_title ?? ""}
                      ref={el => (tabRefs.current[tab.short_title ?? ""] = el)}
                      onClick={() => handleInnerTabClick(tab.short_title ?? "")}
                      className="uppercase text-sm font-semibold px-3 py-1 text-gray-500 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600"
                    >
                      {tab.short_title}
                    </TabsTrigger>
                  </SwiperSlide>
                ))}
              </Swiper>
            </TabsList>

            {currentSelectedGroupSegment?.segments.map(segment => (
              <TabsContent key={segment.short_title} value={segment.short_title ?? ""} className="p-4">
                {innerTabValue === segment.short_title && (
                  <div className="text-gray-700 font-medium">
                    <TabNavigation />
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      ))}
    </Tabs>
  );
};
 
export default StudioTabs;
 
 