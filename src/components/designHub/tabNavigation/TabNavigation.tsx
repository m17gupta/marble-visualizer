import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {

  resetEditSegment,
  resetSelectedSegment,
  setActiveOption,

} from "@/redux/slices/segmentsSlice";

import { setCanvasType, updateSegTab } from "@/redux/slices/canvasSlice";

import { LuBrickWall } from "react-icons/lu";

type Props = {
  title?: string;
  segment?: SegmentModal;
  handleEditOption: (val: boolean, data: string) => void;
};
const TabNavigation = ({ title, segment, handleEditOption }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeOption } = useSelector((state: RootState) => state.segments);
  const buttons = [
    {
      id: "pallet",
      tooltip: "Pallet",
      icon: <LuBrickWall fontSize={"20px"} color="#000" />,
    },

    {
      id: "add-segment",
      tooltip: "Add Segment",
      icon: (
        <img
          src="/assets/image/solar--home-line-duotone 1 (1).svg"
          alt="Add Segment"
          className="w-5 h-5"
        />
      ),
    },

    {
      id: "edit-segment",
      tooltip: "Edit Segment",
      icon: (
        <img
          src="/assets/image/line-md--edit-twotone.svg"
          alt="Edit Segment"
          className="w-5 h-5"
        />
      ),
    },
    {
      id: "edit-annotation",
      tooltip: "Edit Annotation",

      icon: (
        <img
          src="/assets/image/carbon--area.svg"
          alt="Edit"
          className="w-5 h-5"
        />
      ),
    },
    {
      id: "information",
      tooltip: "Information",
      icon: (
        <img
          src="/assets/image/solar--info-square-linear.svg"
          alt="Information"
          className="w-5 h-5"
        />
      ),
    },
  ];




  // const handleDeleteSegment = async (segmentId: number) => {
  //   try {
  //     const response = await dispatch(deleteSegmentById(segmentId)).unwrap();

  //     if (response && response.success) {
  //       // delete segment from master array
  //       dispatch(deleteSegment(segmentId));
  //       toast.success("Segment deleted successfully");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting segment:", error);
  //   }
  // };


  // useEffect(() => {
  //   if (activeOption == null) {
  //     setActive("pallet");
  //   } 
  //   if (activeOption) {
      
  //     setActive(activeOption);
  //   }
  // }, [activeOption]);

  const handleOptionSelect = (val: string) => {
    // prevent redundant dispatches that can cause re-renders/loops
    if (activeOption === val) return;

    dispatch(resetSelectedSegment());
    dispatch(updateSegTab(val));
    dispatch(resetEditSegment());
    dispatch(setActiveOption(val));
    if (val === "add-segment" || val === "pallet") {
      dispatch(setCanvasType(val === "add-segment" ? "draw" : "hover"));
      handleEditOption(false, val);
    } else if (val === "edit-annotation") {
      dispatch(setCanvasType("hover"));
      handleEditOption(true, val);
    } else if (val === "information") {
      dispatch(setCanvasType("hover"));
      handleEditOption(false, val);
    } else {
      console.log("edit segment", val);
      dispatch(setCanvasType("hover"));
      handleEditOption(true, val);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center justify-center gap-2 px-4 py-2 border-b border-gray-200 bg-muted text-muted-foreground">
        {buttons.map((btn) => {
          return (
            <Tooltip key={btn.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleOptionSelect(btn.id)}
                  className={`px-3 py-1 rounded-md border transition-colors focus:outline-none focus:ring-0 focus:ring-blue-400
                  ${
                    activeOption === btn.id
                      ? "bg-white text-white border-gray-400"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
                  }`}
                >
                  {btn.icon}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{btn.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default TabNavigation;
