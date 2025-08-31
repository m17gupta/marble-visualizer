import { useState, useEffect, useRef } from "react";
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
  updateUserSelectedSegment,
} from "@/redux/slices/MasterArraySlice";
import TabNavigation from "./tabNavigation/TabNavigation";
import type { Swiper as SwiperType } from "swiper"; // add this

import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import {
  updateAddSegMessage,
  updateIsNewMasterArray,
} from "@/redux/slices/segmentsSlice";
import NoSegment from "./NoSegment";
import { SwatchRecommendations } from "../swatch/SwatchRecommendations";
import { updateSegmentIntoRequestPallet } from "@/redux/slices/visualizerSlice/genAiSlice";
import { SegmentEditComp } from "./editSegment/SegmentEditComp";

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

   const {userSelectedSegment}  = useSelector((state: RootState) => state.masterArray);
  const handleEditOption = (data: boolean, option: string) => {
    setEdit(data);
    setOptionEdit(option);
  };

  // ids of selected/active segments
  const [active, setActive] = useState<number[]>([]);

  const { selectedMasterArray, selectedGroupSegment } = useSelector(
    (state: RootState) => state.masterArray
  );


  const segSwiperRef = useRef<SwiperType | null>(null); // swiper instance
  const lastSegIdxRef = useRef<number>(0);

  // Initialize from selectedMasterArray
  useEffect(() => {
    if (selectedMasterArray && selectedMasterArray.allSegments.length > 0) {
      setMasterArray(selectedMasterArray);

      const firstGroup = selectedMasterArray.allSegments[0];

      const firstSegmentSorted = selectedMasterArray.allSegments
        .map((grp) =>
          grp.segments
            .slice()
            .filter((seg) => seg.short_title)
            .sort((a, b) =>
              (a.short_title ?? "").localeCompare(b.short_title ?? "")
            )
        )
        .at(0);

      setActiveTab(firstGroup.groupName);
      setInnerTabValue(firstSegmentSorted?.[0]?.short_title ?? "");
      setCurrentSelectedGroupSegment(firstGroup);
      setActive(firstSegmentSorted ? firstSegmentSorted.map((d) => d.id!) : []);
    } else {
      setMasterArray(null);
    }
  }, [selectedMasterArray]);

  // Update current selected group from store
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


  // update on Click event
  useEffect(() => {
    if (userSelectedSegment && userSelectedSegment.length > 0) {
      setActive(userSelectedSegment.map((d) => d.id!));
    }
  }, [userSelectedSegment]);

  // Auto-scroll active chips into view
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

  // Auto-swipe Swiper to first active chip when 'active' changes
  useEffect(() => {
    if (!currentSelectedGroupSegment || !segSwiperRef.current) return;
    // Get sorted segments as in render
    const sortedSegments = currentSelectedGroupSegment.segments
      .slice()
      .filter((tab) => tab.short_title)
      .sort((a, b) => (a.short_title ?? "").localeCompare(b.short_title ?? ""));
    // Find index of first active segment
    const idx = sortedSegments.findIndex((tab) => active.includes(tab.id!));
    if (idx >= 0) {
      segSwiperRef.current.slideTo(idx, 300);
    }
  }, [active, currentSelectedGroupSegment]);

  const handleGroupSegmentClick = (group: MasterGroupModel) => {
    setActiveTab(group.groupName);
    dispatch(updatedSelectedGroupSegment(group));
    dispatch(addUserSelectedSegment(group.segments));

    // reset inner selection state to this group
    const ids = group.segments.map((d) => d.id!);
    setActive(ids);
    setInnerTabValue(group.segments[0]?.short_title ?? "");
  };

  const handleInnerTabClick = (seg: SegmentModal) => {
    if (!seg || active.length === 1) return;

    if (active.includes(seg.id!)) {
      setActive((prev) => prev.filter((d) => d !== seg.id));
    } else {
      setActive((prev) => [...prev, seg.id!]);
    }
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
    dispatch(setCanvasType("draw"));
  };

  const handleEachSegmentHover = (segment: string) => {
    dispatch(updateHoverGroup(null));
    dispatch(updateHoverGroup([segment]));
  };

  const handleCancelEdit = () => {
    setEdit(false);
    setOptionEdit(null);
  };

  if (!masterArray || masterArray.allSegments.length === 0) {
    return <NoSegment />;
  }
  

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="box-border overflow-y-auto border-2">
        {/* Top: Group tabs row */}
        <div className="flex items-center justify-between border-b bg-[#f8f9fa] px-2 py-0  ">
          <TabsList className="whitespace-nowrap pb-2 no-scrollbar flex items-center gap-1 bg-transparent w-full">
             <Swiper
              spaceBetween={8}
              slidesPerView="auto"
              className="max-w-full">
              {masterArray.allSegments.map((tab) => (
                <SwiperSlide key={tab.groupName} className="!w-auto">
                  <TabsTrigger
                    ref={(el) => (SegTypeRefs.current[tab.groupName] = el)}
                    onClick={() => handleGroupSegmentClick(tab)}
                    onMouseEnter={() => handleGroupHover(tab)}
                    onMouseLeave={handleLeaveGroupHover}
                    value={tab.groupName}
                    className="px-4 py-2 text-sm rounded-t-md bg-transparent text-gray-600 data-[state=active]:bg-cyan-200 data-[state=active]:text-black">
                    {tab.groupName}
                  </TabsTrigger>
                </SwiperSlide>
              ))}
            </Swiper>
          </TabsList>

          
        </div>

        {/* Per-group content */}
        {masterArray.allSegments.map((wall) => (
          <TabsContent
            className="overflow-x-auto"
            value={wall.groupName}
            key={wall.groupName}>
            <Tabs value={innerTabValue} className="w-full px-4">
              {/* Inner: Segment chips row with Swiper */}

              <div className="whitespace-nowrap py-1 bg-white pb-2">
                <Swiper
                  spaceBetween={10}
                  slidesPerView="auto"
                  onSwiper={(sw) => (segSwiperRef.current = sw)}
                  centeredSlides={false} // ⬅️ center off = no side gutter
                  centerInsufficientSlides={false}
                  slidesOffsetBefore={0}
                  slidesOffsetAfter={0}
                  watchOverflow={true}
                  className="w-ful" // ⬅️ pb-2 hatao if extra gap
                >
                  {wall.segments
                    .slice()
                    .filter((tab) => tab.short_title)
                    .sort((a, b) =>
                      (a.short_title ?? "").localeCompare(b.short_title ?? "")
                    )
                    .map((tab, idx) => {
                      const isPresent = active.includes(tab.id!);
                      return (
                        <SwiperSlide
                          key={tab.short_title}
                          style={{ width: "auto", }}>
                          <Button
                            ref={(el) =>
                              (tabRefs.current[tab.short_title ?? ""] = el)
                            }
                            onClick={() => {
                              handleInnerTabClick(tab);
                              segSwiperRef.current?.slideTo(idx, 300);
                            }}
                            onMouseEnter={() =>
                              handleEachSegmentHover(tab.short_title ?? "")
                            }
                            onMouseLeave={handleLeaveGroupHover}
                            className={`cursor-pointer uppercase border border-purple-500 hover:bg-white-200 text-sm font-semibold px-3 py-1 focus:ring-transparent transition-colors focus:outline-none duration-200
                            ${
                              isPresent
                                ? "bg-purple-100 border border-purple-500 border-b-2 text-black rounded-md shadow-sm cursor-pointer"
                                : "bg-white border-b-2 border-blue-500 text-gray-700 hover:bg-blue-100"
                            }`}>
                            {tab.short_title}
                          </Button>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>
            </Tabs>
          </TabsContent>
        ))}

        <TabNavigation
         handleEditOption={handleEditOption} />

        {edit && optionEdit && (
          <SegmentEditComp
            optionEdit={optionEdit}
            onCancel={handleCancelEdit}
          />
        )}
        {!edit && <SwatchRecommendations />}
      </Tabs>
    </>
  );
};

export default StudioTabs;
