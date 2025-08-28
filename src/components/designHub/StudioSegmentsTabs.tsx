import { useState, useEffect, useRef, act } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Button } from "@/components/ui/button";
import { MasterGroupModel, MasterModel } from "@/models/jobModel/JobModel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setCanvasType, updateHoverGroup } from "@/redux/slices/canvasSlice";
import {
  addUserSelectedSegment,
  updatedSelectedGroupSegment,
  updateSelectedSegment,
  updateUserSelectedSegment,
} from "@/redux/slices/MasterArraySlice";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { TooltipContent } from "../ui/tooltip";
import TabNavigation from "./tabNavigation/TabNavigation";

import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import { LuHousePlus } from "react-icons/lu";
import {
  updateAddSegMessage,
  updateIsNewMasterArray,
} from "@/redux/slices/segmentsSlice";
import { IoMdClose } from "react-icons/io";
import { MaterialSegmentModel } from "@/models/materialSegment";
import { toast } from "sonner";
import { SwatchRecommendations } from "../swatch/SwatchRecommendations";
import NoSegment from "./NoSegment";
import { updateSegmentIntoRequestPallet } from "@/redux/slices/visualizerSlice/genAiSlice";
import { SegmentEditComp } from "./editSegment/SegmentEditComp";
import { set } from "date-fns";

