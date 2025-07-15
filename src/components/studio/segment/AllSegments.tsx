import React, { useState } from "react";
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

const AllSegments = () => {
  const { segments } = useSelector(
    (state: RootState) => state.materialSegments
  );
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [activeSegment, setActiveSegment] = useState<number | null>(
    segments[0].id
  );

  const dispatch = useDispatch<AppDispatch>();
  const handleSegmentClick = (selectedSeg: MaterialSegmentModel) => {
    if (selectedSeg) {
      setActiveSegment(selectedSeg.id);
      dispatch(selectMaterialSegment(selectedSeg));
      console.log("Selected Segment:", selectedSeg);
    }
  };

  const handleMouseEnter = (segmentId: number, color: string) => {
    console.log("Segment hovered:", segmentId, color);
  };

  const handleMouseLeave = (segmentId: number) => {};

  return (
    <TooltipProvider>
      <div className="flex flex-col space-y-2 p-2">
        {segments &&
          segments.length > 0 &&
          segments.map((segment: MaterialSegmentModel, index: number) => {
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
                        handleMouseEnter(segment.id, segment.color_code || "")
                      }
                      onMouseLeave={() => handleMouseLeave(segment.id)}
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
      </div>
    </TooltipProvider>
  );
};

export default AllSegments;
