import React, { useEffect, useState } from "react";
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
import { MaterialSegmentModel } from "@/models/materialSegment/MaterialSegmentModel";

// Extend MaterialSegmentModel to include allSegments for local use
interface MaterialSegmentWithGroups extends MaterialSegmentModel {
  allSegments: any;
}
import { selectMaterialSegment } from "@/redux/slices/materialSlices/materialSegmentSlice";
import { setActiveTab, setSegmentType } from "@/redux/slices/TabControlSlice";
import { addSelectedMasterArray } from "@/redux/slices/MasterArraySlice";
import { MasterGroupModel, MasterModel } from "@/models/jobModel/JobModel";
import { updateHoverGroup } from "@/redux/slices/canvasSlice";

const AllSegments = () => {
  const [detectedSegment, setDetectedSegment] = useState<
    MaterialSegmentModel[]
  >([]);

  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  const [updatedMasterArray, setUpdatedMasterArray] = useState<
    MasterModel[] | null
  >(null);
  const { currentProject } = useSelector((state: RootState) => state.projects);

  const { segments } = useSelector(
    (state: RootState) => state.materialSegments
  );

  const { masterArray } = useSelector((state: RootState) => state.masterArray);
  const { allSegments } = useSelector((state: RootState) => state.segments);

  // update master Array
  useEffect(() => {
    if (masterArray && masterArray.length > 0) {
      setUpdatedMasterArray(masterArray);
    } else {
      setUpdatedMasterArray(null);
    }
  }, [masterArray]);

  useEffect(() => {
    if (allSegments && allSegments.length === 0) {
      if (
        segments &&
        segments.length > 0 &&
        currentProject &&
        currentProject.analysed_data &&
        currentProject.analysed_data.segments_detected
      ) {
        const detectedSeg: MaterialSegmentModel[] = [];
        if (
          Object.keys(currentProject.analysed_data.segments_detected).length > 0
        ) {
          const allDetectedSegments = Object.keys(
            currentProject.analysed_data.segments_detected
          );

          allDetectedSegments.forEach((seg) => {
            const foundSegment = segments.find((item) => {
              const itemName = (item.name || "").toLowerCase();
              const segLower = (seg || "").toLowerCase();
              return (
                itemName.startsWith(segLower) || segLower.startsWith(itemName)
              );
            });

            if (foundSegment) {
              detectedSeg.push(foundSegment);
            }
          });
        }
        if (detectedSeg && detectedSeg.length > 0) {
          setActiveSegment(detectedSeg[0]?.id || null);
          setDetectedSegment(detectedSeg);
          dispatch(selectMaterialSegment(detectedSeg[0]));
          dispatch(addSelectedMasterArray(detectedSeg[0]?.name));
        }
      }
    } else if (
      allSegments &&
      allSegments.length > 0 &&
      segments &&
      segments.length > 0
    ) {
      const segData: MaterialSegmentModel[] = [];
      segments.map((seg) => {
        const foundSegment = allSegments.filter(
          (item) => item.segment_type === seg.name
        );

        const allGroups: string[] = [];
        const sameGrpSeg: MasterGroupModel[] = [];
        if (foundSegment) {
          segData.push(seg);
          // foundSegment.map((item) => {
          //   const groupLabels = item.group_label_system;
          //   allGroups.push(groupLabels || "");
          // })
        }
        // Log only unique strings
        // const uniqueGroups = Array.from(new Set(allGroups));
        // if (uniqueGroups.length > 0) {
        //   uniqueGroups.map(grp => {
        //     const sameGrp = foundSegment.filter((item) => item.group_label_system === grp);
        //     const data = {
        //       groupName: grp ?? "",
        //       segments: sameGrp,
        //     }
        //     sameGrpSeg.push(data);
        //   })
        // }
        // if (sameGrpSeg && sameGrpSeg.length > 0) {
        //   segData.push({
        //     id: seg.id,
        //     name: seg.name,
        //     color: seg.color,
        //     color_code: seg.color_code,
        //     short_code: seg.short_code,
        //     categories: seg.categories,
        //     icon: seg.icon,

        //     allSegments: sameGrpSeg,
        //   } as MaterialSegmentWithGroups);
        // }
      });
      if (segData && segData.length > 0) {
        // setUpdatedMasterArray(segData);
        setDetectedSegment(segData);
        setActiveSegment(segData[0]?.id || null);
        dispatch(selectMaterialSegment(segData[0]));
        dispatch(addSelectedMasterArray(segData[0]?.name));
      }
    }
  }, [segments, currentProject, allSegments]);

  const dispatch = useDispatch<AppDispatch>();
  const handleSegmentClick = (selectedSeg: MaterialSegmentModel) => {
    if (selectedSeg) {
      setActiveSegment(selectedSeg.id);
      dispatch(selectMaterialSegment(selectedSeg));
      dispatch(addSelectedMasterArray(selectedSeg.name));

      //segMent tye in tab slice
      dispatch(setSegmentType(selectedSeg.name));
      dispatch(setActiveTab("studio-segment"));
    }
  };

  const handleMouseEnter = (sgtype: string) => {
    const segNameArray: string[] = [];
    const curenMasterArray = updatedMasterArray?.find(
      (item) => item.name === sgtype
    );
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

  const handleAddSegment = () => {};
  const [hoveredSegmentName, setHoveredSegmentName] = useState<string | null>(
    null
  );

  return (
    <TooltipProvider>
      <div className="flex flex-col space-y-2 p-2">
        {detectedSegment &&
          detectedSegment.length > 0 &&
          detectedSegment.map(
            (segment: MaterialSegmentModel, index: number) => {
              const isActive = activeSegment === segment.id;
              const isHovered = hoveredSegment === segment.id;

              return (
                <div key={segment.id || index} className="relative">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive ? "default" : "outline"}
                        size="icon"
                        className={cn(
                          "w-12 h-12 border-2 p-0 transition-all duration-200",
                          isActive && "ring-2 ring-offset-2 ring-primary",
                          isHovered && "shadow-md"
                          // scale-105 
                        )}
                        style={{
                          borderColor: segment.color_code,
                          backgroundColor: isActive
                            ? `${segment.color_code}50`
                            : isHovered
                            ? `${segment.color_code}20`
                            : "transparent",
                        }}
                        onClick={() => handleSegmentClick(segment)}
                        onMouseEnter={() => {
                          setHoveredSegment(segment.id); // 👈 ADD THIS
                          handleMouseEnter(segment.name ?? ""); // 👈 KEEP THIS
                        }}
                        onMouseLeave={() => {
                          setHoveredSegment(null); // 👈 ADD THIS
                          handleMouseLeave(); // 👈 KEEP THIS
                        }}
                      >
                        <span className="w-full h-full flex items-center justify-center">
                          {segment.icon && segment.icon.trim() !== "" ? (
                            <img
                              src={segment.icon}
                              alt={segment.name || "Segment Icon"}
                              className="w-6 h-6 object-contain brightness-0 saturate-100"
                            />
                          ) : (
                            <div
                              className="w-10 h-10 rounded-sm flex items-center justify-center text-white text-sm font-bold"
                              style={{
                                backgroundColor:
                                  segment.color_code || "#3B82F6",
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
            }
          )}

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
                  className="bg-white text-black hover:bg-gray-100"
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