const StudioTabs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const SegTypeRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [activeTab, setActiveTab] = useState("");
  const [innerTabValue, setInnerTabValue] = useState("");
  const [masterArray, setMasterArray] = useState<MasterModel | null>(null);
  const [currentSelectedGroupSegment, setCurrentSelectedGroupSegment] =
    useState<MasterGroupModel | null>(null);
  const [edit, setEdit] = useState(false);
  const [optionEdit, setOptionEdit] = useState<string | null>(null);
  const handleEditOption = (data:boolean, option:string) => {
    // console.log("Edit option clicked", data);
    setEdit(data);
    setOptionEdit(option);
  };

  const [active, setActive] = useState<number[]>([]);

  const { selectedMasterArray, selectedGroupSegment } = useSelector(
    (state: RootState) => state.masterArray
  );

  const totalGroups = masterArray?.allSegments.map((d: any) => d.groupName);

  // Update master array
  useEffect(() => {
    if (selectedMasterArray && selectedMasterArray.allSegments.length > 0) {
      setMasterArray(selectedMasterArray);

      const firstGroup = selectedMasterArray.allSegments[0];
      const firstSegment = selectedMasterArray.allSegments.map((grp) => {
        return grp.segments
          .slice()
          .filter((seg) => seg.short_title)
          .sort((a, b) =>
            (a.short_title ?? "").localeCompare(b.short_title ?? "")
          );
      });

      setActiveTab(firstGroup.groupName);
      setInnerTabValue(firstSegment[0]?.[0]?.short_title ?? "");
      setCurrentSelectedGroupSegment(firstGroup);
      setActive(firstSegment[0].map((d) => d.id!));
    } else {
      setMasterArray(null);
    }
  }, [selectedMasterArray]);

  // Update current selected group
  useEffect(() => {
    if (
      selectedGroupSegment?.groupName &&
      selectedGroupSegment.segments.length > 0
    ) {
      setCurrentSelectedGroupSegment(selectedGroupSegment);
    } else {
      setCurrentSelectedGroupSegment(null);
    }
  }, [selectedGroupSegment]);

  // Scroll active tabs into view
  useEffect(() => {
    tabRefs.current[innerTabValue]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    SegTypeRefs.current[activeTab]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeTab, innerTabValue]);

  const handleGroupSegmentClick = (group: MasterGroupModel) => {
    setActiveTab(group.groupName);
    dispatch(updatedSelectedGroupSegment(group));
    console.log("Group segments:", group.segments);
    dispatch (addUserSelectedSegment(group.segments))
    const tabs = group.segments.map((d) => d.id!);
    setActive(tabs);  
    setInnerTabValue(group.segments[0]?.short_title ?? "");
  };

  const handleInnerTabClick = (seg: SegmentModal) => {
    if (!seg || active.length == 1) {
      return;
    }
      // 
    if (active.includes(seg.id!)) {
      setActive((prev) => prev.filter((d) => d != seg.id));
    } else {
      setActive((prev) => [...prev, seg.id!]);
    }
    console.log("Active segments:", seg);
    dispatch(updateUserSelectedSegment(seg));
    dispatch(updateSegmentIntoRequestPallet(seg));
  };

  const handleGroupHover = (group: MasterGroupModel) => {
    const segmentTitles =
      group?.segments?.map((seg) => seg.short_title ?? "") || [];
    dispatch(updateHoverGroup(segmentTitles));
  };

  const handleLeaveGroupHover = () => dispatch(updateHoverGroup(null));

  const handleAddGroupSegment = () => {
    // if (!currentSelectedGroupSegment) {
    //   alert("Please select a group segment");
    // } else {
    dispatch(setCanvasType("draw"));
  };

 

  const handleEachSegmentHover = (segment: string) => {
    dispatch(updateHoverGroup(null));
    dispatch(updateHoverGroup([segment]));
  };

  // const handleLeaveGroupHover = () => {
  //   dispatch(updateHoverGroup(null));
  // };


  // if (!masterArray || masterArray.allSegments.length === 0) {
  //   return (
   
  //   );
  // }

  const handleCancelEdit = () => {
      setEdit(false);
    setOptionEdit(null);
  };
  return (
    <>
    {!masterArray || masterArray.allSegments.length === 0  ?(
       <NoSegment />
    ):( 
    <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="box-border overflow-y-auto border-2 "
      >
        <div className="flex items-center justify-between border-b bg-[#f8f9fa] px-2 py-0">
          <TabsList className=" whitespace-nowrap pb-2 no-scrollbar flex items-center gap-1 bg-transparent">
            <Swiper
              spaceBetween={8}
              slidesPerView="auto"
              className="max-w-full"
            >
              {masterArray.allSegments.map((tab) => (
                <SwiperSlide key={tab.groupName} className="!w-auto">
                  <TabsTrigger
                    ref={(el) => (SegTypeRefs.current[tab.groupName] = el)}
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
            className="ml-2 p-2 bg-white hover:bg-gray-200 rounded-md shadow-sm border border-gray-300"
            onClick={handleAddGroupSegment}
          >
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="64" stroke-dashoffset="64" d="M4 12v-7c0 -0.55 0.45 -1 1 -1h14c0.55 0 1 0.45 1 1v14c0 0.55 -0.45 1 -1 1h-14c-0.55 0 -1 -0.45 -1 -1Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path><path stroke-dasharray="12" stroke-dashoffset="12" d="M7 12h10"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="12;0"/></path><path stroke-dasharray="12" stroke-dashoffset="12" d="M12 7v10"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="12;0"/></path></g></svg> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-dasharray="16"
                stroke-dashoffset="16"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              >
                <path d="M5 12h14">
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    dur="0.4s"
                    values="16;0"
                  />
                </path>
                <path d="M12 5v14">
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    begin="0.4s"
                    dur="0.4s"
                    values="16;0"
                  />
                </path>
              </g>
            </svg>
          </Button>
        </div>

      

        {masterArray.allSegments.map((wall) => (
          <TabsContent
            className="overflow-x-auto"
            value={wall.groupName}
            key={wall.groupName}
          >
            <Tabs value={innerTabValue} className="w-full">
              <div className="flex gap-1 justify-start whitespace-nowrap border-b py-1 bg-white">
                {/* <Swiper slidesPerView={2}> */}
                {wall.segments
                  .slice() // make a copy to avoid mutating original
                  .filter((tab) => tab.short_title)
                  .sort((a, b) =>
                    (a.short_title ?? "").localeCompare(b.short_title ?? "")
                  )
                  .map((tab) => {
                    const isPresent = active.includes(tab.id!);
                    return (
                      // <SwiperSlide key={tab.short_title} className="">
                      <Button
                        ref={(el) =>
                          (tabRefs.current[tab.short_title ?? ""] = el)
                        }
                        onClick={() => handleInnerTabClick(tab)}
                        onMouseEnter={() =>
                          handleEachSegmentHover(tab.short_title ?? "")
                        }
                        onMouseLeave={handleLeaveGroupHover}
                        className={`uppercase text-sm font-semibold px-3 py-1 text-white  focus:ring-transparent  border border-black  hover:text-black ${
                          isPresent
                            ? "bg-green-500 hover:border-green-500 hover:bg-green-200"
                            : "bg-red-500 hover:border-red-500 hover:bg-red-200"
                        }`}
                      >
                        {tab.short_title}
                      </Button>
                      // </SwiperSlide>
                    );
                  })}
                {/* </Swiper> */}
              </div>
            </Tabs>
          </TabsContent>
        ))}

        <TabNavigation 
        handleEditOption={handleEditOption} />

        {edit && optionEdit &&(
          <SegmentEditComp
            totalGroups={totalGroups}
            optionEdit={optionEdit}
            onCancel={handleCancelEdit}

          />
        )}

        {/* {currentSelectedGroupSegment?.segments.map((segment) => (
          <div
          key={segment.short_title}
          value={segment.short_title ?? ""}
          className=""
          >
            <TabNavigation
              title={segment.short_title}
              segment={segment || {}}
            />
            {innerTabValue === segment.short_title && (
              <TabNavigation
                title={segment.short_title}
                segment={segment || {}}
              />
            )}
          </div>
        ))} */}
      { !edit && <SwatchRecommendations />}
      </Tabs>)}
    </>
  );
}

export default StudioTabs;

