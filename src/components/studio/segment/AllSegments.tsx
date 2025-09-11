import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { selectMaterialSegment } from "@/redux/slices/materialSlices/materialSegmentSlice";
import { setActiveTab, setSegmentType } from "@/redux/slices/TabControlSlice";
import {
  addSelectedMasterArray,
  addUserSelectedSegment,
  updatedSelectedGroupSegment,
  updateSelectedSegment,
} from "@/redux/slices/MasterArraySlice";
// import { MasterGroupModel, MasterModel } from "@/models/jobModel/JobModel";
import { setCanvasType, updateHoverGroup } from "@/redux/slices/canvasSlice";
import { MasterModel } from "@/models/jobModel/JobModel";
import { resetEditSegment, updateIsNewMasterArray } from "@/redux/slices/segmentsSlice";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";

const AllSegments = () => {
  // const [detectedSegment, setDetectedSegment] = useState<MaterialSegmentModel[]>([]);

  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  const [updatedMasterArray, setUpdatedMasterArray] = useState<
    MasterModel[] | null
  >(null);

  const { segments } = useSelector(
    (state: RootState) => state.materialSegments
  );
  const { masterArray, selectedMasterArray } = useSelector(
    (state: RootState) => state.masterArray
  );

  // update selected masterArray
  useEffect(() => {
    if (
      selectedMasterArray &&
      selectedMasterArray.allSegments &&
      selectedMasterArray.allSegments.length > 0
    ) {
      setActiveSegment(selectedMasterArray.id ?? null);
      dispatch(setSegmentType(selectedMasterArray.name ?? ""));
    }
  }, [selectedMasterArray]);

  useEffect(() => {
    if (masterArray && masterArray.length > 0) {
      setActiveSegment(masterArray[0].id ? masterArray[0].id : null);
      setUpdatedMasterArray(masterArray);
    } else {
      setUpdatedMasterArray(null);
    }
  }, [masterArray]);
  const dispatch = useDispatch<AppDispatch>();
  const handleSegmentClick = (selectedSeg: MasterModel) => {
    dispatch(resetEditSegment())
    if (selectedSeg && selectedSeg.id && selectedSeg.name) {
      setActiveSegment(selectedSeg.id);
      dispatch(selectMaterialSegment(selectedSeg));
      dispatch(addSelectedMasterArray(selectedSeg));
      const firstGroup = selectedSeg.allSegments[0];
      if (firstGroup && firstGroup.segments && firstGroup.segments.length > 0) {
        const firstSegment = firstGroup.segments[0];
        dispatch(updateSelectedSegment(firstSegment));
        dispatch(updatedSelectedGroupSegment(firstGroup));
        dispatch(addUserSelectedSegment(firstGroup.segments));
      }
      //segMent tye in tab slice
      dispatch(setSegmentType(selectedSeg.name));
      dispatch(setActiveTab("recommendations-swatches"));
    }
  };

  const handleMouseEnter = (sgtype: MasterModel) => {
    const segNameArray: string[] = [];
    const curenMasterArray = sgtype;

    if (
      curenMasterArray &&
      curenMasterArray.allSegments &&
      curenMasterArray.allSegments.length > 0
    ) {
      curenMasterArray.allSegments.forEach((group) => {
        const segArray = group.segments || [];
        if (segArray && segArray.length > 0) {
          segArray.forEach((seg) => {
            segNameArray.push(seg.short_title || "");
          });
        }
      });
    }

    dispatch(updateHoverGroup(segNameArray));
  };

  const handleMouseLeave = () => {
    dispatch(updateHoverGroup(null));
  };

  const handleAddSegment = () => {
    dispatch(updateIsNewMasterArray(true));
    dispatch(setCanvasType("draw"));
  };

  return (
    <TooltipProvider>
      <div className="w-full flex flex-col px-2 pt-4">
        {updatedMasterArray &&
          updatedMasterArray.length > 0 &&
          updatedMasterArray.map((segment: MasterModel, index: number) => {
            const isActive = activeSegment === segment.id;
            const isHovered = hoveredSegment === segment.id;

            return (
              <div key={segment.id || index} className="relative pb-[10px]">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? "default" : "outline"}
                      size="icon"
                      className={cn(
                        "w-12 h-12 border-1 p-1  transition-all duration-200 focus:outline-0 bg-transparent",
                        isActive && "ring-0 ring-offset-0",
                        isHovered && "shadow-md"
                        // scale-105
                      )}
                      style={{
                        borderColor: `${segment.color_code}60`,
                        backgroundColor: isActive
                          ? `${segment.color_code}50`
                          : isHovered
                          ? `${segment.color_code}20`
                          : "transparent",
                      }}
                      onClick={() => handleSegmentClick(segment)}
                      onMouseEnter={() => {
                        setHoveredSegment(segment.id ? segment.id : null);
                        handleMouseEnter(segment);
                      }}
                      onMouseLeave={() => {
                        setHoveredSegment(null);
                        handleMouseLeave();
                      }}
                    >
                      <span className="icon w-100 h-100 flex items-center justify-center">
                        {segment.icon && segment.icon.trim() !== "" ? (
                          <img
                            src={segment.icon}
                            alt={segment.name || "Segment Icon"}
                            style={{
                              width: "24px", // ya '100%' for full fit
                              height: "24px",
                              display: "block",
                              objectFit: "contain",
                              filter: "brightness(0) saturate(100%)",
                            }}
                          />
                        ) : (
                          // Fallback icon based on segment name or default icon
                          <div
                            className="w-10 h-10 rounded-sm flex items-center justify-center text-white text-sm font-bold"
                            style={{
                              backgroundColor: segment.color_code || "#3B82F6",
                            }}
                          >
                            {segment.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{segment.name}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          })}

        {segments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No segments available</p>
            <p className="text-xs mt-1">Create segments on the canvas</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white text-black hover:bg-gray-100 px-3"
                  onClick={handleAddSegment}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-house-plus-icon lucide-house-plus"
                  >
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
    </TooltipProvider>
  );
};

export default AllSegments;
