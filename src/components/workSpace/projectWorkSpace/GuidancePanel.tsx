import React, { useEffect, useRef, useState } from "react";
import { CiImageOn } from "react-icons/ci";

import AddInspiration from "./AddInspiration";
import { useDispatch, useSelector } from "react-redux";
import {
  getIsAddInspiration,
  setIsAddInspiration,
  setIsGenerated,
  updateIsGenLoading,
} from "@/redux/slices/visualizerSlice/workspaceSlice";
import { TbBulb } from "react-icons/tb";
import { TbBulbFilled } from "react-icons/tb";

import ProjectHistory from "./ProjectHistory";
import { HiOutlineSparkles } from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { AppDispatch, RootState } from "@/redux/store";
import UserInputPopOver from "./userInputPopOver";
import {
  addPrompt,
  resetInspirationImage,
  submitGenAiRequest,
  resetIsGenAiSumitFailed,
  resetPaletteImage,
} from "@/redux/slices/visualizerSlice/genAiSlice";
import AiGuideance from "./AiGuideance";
import { IoIosHelpCircleOutline } from "react-icons/io";
import {
  GenAiRequest,
} from "@/models/genAiModel/GenAiModel";

import { toast } from "sonner";
import VoiceRecognition from "./VoiceRecognition";
import { useParams } from "react-router-dom";
import { StyleSuggestions } from "@/models/projectModel/ProjectModel";
import { setCurrentTabContent } from "@/redux/slices/studioSlice";
import Loading from "@/components/loading/Loading";
import ImageComparisonModal from "@/components/workSpace/projectWorkSpace/renameGenAiImage/RenameGenAiNameModal";
import RenameGenAiHome from "./renameGenAiImage/RenameGenAiHome";

// import GenAiImages from "../compareGenAiImages/GenAiImages";

