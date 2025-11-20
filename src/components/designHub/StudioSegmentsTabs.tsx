import React, { useState, useEffect, useRef, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import "swiper/css/keyboard";

import { Button } from "@/components/ui/button";
import { MasterGroupModel, MasterModel } from "@/models/jobModel/JobModel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setCanvasType, updateHoverGroup, updateIsEditSegments } from "@/redux/slices/canvasSlice";
import {
  addUserSelectedSegment,
  updatedSelectedGroupSegment,
  updateUserSelectedSegment,
} from "@/redux/slices/MasterArraySlice";
import TabNavigation from "./tabNavigation/TabNavigation";
import type { Swiper as SwiperType } from "swiper";

import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";

import NoSegment from "./NoSegment";
import { SwatchRecommendations } from "../swatch/SwatchRecommendations";
import { updateSegmentIntoRequestPallet } from "@/redux/slices/visualizerSlice/genAiSlice";
import { SegmentEditComp } from "./editSegment/SegmentEditComp";
import DeleteSegModal from "./deleteSegModal/DeleteSegModal";
import { resetSelectedSegment, updateClearEditCanvas } from "@/redux/slices/segmentsSlice";
import { SegmentInfoPanel } from "../segmentInfo";

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
  const [isInfoTab, setIsInfoTab] = useState(false);
  const { userSelectedSegment } = useSelector(
    (state: RootState) => state.masterArray
  );

  const handleEditOptions = (data: boolean, option: string) => {
    if (option === "edit-annotation") {
      setEdit(data);
      setOptionEdit(option);
      setIsInfoTab(false);

    } else if (option === "edit-segment") {
     // console.log("edit-annotation or hover", option);
      setOptionEdit(option);
      setIsInfoTab(false);
      setEdit(true);
    } else if (option === "information") {
      setEdit(false);
      setIsInfoTab(true);
      setOptionEdit(option);
    }
  };

  // ✅ Per-group Swiper refs (map)
  const segSwiperMapRef = useRef<Record<string, SwiperType | null>>({});
  // ✅ Group Swiper ref
  const groupSwiperRef = useRef<SwiperType | null>(null);
  // Programmatically slide group Swiper to a specific group index
  const slideToGroupTab = useCallback(
    (groupName: string) => {
      if (!groupSwiperRef.current || !masterArray) return;
      const idx = masterArray.allSegments.findIndex(
        (g) => g.groupName === groupName
      );
      if (idx >= 0) {
        groupSwiperRef.current.slideTo(idx, 300);
      }
    },
    [masterArray]
  );

  // ✅ Hover auto-scroll helpers
  const hoverTimerRef = useRef<number | null>(null);
  const hoverDirRef = useRef<0 | 1 | -1>(0);

  const stopAutoHover = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    hoverDirRef.current = 0;
  };

  const startAutoHover = (dir: 1 | -1) => {
    stopAutoHover();
    hoverDirRef.current = dir;

    const step = () => {
      const sw = segSwiperMapRef.current[activeTab];
      if (!sw) return;
      if (dir === 1) sw.slideNext(250);
      else sw.slidePrev(250);
      hoverTimerRef.current = window.setTimeout(step, 140); // 120–180ms = smooth
    };

    step();
  };

  const onHoverMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const EDGE = 40; // px
    if (x < EDGE && hoverDirRef.current !== -1) startAutoHover(-1);
    else if (x > rect.width - EDGE && hoverDirRef.current !== 1)
      startAutoHover(1);
    else if (x >= EDGE && x <= rect.width - EDGE && hoverDirRef.current !== 0)
      stopAutoHover();
  };

  const onHoverLeave = () => stopAutoHover();

  useEffect(() => {
    // cleanup on unmount
    return () => stopAutoHover();
  }, []);

  // ids of selected/active segments
  const [active, setActive] = useState<number[]>([]);
  const { activeOption } = useSelector((state: RootState) => state.segments);
  const { selectedMasterArray, selectedGroupSegment } = useSelector(
    (state: RootState) => state.masterArray
  );

  // update optionaction
  useEffect(() => {
    if (activeOption === "pallet") {
      // setOptionEdit(activeOption);
      setEdit(false);
    } 
    // else if (activeOption === null) {
    //   setOptionEdit("pallet");
    //   setEdit(false);
    // } else {
    //   setOptionEdit(activeOption);
    //   // setEdit(true);
    // }
  }, [activeOption]);

  // Initialize from selectedMasterArray
  useEffect(() => {
    if (selectedMasterArray && selectedMasterArray.allSegments.length > 0) {
      // Sort allSegments by last digit in groupName (increasing order)
      const sortedSegments = [...selectedMasterArray.allSegments].sort((a, b) => {
        // Extract full trailing number from groupName (e.g., 'Group12' => 12)
        const numA = parseInt(a.groupName.match(/(\d+)$/)?.[1] ?? "0", 10);
        const numB = parseInt(b.groupName.match(/(\d+)$/)?.[1] ?? "0", 10);
        return numA - numB;
      });
      const sortedMasterArray = { ...selectedMasterArray, allSegments: sortedSegments };
      setMasterArray(sortedMasterArray);

      const firstGroup = sortedMasterArray.allSegments[0];

      const firstSegmentSorted = sortedMasterArray.allSegments
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

  // Stop hover scroll when switching groups
  useEffect(() => {
    stopAutoHover();
  }, [activeTab]);

  // Auto-scroll active chips into view and group Swiper
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
    // Slide group Swiper to activeTab
    if (activeTab) {
      slideToGroupTab(activeTab);
    }
  }, [activeTab, innerTabValue, slideToGroupTab]);


  // Auto-swipe Swiper to first active chip when 'active' changes
  useEffect(() => {
    if (!currentSelectedGroupSegment || !segSwiperMapRef.current) return;
    // Get sorted segments as in render
    // if (onCanvasClick) {

    const sortedSegments = currentSelectedGroupSegment.segments
      .slice()
      .filter((tab) => tab.short_title)
      .sort((a, b) => (a.short_title ?? "").localeCompare(b.short_title ?? ""));

    const idx = sortedSegments.findIndex((tab) => active.includes(tab.id!));
    if (idx >= 0) {
      setActiveTab(currentSelectedGroupSegment.groupName);

      segSwiperMapRef.current[currentSelectedGroupSegment.groupName]?.slideTo(idx, 300);

    }

  }, [active, currentSelectedGroupSegment, activeTab]);

  const handleGroupSegmentClick = (group: MasterGroupModel) => {
    // setActiveTab(group.groupName);
    dispatch(updatedSelectedGroupSegment(group));
    dispatch(addUserSelectedSegment(group.segments));
    dispatch(resetSelectedSegment());
    dispatch(updateClearEditCanvas(true));
    dispatch(setCanvasType("hover"))
    dispatch(updateIsEditSegments(false))
    const ids = group.segments.map((d) => d.id!);
    // setActive(ids);
    // setInnerTabValue(group.segments[0]?.short_title ?? "");
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
        // onValueChange={setActiveTab}
        className="box-border"
      >
        {/* Top: Group tabs row */}
        <div className="flex items-center justify-between border-b bg-[#f8f9fa] px-0 py-0">
          <TabsList className="flex items-center w-full h-auto gap-1 p-0 bg-transparent whitespace-nowrap no-scrollbar">
            <Swiper
              modules={[FreeMode, Mousewheel]}
              spaceBetween={8}
              slidesPerView="auto"
              freeMode={{ enabled: true, momentum: true, momentumRatio: 0.5 }}
              mousewheel={{ forceToAxis: true, sensitivity: 0.6 }}
              className="max-w-full"
              onSwiper={(sw) => (groupSwiperRef.current = sw)}
            >
              {masterArray.allSegments.map((tab) => (
                <SwiperSlide key={tab.groupName} className="!w-auto seg-group-tabs">
                  <TabsTrigger
                    ref={(el) => {
                      // Only update ref if it actually changed to avoid repeated ref callbacks
                      if (SegTypeRefs.current[tab.groupName] !== el) {
                        SegTypeRefs.current[tab.groupName] = el;
                      }
                    }}
                    onClick={() => handleGroupSegmentClick(tab)}
                    onMouseEnter={() => handleGroupHover(tab)}
                    onMouseLeave={handleLeaveGroupHover}
                    value={tab.groupName}
                    className="px-4 py-3 text-sm  text-gray-700 focus:outline-none focus:ring-0 focus:ring-blue-1 border-none rounded-none bg-transparen  data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:bg-blue-200   data-[state=active]:text-black"
                  >
                    {tab.groupName}
                  </TabsTrigger>
                </SwiperSlide>
              ))}
            </Swiper>
          </TabsList>
        </div>

        {/* Per-group content */}
        {masterArray.allSegments.map((wall) => (
          <TabsContent className="" value={wall.groupName} key={wall.groupName}>
            <Tabs
              value={innerTabValue}
              className="w-full px-4 overflow-x-auto thin-scrollbar"
            >
              {/* Inner: Segment chips row with Swiper */}
              <div
                className="py-2 bg-white whitespace-nowrap"
                onMouseMove={onHoverMove}
                onMouseLeave={onHoverLeave}
              >
                <Swiper
                  modules={[FreeMode, Mousewheel, Keyboard]}
                  spaceBetween={10}
                  slidesPerView="auto"
                  onSwiper={(sw) =>
                    (segSwiperMapRef.current[wall.groupName] = sw)
                  }
                  centeredSlides={false}
                  centerInsufficientSlides={false}
                  slidesOffsetBefore={0}
                  slidesOffsetAfter={0}
                  watchOverflow
                  className="w-full seg-swiper"
                  freeMode={{
                    enabled: true,
                    momentum: true,
                    momentumRatio: 0.45,
                    momentumBounce: false,
                    sticky: false,
                  }}
                  mousewheel={{
                    forceToAxis: true,
                    sensitivity: 0.6,
                    releaseOnEdges: true,
                    eventsTarget: ".seg-swiper",
                  }}
                  keyboard={{ enabled: true }}
                  touchStartPreventDefault={false}
                  grabCursor
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
                          style={{ width: "auto" }}
                        >
                          <Button
                            ref={(el) => {
                              const key = tab.short_title ?? "";
                              if (tabRefs.current[key] !== el) {
                                tabRefs.current[key] = el;
                              }
                            }}
                            onClick={() => {
                              handleInnerTabClick(tab);
                              segSwiperMapRef.current[activeTab]?.slideTo(
                                idx,
                                500
                              );
                            }}
                            onMouseEnter={() =>
                              handleEachSegmentHover(tab.short_title ?? "")
                            }
                            onMouseLeave={handleLeaveGroupHover}
                            className={`cursor-pointer uppercase hover:bg-blue-50 border text-sm font-semibold px-3 py-1 focus:ring-transparent transition-colors focus:outline-none duration-200
                              ${isPresent
                                ? "bg-white  border-blue-500 bg text-gray-600 rounded-md shadow-sm"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50"
                              }`}
                          >
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

        <TabNavigation handleEditOption={handleEditOptions} />
  
        {/* information tab */}
        <SegmentInfoPanel
          open={isInfoTab}
          onClose={() => setIsInfoTab(false)}
        />

        {/* pallet tab */}
        {!edit && <SwatchRecommendations />}


        {edit &&
          activeOption !== "pallet" &&
          activeOption !== "add-segment" && (
            <SegmentEditComp
              optionEdit={optionEdit ?? ""}
              onCancel={handleCancelEdit}
            />
          )}

   
        {/* {isInfoTab && <SegmentInfoPanel/>} */}
      </Tabs>

      <DeleteSegModal />

    </>
  );
};

export default StudioTabs;
