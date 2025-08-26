import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import {
  // fetchJobsByProject,
  clearError as clearJobError,
  clearCurrentJob,
} from "@/redux/slices/jobSlice";

import RefreshHandler from "@/components/referesh/studioPage/RefreshHandler";

import { canEditProject } from "@/middlewares/authMiddleware";
import { StudioMainCanvas } from "@/components/studio";
// import { ShareProjectDialog } from '@/components/ShareProjectDialog';
import { toast } from "sonner";

import {
  resetWorkspace,
  updateActiveTab,
} from "@/redux/slices/visualizerSlice/workspaceSlice";

import SwatchBookDataHome from "@/components/swatchBookData/SwatchBookDataHome";

import WorkSpaceHome from "@/components/workSpace/WorkSpaceHome";
import {
  clearCurrentImage,
  setCurrentTabContent,
} from "@/redux/slices/studioSlice";
import JobHome from "@/components/job/JobHome";
import { resetCanvas, setIsCanvasModalOpen } from "@/redux/slices/canvasSlice";
import ModelCanvas from "@/components/workSpace/projectWorkSpace/modelCanvas/ModelCanvas";

import CreateMaterArrays from "@/components/studio/segment/CreateMaterArrays";
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
import { clearCurrentProject } from "@/redux/slices/projectSlice";
import { ProjectModel } from "@/models/projectModel/ProjectModel";
import { resetGenAiState } from "@/redux/slices/visualizerSlice/genAiSlice";
import GenAiImageGeneration from "@/components/workSpace/projectWorkSpace/genAiImageGeneration/GenAiImageGeneration";
import SegmentHome from "@/components/segments/SegmentHome";
import MarkingDimensionHome from "@/components/measurement/MarkingDimensionHome";
import GetAllJobComments from "@/components/comments/GetAllJobComments";
import { resetJobCommentsState } from "@/redux/slices/comments/JobComments";
import MaterialData from "@/components/swatchBookData/materialData/MaterialData";
import GetGenAiImageJobIdBased from "@/components/workSpace/compareGenAiImages/GetGenAiImageJobIdBased";

export function StudioPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const [selectedProject, setSelectedProject] = useState<ProjectModel | null>(
    null
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error: jobError, isCreating: isJobRunning } = useSelector(
    (state: RootState) => state.jobs
  );
  const { currentProject } = useSelector((state: RootState) => state.projects);
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

  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  // update message

  useEffect(() => {
    if (addSegMessage) {
      setLoadingMessage(addSegMessage);
    } else {
      setLoadingMessage(null);
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

  // update current SelectedProject
  useEffect(() => {
    if (currentProject === null) {
      setSelectedProject(null);
    } else if (currentProject && currentProject.id) {
      setSelectedProject(currentProject);
    }
  }, [currentProject]);

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
    dispatch(clearCurrentProject());
    dispatch(clearMasterArray());
    dispatch(resetCanvas());
    dispatch(resetWorkspace());
    dispatch(resetGenAiState());
    dispatch(resetJobCommentsState());

    dispatch(setCurrentTabContent("home"));

    navigate("/projects");
  };

  return (
    <>
      <RefreshHandler />
      {loadingMessage && loadingMessage != null && (
        <LoadingOverlay message={loadingMessage} />
      )}
      <div className="flex sm:flex-row flex-col md:h-screen bg-background relative">
        {/* <Breadcrumb /> */}
        <div className="w-full md:w-1/4 border-r overflow-hidden hidden md:block">
          <div className="py-3 pt-2 px-4 flex items-center justify-between align-center">
            <div className="text-start">
              <Link to="/">
                <img
                  className="w-44 text-center"
                  src={dzinlylogo}
                  alt="dzinly logo"
                ></img>
              </Link>
            </div>
            {/* <Link to="/"> */}
            <Button
              className="flex items-center space-x-2 h-8 mt-1 py-1 shadow-none rounded-2 text-sm border-gray-200 bg-white text-gray-800 hover:bg-gray-50 shadow-transparent "
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

        {/* {activeTabFromStore === "inspiration" ? (
          <WorkSpaceHome />
        ) : ( */}
        <>
          {/* other thaninspiration tab content */}
          <StudioMainCanvas
            // currentCanvasImage={currentCanvasImage}
            isUploading={true}
            canEdit={canEdit}
            isJobRunning={isJobRunning}
            onFileUpload={handleFileUpload}
            onClearImage={() => dispatch(clearCurrentImage())}
          />
        </>
        {/* )} */}

        <SwatchBookDataHome />

        {/* get all GenAi Image based on job ID */}
        <GetGenAiImageJobIdBased />

        {selectedProject && selectedProject.id && (
          <JobHome selectedProjectId={selectedProject?.id} />
        )}

        {isCanvasModalOpen && (
          <ModelCanvas
            isCanvasModalOpen={isCanvasModalOpen}
            onClose={handleCloseMask}
          />
        )}

        <CreateMaterArrays />
      </div>

      <CanvasAdddNewSegmentHome />
      {/* get all segments based on job Id */}
      <GetSegments />

      {/*  after send request for genAi image -get task id and update the state in GenAiImageGeneration DB and Redux */}
      <GenAiImageGeneration />

      <SegmentHome />

      <MarkingDimensionHome />

      {/* <CalculateArea/> */}

      <GetAllJobComments />

      <MaterialData />
    </>
  );
}