const GuidancePanel: React.FC = () => {
  const [showActionButtons, setShowActionButtons] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { list: projects } = useSelector((state: RootState) => state.projects);
  const { loading: renameGenAiLoading } = useSelector((state: RootState) => state.genAi);
  const { id } = useParams();
  const suggestions = projects.find((d) => d.id == id)?.analysed_data
    ?.style_suggestions;
  const randomSuggestions = suggestions
    ? [...suggestions].sort(() => Math.random() - 0.5).slice(0, 3)
    : [];
  const [suggestedPrompt, setSuggestedPrompt] = useState<
    StyleSuggestions[] | null
  >(randomSuggestions);

  const [isModel, setIsModel] = React.useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isPromptPopoverOpen, setIsPromptPopoverOpen] = React.useState(false);
  const [isInspirationImagePopoverOpen, setIsInspirationImagePopoverOpen] = React.useState(false);
  const [isPaletteImagePopoverOpen, setIsPaletteImagePopoverOpen] = React.useState(false);
  const [showComparisonModal, setShowComparisonModal] = React.useState(false);

  const currentPageDetails = projects.find((d) => d.id == id);

  const [isTask, setIsTask] = React.useState<boolean>(false);

  // Use separate state variables for each popover

  const { requests, inspirationNames, isSubmitGenAiFailed } = useSelector(
    (state: RootState) => state.genAi
  );
  const { isGenLoading } = useSelector((state: RootState) => state.workspace);
  const getIsAddInspirations = useSelector(getIsAddInspiration);
  // update the model open and closing

  const url = currentPageDetails?.jobData?.[0].full_image;

  // const [req, setReq] = useState({
  //   houseUrl: [url],
  //   prompt: [],
  //   annotationValue: {},
  //   externalUserId: "dzinly-prod",
  //   imageQuality: "medium",
  //   jobId: "",
  //   paletteUrl: [],
  //   referenceImageUrl: [],
  // });


  useEffect(() => {
    if (getIsAddInspirations) {
      setIsModel(getIsAddInspirations);
    } else {
      setIsModel(false);
    }
  }, [getIsAddInspirations]);

  // check if the genAi submit failed
  useEffect(() => {
    if (isSubmitGenAiFailed) {
      toast.error("Failed to submit GenAI request. Please try again.");
      dispatch(resetIsGenAiSumitFailed(false));
      dispatch(updateIsGenLoading(false));
      dispatch(setIsGenerated(false));
    }
  }, [isSubmitGenAiFailed, dispatch]);
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
    if (!value || value.trim() !== "") {
      dispatch(addPrompt(value));
    }
  };

  const handleDelete = (data: string) => {
    dispatch(setCurrentTabContent("home"));
    if (data === "user-prompt") {
      dispatch(addPrompt(""));
    } else if (data === "inspiration-image") {
      dispatch(resetInspirationImage());
    } else if (data === "palette-image") {
        dispatch(resetPaletteImage())
      
    }
  };

  const handleGenerateAiImage = async () => {
    if (!requests.houseUrl || requests.houseUrl.length === 0 || !requests.prompt || requests.prompt.length === 0) return toast.error("Please provide prompt before generating AI image.");
    dispatch(updateIsGenLoading(true));
    // Logic to generate AI image
    try {


      dispatch(
        submitGenAiRequest(requests as GenAiRequest)
      );

    } catch (error) {
      toast.error("Error generating AI image: " + (error as Error).message);


    }
  };



  const handleRandomPromptSelection = (prompt: string) => {
    if (prompt) {
      dispatch(addPrompt(prompt));
      setShowActionButtons(false);
    }
  };

  // Ref for suggestions panel
  const suggestionsRef = React.useRef<HTMLDivElement | null>(null);

  const handleBulbClick = () => {
    if (!showActionButtons) {
      setSuggestedPrompt(randomSuggestions);
      setShowActionButtons(true);

      // Wait for the DOM to update, then scroll
      setTimeout(() => {
        suggestionsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100); // Small delay to ensure render
    } else {
      setShowActionButtons(false);
      setSuggestedPrompt(null);
    }
  };

  // Handle design save
  const handleDesignSave = (designName: string) => {

    // Add your save logic here
    toast.success(`Design "${designName}" saved successfully!`);
  };

  // Example function to open comparison modal (you can call this after AI generation)
  const handleShowComparison = () => {
    setShowComparisonModal(true);
  };


  const taRef = useRef<HTMLTextAreaElement | null>(null);

// helper: grow/shrink to fit content
const autosize = (el: HTMLTextAreaElement, opts?: { minRows?: number; maxRows?: number }) => {
  const { minRows, maxRows } = opts || {};
  const cs = window.getComputedStyle(el);
  const lineHeight = parseFloat(cs.lineHeight || "20");

  // optional caps
  const minH = minRows ? minRows * lineHeight : 0;
  const maxH = maxRows ? maxRows * lineHeight : Infinity;

  el.style.height = "auto";
  const h = Math.max(minH, Math.min(el.scrollHeight, maxH));
  el.style.height = `${h}px`;
  el.style.overflowY = el.scrollHeight > h ? "auto" : "hidden";
};

// run on mount and whenever value changes
useEffect(() => {
  if (taRef.current) autosize(taRef.current, { minRows: 2, maxRows: 12 });
}, [requests.prompt]);


  return (
    <>
      {
        isGenLoading || renameGenAiLoading &&
        <Loading
          backgroundImage='/assets/image/dzinlylogo-icon.svg' // Use the correct path to your logo image
        />}
      {showGuide && <AiGuideance onClose={() => setShowGuide(false)} />}

      {/* Image Comparison Modal */}
      <ImageComparisonModal
        openModal={showComparisonModal}
        onclose={() => setShowComparisonModal(false)}
        beforeImage={url || "/assets/image/logo.svg"} // Use actual before image
        afterImage={url || "/assets/image/logo.svg"} // Use actual generated image
        onSave={handleDesignSave}
        prompt={requests.prompt?.[0] || "Change wall color to lemon green"}
      />

      <div className={`bg-white rounded-sm p-4 border border-gray-200 mx-4 mb-4`}>
        <div className="flex items-center">
          <h2 className="text-lg font-semibold ">AI Guidance</h2>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <IoIosHelpCircleOutline className="ms-2 text-xl text-gray-500 cursor-pointer " />
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

            <VoiceRecognition />
          </TooltipProvider>
          {/* provide mic icon  */}
        </div>
       <textarea
  ref={taRef}
  className="w-full p-2 ps-0 pt-0 border-0 focus:outline-none focus:ring-0 rounded mb-1 resize-none overflow-hidden"
  placeholder="Enter guidance..."
  rows={2}                       // initial min rows
  value={requests.prompt}
  onChange={(e) => {
    handleAddPrompt(e.currentTarget.value);
    if (taRef.current) autosize(taRef.current, { minRows: 2, maxRows: 12 }); // instant resize
  }}
  // (optional) hard caps too:
  style={{ maxHeight: "24rem" }} // ~12 rows if line-height ~32px; tweak as you like
/>

   

          {/* <div className="relative flex gap-2 mb-4 flex-wrap">

          {requests.prompt && requests.prompt.length > 0 && (
            <UserInputPopOver
              inputKey="user-prompt"
              name="user-prompt"
              value={requests.prompt[0]}
              open={isPromptPopoverOpen}
              setOpen={setIsPromptPopoverOpen}
              deleteData={handleDelete} 
            />
          )}

          

        
          {
            requests.paletteUrl && requests.paletteUrl.length > 0 && requests.paletteUrl[0] !== "" && (
              <UserInputPopOver
                inputKey="palette-image"
                name="palette-image"
                value={requests.paletteUrl[0]}
                open={isPaletteImagePopoverOpen}
                setOpen={setIsPaletteImagePopoverOpen}
                deleteData={handleDelete}
              />
            )}
        
          {requests.referenceImageUrl &&
            requests.referenceImageUrl.length > 0 &&
            requests.referenceImageUrl[0] !== "" && (
              <UserInputPopOver
                inputKey="inspiration-image"
                name={inspirationNames}
                value={requests.referenceImageUrl[0]}
                open={isInspirationImagePopoverOpen}
                setOpen={setIsInspirationImagePopoverOpen}
                deleteData={handleDelete}
              />
            )}

         </div> */}


          <div className={`flex gap-3 md-gap-0 md:flex justify-between items-between`}>
            <div className="flex items-center">
              <ProjectHistory />

              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-sm text-blue-600 border border-gray-300 bg-transparent me-2 flex items-center justify-center gap-1 rounded-md md:px-3 md:py-2 px-3 py-1">
                      <HiOutlineSparkles className="text-xl" />
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
                className="text-sm border border-gray-300 flex align-middle gap-1 md:px-3 md:py-2 px-3 py-1 rounded-md"
                onClick={handleAddInspirational}
              >
                <CiImageOn className="text-lg" />{" "}
                <span className="hidden md:block">Add Inspiration</span>
              </button>
            </div>

            <div className="flex items-center gap-2 justify-end">
              {/* Toggle Button - Always Visible */}
              <button
                className="text-sm border border-gray-300 rounded-full bg-transparent flex items-center justify-center gap-1 px-1 py-1 focus:outline-none focus:ring-0"
                onClick={handleBulbClick}
              >
                {showActionButtons ? (
                  <TbBulbFilled size={28} className="text-yellow-300 w-6 h-6" />
                ) : (
                  <TbBulb size={28} className="w-6 h-6" />
                )}
              </button>

              <button
                className={`px-4 py-1 ${isTask ? "bg-gray-400" : "bg-blue-600"
                  } text-white rounded`}
                onClick={handleGenerateAiImage}
                disabled={isTask || isGenLoading}
              >
                {isGenLoading ? "Processing..." : "Visualize"}
              </button>

              {/* Test button for comparison modal */}
              {/* <button
              className="px-3 py-1 bg-purple-600 text-white rounded text-sm"
              onClick={handleShowComparison}
            >
              Compare
            </button> */}
            </div>
          </div>

          {showActionButtons && suggestedPrompt && (
            <div
              ref={suggestionsRef}
              className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex flex-col gap-3 mb-3 mt-6"
            >
              {suggestedPrompt.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 rounded-xl p-3 border flex items-center justify-between border-black/10 cursor-pointer" onClick={() => handleRandomPromptSelection(suggestion.prompt)}
                >
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {suggestion.title}
                    </h3>
                    <p className="text-sm text-gray-800 leading-snug mb-2">
                      {suggestion.prompt}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRandomPromptSelection(suggestion.prompt)}
                    className="px-3 py-1 bg-black text-white text-xs rounded-md hover:bg-gray-900 transition"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          )}
 

        {/* Only render Call_task_id when there's an active task */}
        {/* {taskId && taskId !== "" && isTask && (
        <Call_task_id
          taskId={taskId}
          resetChatTask={handleResetStartApiCall}
          resetChatTaskFail={handleResetFaiApiCall}
        />
      )} */}
        <RenameGenAiHome />
      </div>
    </>
  );
};

export default GuidancePanel;
