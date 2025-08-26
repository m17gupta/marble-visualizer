import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  deleteSegmentById,
  updateIsSegmentEdit,
} from "@/redux/slices/segmentsSlice";
import {
  deleteSegment,
  updateSelectedSegment,
} from "@/redux/slices/MasterArraySlice";
import { setCanvasType } from "@/redux/slices/canvasSlice";
import { toast } from "sonner";
import DeleteModal from "@/pages/projectPage/deleteProject/DeleteModel";

type Props = {
  title?: string;
  segment: SegmentModal;
};
const TabNavigation = ({ title, segment }: Props) => {
  const [active, setActive] = useState("palette");
  const dispatch = useDispatch<AppDispatch>();
  const buttons = [
    {
      id: "materials",
      tooltip: "Materials",
      icon: (
        <img
          src="/assets/image/line-md--arrows-vertical-alt.svg"
          alt="Materials"
          className="h-5 w-5"
        />
      ),
    },
    {
      id: "edit",
      tooltip: "Edit Options",
      isDropdown: true,
    },
    {
      id: "measurement",
      tooltip: "Measurement",
      icon: (
        <img
          src="/assets/image/line-md--gauge-loop.svg"
          alt="Information"
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

  const handleDeleteSegment = async (segmentId: number) => {
    try {
      const response = await dispatch(deleteSegmentById(segmentId)).unwrap();

      if (response && response.success) {
        // delete segment from master array
        dispatch(deleteSegment(segmentId));
        toast.success("Segment deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting segment:", error);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const handleCancelProjectDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="flex items-center justify-center px-4 py-2 bg-muted text-muted-foreground border-b border-gray-200 gap-2">
        {buttons.map((btn) => {
          if (btn.id === "edit") {
            return (
              <DropdownMenu key="edit">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={() => setActive("edit")}
                        className={`px-3 py-1 rounded-md border transition-colors focus:outline-none ${
                          active === "edit"
                            ? "bg-blue-50 text-white border-gray-800"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        <img
                          src="/assets/image/line-md--edit-twotone.svg"
                          alt="Edit"
                          className="h-5 w-5"
                        />
                      </button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{btn.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent className="w-44">
                  <DropdownMenuLabel>Edit Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleEditSegment(segment)}
                  >
                    <img
                      src="/assets/image/line-md--edit-twotone.svg"
                      alt="Edit"
                      className="h-4 w-4 mr-2"
                    />
                    Edit Segment
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleEditSegmentAnnotation(segment)}
                  >
                    <img
                      src="/assets/image/line-md--edit-twotone.svg"
                      alt="Edit"
                      className="h-4 w-4 mr-2"
                    />
                    Edit Annotation
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleReAnnotation(segment)}
                  >
                    <img
                      src="/assets/image/carbon--area.svg"
                      alt="Re-annotate"
                      className="h-4 w-4 mr-2"
                    />
                    Re-Annotation
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleOpenDeleteModal()}
                  >
                    <img
                      src="/assets/image/line-md--trash.svg"
                      alt="Delete"
                      className="h-4 w-4 mr-2"
                    />
                    Delete
                  </DropdownMenuItem>
                  {isDeleteModalOpen && (
                    // <DeleteModal
                    //   isOpen={isDeleteModalOpen}
                    //   onCancel={handleCancelProjectDelete}
                    //   handleDeleteSegment={handleDeleteSegment}
                    //   segment={segment}
                    // />

                    <DeleteModal
                      isOpen={isDeleteModalOpen}
                      onCancel={handleCancelProjectDelete}
                      type="segment"
                      segment={segment}
                      onDeleteSegment={handleDeleteSegment}
                    />
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          return (
            <Tooltip key={btn.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActive(btn.id)}
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
