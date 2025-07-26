import { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import {
  // fetchJobsByProject,
  clearError as clearJobError,
  clearCurrentJob,
} from "@/redux/slices/jobSlice";

import { canEditProject } from "@/middlewares/authMiddleware";
import {  StudioMainCanvas } from "@/components/studio";
// import { ShareProjectDialog } from '@/components/ShareProjectDialog';
import { toast } from "sonner";

import { updateActiveTab } from "@/redux/slices/visualizerSlice/workspaceSlice";

import SwatchBookDataHome from "@/components/swatchBookData/SwatchBookDataHome";


import WorkSpaceHome from "@/components/workSpace/WorkSpaceHome";
import { clearCurrentImage } from "@/redux/slices/studioSlice";
import JobHome from "@/components/job/JobHome";
import {
  
  setIsCanvasModalOpen,
} from "@/redux/slices/canvasSlice";
import ModelCanvas from "@/components/workSpace/projectWorkSpace/modelCanvas/ModelCanvas";

import CreateMaterArray from "@/components/studio/segment/CreateMaterArray";
import dzinlylogo from "../../public/assets/image/dzinly-logo.svg";
import { Button } from "@/components/ui/button";
import CanvasAdddNewSegmentHome from "@/components/canvas/canvasAddNewSegment/CanvasAdddNewSegmentHome";

//type DrawingTool = "select" | "polygon";
import { IoMdArrowRoundBack } from "react-icons/io";
import { resetSegmentSlice } from "@/redux/slices/segmentsSlice";
import { clearMasterArray } from "@/redux/slices/MasterArraySlice";
import GetSegments from "@/components/getSegments/GetSegments";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import StudioMainTabs from "@/components/studio/studioMainTabs/StudioMainTabs";

export function StudioPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
  
    error: jobError,
    isCreating: isJobRunning,
  } = useSelector((state: RootState) => state.jobs);
  const {  currentProject } = useSelector(
    (state: RootState) => state.projects
  );
  const { activeTab: activeTabFromStore } = useSelector(
    (state: RootState) => state.workspace
  );

  // const activeTab = useRef<string>("inspiration");
 
  const [currentCanvasImage, setCurrentCanvasImage] = useState<string>("");

  const { isCanvasModalOpen } = useSelector((state: RootState) => state.canvas);

  // Check permissions
  const canEdit = projectId ? canEditProject(projectId) : false;

 
  const { currentImageUrl } = useSelector((state: RootState) => state.studio);
  const { addSegMessage } = useSelector((state: RootState) => state.segments);

  const [loadingMessage, setLoadingMessage] = useState("");
  // update message

  useEffect(() => {
    if (addSegMessage) {
      setLoadingMessage(addSegMessage);
    } else {
      setLoadingMessage("");
    }
  }, [addSegMessage]);

  useEffect(() => {
    if (currentImageUrl && currentImageUrl !== "") {
      setCurrentCanvasImage(currentImageUrl);
    } else {
      setCurrentCanvasImage("");
    }
  }, [currentImageUrl]);

  useEffect(() => {
    if (jobError) {
      toast.error(jobError);
      dispatch(clearJobError());
    }
  }, [jobError, dispatch]);


  const handleFileUpload = async (file: File) => {
    if (!canEdit) {
      toast.error("You do not have permission to upload images");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast.error("File size must be less than 10MB");
      return;
    }
  };


  useEffect(() => {
    if (!activeTabFromStore) {
      dispatch(updateActiveTab("inspiration"));
    }
  }, [dispatch, activeTabFromStore]);

  const handleCloseMask = () => {
    dispatch(setIsCanvasModalOpen(false));
  };

  const handleBackToProject = () => {
    dispatch(resetSegmentSlice());
    dispatch(clearCurrentJob());
    dispatch(clearMasterArray());
    navigate("/projects");
  };
  return (
    <>
      {loadingMessage && loadingMessage.trim() !== "" && (
        <LoadingOverlay message={loadingMessage} />
      )}
      <div className="flex sm:flex-row flex-col md:h-screen bg-background relative">
        {/* <Breadcrumb /> */}
        <div className="w-full md:w-1/4 border-r overflow-hidden hidden md:block">
          <div className="py-3 pt-2 px-4 flex items-center justify-between align-center">
            <div className="text-start">
              {/* <Link to="/"> */}{" "}
              <img
                className="w-44 text-center"
                src={dzinlylogo}
                alt="dzinly logo"
              ></img>
              {/* </Link> */}
            </div>
            {/* <Link to="/"> */}
            <Button
              className="flex items-center space-x-2 h-8 mt-1 py-1 rounded-2 text-sm border-gray-200 bg-white text-gray-800 hover:bg-gray-50 shadow-transparent "
              onClick={handleBackToProject}
            >
              <IoMdArrowRoundBack className="w-4 h-4" />
              <span>Back</span>
            </Button>
            {/* </Link> */}
          </div>
          <StudioMainTabs />

        </div>

        {/* Main Canvas */}

        {activeTabFromStore === "design-hub" ? (
          <StudioMainCanvas
            // currentCanvasImage={currentCanvasImage}
            isUploading={true}
            canEdit={canEdit}
            isJobRunning={isJobRunning}
            onFileUpload={handleFileUpload}
            onClearImage={() => dispatch(clearCurrentImage())}
          />
        ) : (
          <>
            {/* inspiration tab content */}
            <WorkSpaceHome />
          </>
        )}

        <SwatchBookDataHome />

        {/* get all GenAi Image based on job ID */}
        {/* <GetGenAiImageJobIdBased /> */}

        <JobHome selectedProjectId={currentProject?.id || undefined} />

        {isCanvasModalOpen && (
          <ModelCanvas
            isCanvasModalOpen={isCanvasModalOpen}
            onClose={handleCloseMask}
          />
        )}

        <CreateMaterArray />
      </div>

      <CanvasAdddNewSegmentHome />
      {/* get all segments based on job Id */}
      <GetSegments />
    </>
  );
}
