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
import { selectMaterialSegment } from "@/redux/slices/materialSlices/materialSegmentSlice";
import { setActiveTab, setSegmentType } from "@/redux/slices/TabControlSlice";
import { addSelectedMasterArray } from "@/redux/slices/MasterArraySlice";
import { MasterModel } from "@/models/jobModel/JobModel";
import { updateHoverGroup } from "@/redux/slices/canvasSlice";

const AllSegments = () => {

  const [detectedSegment, setDetectedSegment] = useState<MaterialSegmentModel[]>([]);

  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [activeSegment, setActiveSegment] = useState<number | null>(
    null
  );

  const [updatedMasterArray, setUpdatedMasterArray] = useState<MasterModel[] | null>(null);
  const { currentProject } = useSelector((state: RootState) => state.projects);

  const { segments } = useSelector((state: RootState) => state.materialSegments);

  const {masterArray} = useSelector((state: RootState) => state.masterArray);

  // update master Array
  useEffect(() => {
    if(masterArray && masterArray.length > 0) {
      setUpdatedMasterArray(masterArray);
    }else {
      setUpdatedMasterArray(null);
    }
  },[masterArray]);

  useEffect(() => {

    if (segments &&
      segments.length > 0 &&
      currentProject && currentProject.analysed_data &&
      currentProject.analysed_data.segments_detected

    ) {
      const detectedSeg: MaterialSegmentModel[] = []
      if (Object.keys(currentProject.analysed_data.segments_detected).length > 0) {
        const allDetectedSegments = Object.keys(currentProject.analysed_data.segments_detected);
        console.log("All Detected Segments:", allDetectedSegments);
        allDetectedSegments.forEach((seg) => {
          const foundSegment = segments.find((item) => (item.name).toLowerCase().startsWith(seg));
          if (foundSegment) {
            detectedSeg.push(foundSegment);
          }
        });
      }
      setActiveSegment(detectedSeg[0]?.id || null);
      setDetectedSegment(detectedSeg);
      dispatch(selectMaterialSegment(detectedSeg[0]));
      dispatch(addSelectedMasterArray(detectedSeg[0]?.name));
    } else {
      setActiveSegment(segments[0]?.id || null);
      setDetectedSegment(segments);
    }
  }, [segments, currentProject]);



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
    const segNameArray:string [] = [];
  const curenMasterArray= updatedMasterArray?.find((item) => item.name === sgtype);
    if (curenMasterArray && curenMasterArray.allSegments &&
      curenMasterArray.allSegments.length > 0) {
      curenMasterArray.allSegments.forEach((group) => {
        const segArray= group.segments || [];
        if(segArray && segArray.length > 0) {
          segArray.forEach((seg) => {
            segNameArray.push(seg.short_title || "");
          });
        }
      });
    }

    dispatch(updateHoverGroup(segNameArray));
  };

  const handleMouseLeave = () => {
      dispatch(updateHoverGroup(null))
   };

  const handleAddSegment = () => { }
  return (
    <TooltipProvider>
      <div className="flex flex-col space-y-2 p-2">
        {detectedSegment &&
          detectedSegment.length > 0 &&
          detectedSegment.map((segment: MaterialSegmentModel, index: number) => {
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
                        "w-12 h-12 transition-all duration-200 border-2 p-0",
                        isActive && "ring-2 ring-offset-2 ring-primary",
                        isHovered && "scale-105 shadow-md"
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
                      onMouseEnter={() =>
                        handleMouseEnter(segment.name ?? "")
                      }
                      onMouseLeave={handleMouseLeave}
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
    </TooltipProvider>
  );
};

export default AllSegments;
