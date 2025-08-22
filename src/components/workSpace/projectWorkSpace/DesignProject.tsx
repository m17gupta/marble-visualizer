import "./DesignProjectEffect.css";
import React, { useEffect, useRef, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTabContent } from "@/redux/slices/studioSlice";
import {
  addHouseImage,
  addInspirationImage,
  addPaletteImage,
  addPrompt,
  deleteGenAiChat,
  resetRequest,
  setCurrentGenAiImage,
  updateIsRenameGenAiModal,
} from "@/redux/slices/visualizerSlice/genAiSlice";
import { setIsGenerated } from "@/redux/slices/visualizerSlice/workspaceSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { GenAiChat } from "@/models/genAiModel/GenAiModel";
import { toast } from "sonner";

const DesignProject = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [componentError, setComponentError] = useState<string | null>(null);
  const [allGenAiImages, setAllGenAiImages] = useState<GenAiChat[]>([]);

  const { genAiImages, error, isFetchingGenAiImages, currentGenAiImage } =
    useSelector((state: RootState) => state.genAi);

  console.log("DesignProject component mounted", currentGenAiImage);
  // Update all GenAiImages
  useEffect(() => {
    try {
      if (genAiImages && genAiImages.length > 0) {
        // Sort the genAiImages based on created date, latest first
        // const sortedImages = [...genAiImages].sort(
        //   (a, b) =>
        //     new Date(b.created).getTime() - new Date(a.created).getTime()
        // );
        setAllGenAiImages(genAiImages);
      } else {
        setAllGenAiImages([]);
      }
      setComponentError(null);
    } catch (err) {
      setComponentError(err instanceof Error ? err.message : "Unknown error");
    }
  }, [genAiImages]);

  const handleImageSwitch = (imageSet: GenAiChat) => {
    dispatch(setIsGenerated(true));
    dispatch(setCurrentGenAiImage(imageSet));
    dispatch(setCurrentTabContent("compare"));
    dispatch(addInspirationImage(imageSet.reference_img));
    dispatch(addPaletteImage(imageSet.palette_image_path));
    dispatch(addHouseImage(imageSet.master_image_path));
    dispatch(addPrompt(imageSet.user_input_text));
  };

  const handleInspirationSection = () => {
    dispatch(setCurrentTabContent("home"));
    dispatch(setCurrentGenAiImage(null));
    dispatch(setIsGenerated(false));
    dispatch(resetRequest());
  };
  const isProcessing = useRef<boolean>(true);

  const handleDeleteGenAiImage = async (genId: string) => {
    isProcessing.current = true;
    try {
      const response = await dispatch(deleteGenAiChat(genId)).unwrap();
      if (response.success) {
        toast.success("Image deleted successfully");
        isProcessing.current = false;
        // Optionally, you can also remove the image from the local state
      }
    } catch (error) {
      isProcessing.current = false;
      toast.error("Failed to delete image");
      console.error("Error deleting GenAiImage:", error);
      setComponentError(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };

  const handleRenameGenAiImage = (imageSet: GenAiChat) => {
    dispatch(updateIsRenameGenAiModal(true));
    dispatch(setCurrentGenAiImage(imageSet));
  };
  return (
    <div
      className={`flex items-baseline justify-between gap-4 px-4 py-2 bg-white rounded-md mb-4
    `}
    >
      {/* Design buttons scrollable */}
      <div className="flex gap-2 overflow-x-auto scroll-thin pr-2 max-w-full pb-2">
        {/* Show error state */}
        {(error || componentError) && (
          <div className="flex items-center justify-center p-4 text-red-500 bg-red-50 rounded-lg mb-4">
            <p className="text-sm">Error: {error || componentError}</p>
          </div>
        )}

        {/* Show loading state */}
        {isFetchingGenAiImages && (
          <div className="flex items-center justify-center p-4 text-gray-500">
            <p className="text-sm">Loading images...</p>
          </div>
        )}
        {/* Show empty state */}
        {!isFetchingGenAiImages && genAiImages.length === 0 && (
          <div className="flex items-center justify-center p-4 text-gray-500">
            <p className="text-sm">No generated images available</p>
          </div>
        )}
        {allGenAiImages &&
          allGenAiImages.length > 0 &&
          allGenAiImages.map((label, index) => {
            const isActive =
              currentGenAiImage && label.id === currentGenAiImage.id;
            // Replace with your actual processing condition
            return (
              <div
                key={index}
                className={`flex items-center border rounded-md shadow-sm text-sm flex-shrink-0 focus-ring-0 focus:ring-blue-500 focus:outline-none transition-colors duration-200
                  ${
                    isActive
                      ? "bg-blue-100 border-blue-500"
                      : "bg-white border-gray-300"
                  }
                  `}
              >
                <button
                  onClick={() => handleImageSwitch(label)}
                  className={`px-2 py-1 bg-transparent hover:border-transparent rounded-l-md focus-ring-0 focus:ring-blue-500 focus:outline-none transition-colors duration-200 ${
                    isActive ? "text-blue-700 font-semibold" : "text-gray-800"
                  }`}
                >
                  {label.name ? label.name : `Design ${index + 1}`}
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 pr-2 bg-transparent bg-transparent hover:border-transparent rounded-r-md focus-ring-0 focus:ring-blue-500 focus:outline-none"
                    >
                      <BsThreeDotsVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-36" align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => console.log("Share", label)}
                      >
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRenameGenAiImage(label)}
                      >
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteGenAiImage(label.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
      </div>

      {/* Back to Inspiration Button */}
      {currentGenAiImage && currentGenAiImage !== null && (
        <button
          className="px-4 py-1 bg-violet-600 text-white text-sm rounded hover:bg-violet-700 flex-shrink-0"
          onClick={handleInspirationSection}
        >
          <span className="hidden sm:inline">Exit Compare</span>
          <span className="inline sm:hidden">Back</span>
        </button>
      )}
    </div>
  );
};

export default DesignProject;
