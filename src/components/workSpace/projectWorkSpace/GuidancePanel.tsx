import React, { useEffect, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import AddInspiration from "./AddInspiration";
import { useDispatch, useSelector } from "react-redux";
import {
  getIsAddInspiration,
  setIsAddInspiration,
  setIsGenerated,
  updateIsGenLoading,
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

import { AppDispatch, RootState } from "@/redux/store";
import UserInputPopOver from "./userInputPopOver";
import {
  addPrompt,
  resetInspirationImage,
  submitGenAiRequest,
  insertGenAiChatData,
  resetRequest,
} from "@/redux/slices/visualizerSlice/genAiSlice";
import AiGuideance from "./AiGuideance";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { GenAiChat, GenAiRequest, TaskApiModel } from "@/models/genAiModel/GenAiModel";
import Call_task_id from "./Call_task_id";
import { toast } from "sonner";


const GuidancePanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();


  const [isModel, setIsModel] = React.useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isPromptPopoverOpen, setIsPromptPopoverOpen] = React.useState(false);
  const [isImagePopoverOpen, setIsImagePopoverOpen] = React.useState(false);
  // Use separate state variables for each popover

  const { requests, inspirationNames } = useSelector((state: RootState) => state.genAi);
  const {isGenLoading}= useSelector((state: RootState) => state.workspace);
  const getIsAddInspirations = useSelector(getIsAddInspiration);
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

      dispatch(addPrompt(""));
    } else if (data === "inspiration-image") {

      dispatch(resetInspirationImage());
    }
  };

  const [taskId, setTaskId] = React.useState<string>("")

  const [isTask, setIsTask] = React.useState<boolean>(false)

  const handleGenerateAiImage = async () => {

    dispatch(updateIsGenLoading(true));
    // Logic to generate AI image
    try {
      const resultAction = await dispatch(submitGenAiRequest(requests as GenAiRequest));
      
      if (submitGenAiRequest.fulfilled.match(resultAction)) {
        const response = resultAction.payload;
        if (response && response.data && response.data.message === "Palette styling task started.") {
          // isApiCall.current = true; // Reset the flag for future API calls
          setTaskId(response.data.task_id);
          setIsTask(true);
        }
      }
    } catch (error) {
      console.error("Error generating AI image:", error);
    }
  };

  const { profile } = useSelector((state: RootState) => state.userProfile);
  const { list: jobList } = useSelector((state: RootState) => state.jobs);
  const { list: ProjectList } = useSelector((state: RootState) => state.projects);
  const handleResetStartApiCall = async (data: TaskApiModel) => {
     setTaskId("")
     setIsTask(false);
    console.log("Reset start API call with data:", data);
    const genChat: GenAiChat = {
      // Remove the id field to let Supabase generate a UUID automatically
     
      project_id: ProjectList[0]?.id || 0,
      // Fix for user_id - convert to number if string, and handle null profile
      user_id: profile?.id ,
      job_id: jobList[0]?.id || 0,
      master_image_path: requests.houseUrl && requests.houseUrl[0] ? requests.houseUrl[0] : "", 
      palette_image_path: requests.paletteUrl && requests.paletteUrl[0] ? requests.paletteUrl[0] : "", 
      reference_img: requests.referenceImageUrl && requests.referenceImageUrl[0] ? requests.referenceImageUrl[0] : "", 
      user_input_text: requests.prompt && requests.prompt[0] ? requests.prompt[0] : "", 
      output_image: data.outputImage,
      is_completed: true,
      is_show: true,
      prompt: data.prompt,
      task_id: data.taskId,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      // Fix openai_metadata type issue - convert null to undefined
      openai_metadata: data.openai_metadata ? JSON.stringify(data.openai_metadata) : undefined,
    } as GenAiChat
    console.log("GenAI chat data to be inserted:", genChat);
    try {
     const result = await dispatch(insertGenAiChatData(genChat));
      console.log("GenAI chat data inserted successfully");
      if (result.meta.requestStatus === 'fulfilled') {
        console.log("GenAI chat data inserted successfully:", result.payload);
         dispatch(resetRequest())
        dispatch(updateIsGenLoading(false));

        dispatch(setIsGenerated(true))

        
      }
    } catch (error) {
      toast.error("Error in reset start API call: " + (error as Error).message);
      console.error("Error in reset start API call:", error);
    }

    // setIsTask(false);
    // isApiCall.current = true;
    // dispatch(resetChatMarking())
    // resetStartApiCall(data); // Reset the parent component's state
  }
  /// fail task Api
  // Handle API call failure
  const handleResetFaiApiCall = (errorMessage: string) => {
    console.log("Task failed:", errorMessage);
    setIsTask(false);
    // isApiCall.current = true;
    // dispatch(resetChatMarking())
    // resetStartFailApiCall(data); // Reset the parent component's state
  }
  return (
    <>
      {showGuide && <AiGuideance onClose={() => setShowGuide(false)} />}

      <div className="p-4 bg-white rounded-sm">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold ">AI Guidance</h2>


          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <IoIosHelpCircleOutline className="ms-2 text-xl text-gray-500 cursor-pointer" />
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={6}
                className="bg-white text-black border border-gray-200 shadow-lg text-xs px-3 py-1.5 rounded-md"
              >
                Provide specific instructions to the AI for better results.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>


        </div>

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
              name="user-prompt"
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
                name={inspirationNames}
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

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-sm text-blue-600 border border-gray-300 bg-transparent me-2 flex items-center justify-center gap-1 px-3 py-2 rounded-md">
                    <HiOutlineSparkles className="text-lg" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-black text-white text-xs px-2 py-1 rounded-md"
                >
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



            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="btn bg-transparent rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 p-2"
                    onClick={() => setShowGuide(true)}
                  >
                    <FcIdea className="text-2xl" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-black text-white text-xs px-2 py-1 rounded-md"
                >
                  Suggested Next Steps
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>


            <button 
              className={`px-4 py-2 ${isTask ? 'bg-gray-400' : 'bg-blue-600'} text-white rounded`}
              onClick={handleGenerateAiImage}
              disabled={isTask}
            >
              {isGenLoading ? 'Processing...' : 'Visualize'}
            </button>
          </div>
        </div>
      </div>

      {/* Only render Call_task_id when there's an active task */}
      {taskId && taskId !== "" && (
        <Call_task_id
          taskId={taskId}
          resetChatTask={handleResetStartApiCall}
          resetChatTaskFail={handleResetFaiApiCall}
        />
      )}
    </>
  );
};
export default GuidancePanel;
