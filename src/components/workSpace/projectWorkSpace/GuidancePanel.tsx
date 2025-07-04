import React, { useEffect } from "react";
import { CiImageOn } from "react-icons/ci";
import AddInspiration from "./AddInspiration";
import { useDispatch, useSelector } from "react-redux";
import {
  getIsAddInspiration,
  setIsAddInspiration,
} from "@/redux/slices/visualizerSlice/workspaceSlice";

import ProjectHistory from "./ProjectHistory";
import { HiOutlineSparkles } from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FcIdea } from "react-icons/fc";

import { RootState } from "@/redux/store";
import UserInputPopOver from "./userInputPopOver";
import {
  addPrompt,
  resetInspirationImage,
} from "@/redux/slices/visualizerSlice/genAiSlice";
import AiGuideance from "./AiGuideance";

const GuidancePanel: React.FC = () => {
  const dispatch = useDispatch();

  const { requests } = useSelector((state: RootState) => state.genAi);
  const getIsAddInspirations = useSelector(getIsAddInspiration);
  const [isModel, setIsModel] = React.useState(false);
  // Use separate state variables for each popover
  const [isPromptPopoverOpen, setIsPromptPopoverOpen] = React.useState(false);
  const [isImagePopoverOpen, setIsImagePopoverOpen] = React.useState(false);

  // update the model open and closing

  useEffect(() => {
    if (getIsAddInspirations) {
      setIsModel(getIsAddInspirations);
    } else {
      setIsModel(false);
    }
  }, [getIsAddInspirations]);
  const handleAddInspirational = () => {
    dispatch(setIsAddInspiration(true));
  };

  const handleCloseModel = () => {
    dispatch(setIsAddInspiration(false));
    setIsModel(false);
  };

  const handleSubmit = () => {
    console.log("Submitted data:");

    // Handle the submitted data here
    // For example, you can dispatch an action to save the inspiration
    // dispatch(saveInspiration(data));
  };

  // add prompt
  const handleAddPrompt = (value: string) => {
    console.log("Prompt value:", value);
    if (!value || value.trim() !== "") {
      dispatch(addPrompt(value));
    }
  };

  const handleDelete = (data: string) => {
    if (data === "user-prompt") {
      // Clear the prompt value
      dispatch(addPrompt(""));
    } else if (data === "inspiration-image") {
      // Clear the reference image URL
      dispatch(resetInspirationImage());
    }
  };

  return (
    <>

       <AiGuideance/>
  

      <div className="p-4 bg-white rounded-sm">
        <h2 className="text-lg font-semibold mb-2">AI Guidance</h2>
        <textarea
          className="w-full p-2 ps-0 pt-0 border-0 focus:outline-none focus:ring-0 rounded mb-1 resize-none"
          placeholder="Enter guidance..."
          rows={2}
          value={requests.prompt}
          onChange={(e) => {
            handleAddPrompt((e.currentTarget as HTMLTextAreaElement).value);
          }}
        />

        <div className="flex flex-wrap gap-2 mb-4">
          {/* Prompt Tag */}
          {requests.prompt && requests.prompt.length > 0 && (
            <UserInputPopOver
              inputKey="user-prompt"
              value={requests.prompt[0]}
              open={isPromptPopoverOpen}
              setOpen={setIsPromptPopoverOpen}
              deleteData={handleDelete} // Clear prompt on delete
            />
          )}

          {/* inspiration Image Y  */}
          {requests.referenceImageUrl &&
            requests.referenceImageUrl.length > 0 && (
              <UserInputPopOver
                inputKey="inspiration-image"
                value={requests.referenceImageUrl[0]}
                open={isImagePopoverOpen}
                setOpen={setIsImagePopoverOpen}
                deleteData={handleDelete}
              />
            )}
        </div>

        <div className="flex justify-between items-between">
          <div className="flex items-center">
            <ProjectHistory />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-sm text-blue-600 border border-gray-300 bg-transparent me-2 flex items-center justify-center gap-1 px-3 py-2 rounded-md">
                    <HiOutlineSparkles className="text-lg" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-black text-white text-xs px-2 py-1 rounded-md">
                  Enhance Guidance
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <AddInspiration
              isOpen={isModel}
              onClose={handleCloseModel}
              onSubmit={handleSubmit}
            />
            <button
              className="text-sm border  border border-gray-300 flex align-middle gap-1"
              onClick={handleAddInspirational}>
              {" "}
              <CiImageOn className="text-lg" /> Add Inspiration
            </button>
          </div>
          <div className="flex items-center gap-2">
              
            <button className="btn bg-transparent rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 p-2">
              <FcIdea className="text-2xl" />
            </button>

            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Visualize
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default GuidancePanel;
