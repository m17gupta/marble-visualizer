import React, { useEffect, useState } from "react";

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
  deleteSegmentById,
  setActiveOption,
  updateIsSegmentEdit,
} from "@/redux/slices/segmentsSlice";
import {
  deleteSegment,
  updateSelectedSegment,
} from "@/redux/slices/MasterArraySlice";
import { setCanvasType } from "@/redux/slices/canvasSlice";
import { toast } from "sonner";
import DeleteModal from "@/pages/projectPage/deleteProject/DeleteModel";
import { RiHome8Line, RiHomeOfficeLine } from "react-icons/ri";

type Props = {
  title?: string;
  segment?: SegmentModal;
  handleEditOption: (val: boolean, data: string) => void;
};
const TabNavigation = ({ title, segment, handleEditOption }: Props) => {
  const [active, setActive] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { activeOption } = useSelector((state: RootState) => state.segments);
  const buttons = [

    {
      id: "pallet",
      tooltip: "Pallet",
      icon: (
    
        <RiHomeOfficeLine fontSize={"20px"} color="#000"/>
      ),
    },

    {
      id: "add-segment",
      tooltip: "Add Segment",
      icon: (
        <img
          src="/assets/image/solar--home-line-duotone 1 (1).svg"
          alt="Add Segment"
          className="h-5 w-5"
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
          className="h-5 w-5"
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
          className="h-5 w-5"
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
          className="h-5 w-5"
        />
      ),
    },
  ];

  const handlepallet = (segment: SegmentModal) => {
    dispatch(updateSelectedSegment(segment));
    dispatch(setCanvasType("reannotation"));
    // Implement your re-annotation logic here
  };


  const handleEditSegment = (segment: SegmentModal) => {
    dispatch(updateSelectedSegment(segment));
    dispatch(updateIsSegmentEdit(true));
    // Implement your edit logic here
  };

  const handleReAnnotation = (segment: SegmentModal) => {
    dispatch(updateSelectedSegment(segment));
    dispatch(setCanvasType("reannotation"));
    // Implement your re-annotation logic here
  };

  const handleEditSegmentAnnotation = (segment: SegmentModal) => {
    dispatch(updateSelectedSegment(segment));
    dispatch(setCanvasType("edit"));
  };

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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const handleCancelProjectDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };
  
  // update Active option
  useEffect(() => {
    if (activeOption == null) {
      setActive("pallet");
    } else if (activeOption) {
      setActive(activeOption);
    }
  }, [activeOption]);

  const handleOptionSelect = (val: string) => {
    dispatch(setActiveOption( val));
    if (val === "add-segment"|| val === "pallet") {
      dispatch(setCanvasType(val==="add-segment" ? "draw" : "hover"));
      handleEditOption(false, val);
      // setActive(val);
    }
     else {
      dispatch(setCanvasType("hover"));
      handleEditOption(true, val);
      // setActive(val);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center justify-center px-4 py-2 bg-muted text-muted-foreground border-b border-gray-200 gap-2">
        {buttons.map((btn) => {
          return (
            <Tooltip key={btn.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleOptionSelect(btn.id)}
                  className={`px-3 py-1 rounded-md border transition-colors focus:outline-none focus:ring-0 focus:ring-blue-400
                  ${
                    active === btn.id
                      ? "bg-blue-100 text-white border-blue-800"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
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
