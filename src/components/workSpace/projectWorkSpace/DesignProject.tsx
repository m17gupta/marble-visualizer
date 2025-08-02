import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { setCurrentTabContent } from "@/redux/slices/studioSlice";
import { resetRequest } from "@/redux/slices/visualizerSlice/genAiSlice";
import { setIsGenerated } from "@/redux/slices/visualizerSlice/workspaceSlice";

const DesignProject = () => {
  const dispatch = useDispatch();

  const designs = ["Design 1", "Design 2", "Design 3", "Design 4", "Design 5"];

  const handleImageSwitch = (label: string) => {
    console.log("Switched to:", label);
  };

  const handleInspirationSection = () => {
    dispatch(setCurrentTabContent("home"));
    dispatch(setIsGenerated(false));
    dispatch(resetRequest());
  };

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2 bg-white rounded-md mb-4">
      {/* Design buttons scrollable */}
      <div className="flex gap-2 overflow-x-auto scroll-thin pr-2 max-w-full">
        {designs.map((label, index) => (
          <div
            key={index}
            className="flex items-center border rounded-md shadow-sm text-sm bg-white border-gray-300 flex-shrink-0 focus-ring-0 focus:ring-blue-500 focus:outline-none"
          >
            <button
              onClick={() => handleImageSwitch(label)}
              className="px-2 py-1 bg-transparent hover:border-transparent text-gray-800 bg-transparent rounded-l-md focus-ring-0 focus:ring-blue-500 focus:outline-none"
            >
              {label}
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
                  <DropdownMenuItem onClick={() => console.log("Share", label)}>
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log("Rename", label)}>
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => console.log("Delete", label)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {/* Back to Inspiration Button */}
     <button
  className="px-4 py-1 bg-violet-600 text-white text-sm rounded hover:bg-violet-700 flex-shrink-0"
  onClick={handleInspirationSection}
>
  <span className="hidden sm:inline">Back to Inspiration</span>
  <span className="inline sm:hidden">Back</span>
</button>

    </div>
  );
};

export default DesignProject;
