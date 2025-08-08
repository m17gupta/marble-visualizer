import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import { updateActiveTab } from "@/redux/slices/visualizerSlice/workspaceSlice";

import DesignHubContent from "./tabContent/DesignHubContent";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MeasurementContent from "./tabContent/MeasurementContent";
import LayerContent from "./tabContent/LayerContent";
import { setCurrentTabContent } from "@/redux/slices/studioSlice";
import Comments from "./tabContent/Comments";
import { setCurrentGenAiImage } from "@/redux/slices/visualizerSlice/genAiSlice";
import { setCanvasType } from "@/redux/slices/canvasSlice";
import StudioStyleTabs from "./StudioStyleTabs";

const StudioMainTabs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeTab: activeTabFromStore } = useSelector(
    (state: RootState) => state.workspace
  );
  const handleChangeTab = (value: string) => {
    dispatch(updateActiveTab(value));
    console.log("Tab changed to:", value);
  };

  const handleDesignHubClick = () => {
    // setActiveTab("design-hub");
    // console.log("Design Hub tab clicked");
    dispatch(updateActiveTab("design-hub"));
    dispatch(setCurrentTabContent("home"));
    dispatch(setCurrentGenAiImage(null)); // Reset current GenAI image when switching tabs
    // dispatch(setCanvasType("draw"));
  };

  const handleInspirationClick = () => {
    // setActiveTab("inspiration");
    dispatch(setCurrentTabContent("home"));
    dispatch(updateActiveTab("inspiration"));
  };

  const handleMeasurementClick = () => {
    // setActiveTab("measurement");
    dispatch(updateActiveTab("measurement"));
  };

  const handleLayersClick = () => {
    dispatch(updateActiveTab("layers"));
  };

  const handleCommentsClick = () => {
      dispatch(updateActiveTab("comments"));
  
    dispatch(setCanvasType("comment")); // Set canvas type to comment when Comments tab is clicked
  };
  return (
    <>
      <TooltipProvider>
        <Tabs
          value={activeTabFromStore ?? "inspiration"}
          onValueChange={handleChangeTab}
          className="w-full h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200 rounded-0 shadow-sm   gap-2 px-3 py-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="inspiration"
                  onClick={handleInspirationClick}
                  className={`flex flex-col items-center justify-center h-8 w-16 transition-all px-2 rounded-lg font-medium focus:outline-none ${activeTabFromStore === 'inspiration' ? 'bg-blue-200 text-blue-700 shadow font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-purple-700'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-house-icon lucide-house"
                  >
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>Inspiration</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="design-hub"
                  onClick={handleDesignHubClick}
                  className={`flex flex-col items-center justify-center h-8 w-16 transition-all px-2 rounded-lg font-medium focus:outline-none ${activeTabFromStore === 'design-hub' ? 'bg-blue-200 text-blue-700 shadow font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-purple-700'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-waypoints-icon lucide-waypoints"
                  >
                    <circle cx="12" cy="4.5" r="2.5" />
                    <path d="m10.2 6.3-3.9 3.9" />
                    <circle cx="4.5" cy="12" r="2.5" />
                    <path d="M7 12h10" />
                    <circle cx="19.5" cy="12" r="2.5" />
                    <path d="m13.8 17.7 3.9-3.9" />
                    <circle cx="12" cy="19.5" r="2.5" />
                  </svg>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>Design Hub</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="measurement"
                  onClick={handleMeasurementClick}
                  className={`flex flex-col items-center justify-center h-8 w-16 transition-all px-2 rounded-lg font-medium focus:outline-none ${activeTabFromStore === 'measurement' ? 'bg-blue-200 text-blue-700 shadow font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-purple-700'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-calculator-icon lucide-calculator"
                  >
                    <rect width="16" height="20" x="4" y="2" rx="2" />
                    <line x1="8" x2="16" y1="6" y2="6" />
                    <line x1="16" x2="16" y1="14" y2="18" />
                    <path d="M16 10h.01" />
                    <path d="M12 10h.01" />
                    <path d="M8 10h.01" />
                    <path d="M12 14h.01" />
                    <path d="M8 14h.01" />
                    <path d="M12 18h.01" />
                    <path d="M8 18h.01" />
                  </svg>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>Measurement</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="layers"
                  onClick={handleLayersClick}
                  className={`flex flex-col items-center justify-center h-8 w-16 transition-all px-2 rounded-lg font-medium focus:outline-none ${activeTabFromStore === 'layers' ? 'bg-blue-200 text-blue-700 shadow font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-purple-700'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-rows3-icon lucide-rows-3"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M21 9H3" />
                    <path d="M21 15H3" />
                  </svg>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>Layers</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="comments"
                  onClick={handleCommentsClick}
                  className={`flex flex-col items-center justify-center h-8 w-16 transition-all px-2 rounded-lg font-medium focus:outline-none ${activeTabFromStore === 'comments' ? 'bg-blue-200 text-blue-700 shadow font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-purple-700'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-message-square-plus-icon lucide-message-square-plus"
                  >
                    <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
                    <path d="M12 8v6" />
                    <path d="M9 11h6" />
                  </svg>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>Comment</TooltipContent>
            </Tooltip>
          </TabsList>

          <TabsContent value="design-hub" className="">
            <DesignHubContent />
          </TabsContent>

          <TabsContent value="inspiration" className="flex-grow overflow-auto">
            <StudioStyleTabs/>
        
          </TabsContent>

          <TabsContent value="measurement" className="flex-grow overflow-auto">
            {/* Measurement Content */}
            <MeasurementContent />
          </TabsContent>
          <TabsContent value="layers" className="flex-grow overflow-auto">
            <LayerContent />
          </TabsContent>

          <TabsContent value="comments" className="flex-grow overflow-auto">
            <Comments />
          </TabsContent>
        </Tabs>
      </TooltipProvider>
    </>
  );
};

export default StudioMainTabs;
