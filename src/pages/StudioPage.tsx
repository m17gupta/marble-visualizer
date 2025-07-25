import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import {
  // fetchJobsByProject,
  clearError as clearJobError,
  clearCurrentJob,
} from "@/redux/slices/jobSlice";
import {
  // fetchActivityLogs,
  logActivity,
} from "@/redux/slices/activityLogsSlice";
import { canEditProject, canAdminProject } from "@/middlewares/authMiddleware";
import { StudioSidebar, StudioMainCanvas } from "@/components/studio";
// import { ShareProjectDialog } from '@/components/ShareProjectDialog';
import { toast } from "sonner";
import InspirationSidebar from "@/components/workSpace/projectWorkSpace/InspirationSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateActiveTab } from "@/redux/slices/visualizerSlice/workspaceSlice";

import AllSegments from "@/components/studio/segment/AllSegments";
import SwatchBookDataHome from "@/components/swatchBookData/SwatchBookDataHome";

import GetGenAiImageJobIdBased from "@/components/workSpace/compareGenAiImages/GetGenAiImageJobIdBased";

import WorkSpaceHome from "@/components/workSpace/WorkSpaceHome";
import { clearCurrentImage } from "@/redux/slices/studioSlice";
import JobHome from "@/components/job/JobHome";
import {
  setCanvasType,
  setIsCanvasModalOpen,
  updateIsGenerateMask,
} from "@/redux/slices/canvasSlice";
import ModelCanvas from "@/components/workSpace/projectWorkSpace/modelCanvas/ModelCanvas";
import Breadcrumb from "@/components/breadcrumbs/Breadcrumb";
import {
  renderPolygonMaskOnlyToCanvas,
  renderPolygonMaskToBlob,
  renderPolygonMaskToFile,
} from "@/components/canvasUtil/GenerateMask";
import CreateMaterArray from "@/components/studio/segment/CreateMaterArray";
import dzinlylogo from "../../public/assets/image/dzinly-logo.svg";
import { Button } from "@/components/ui/button";
import CanvasAdddNewSegmentHome from "@/components/canvas/canvasAddNewSegment/CanvasAdddNewSegmentHome";

//type DrawingTool = "select" | "polygon";
import { IoMdArrowRoundBack } from "react-icons/io";

export function StudioPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const {
    currentJob,
    error: jobError,
    isCreating: isJobRunning,
  } = useSelector((state: RootState) => state.jobs);
  const { currentUserRole, currentProject } = useSelector(
    (state: RootState) => state.projects
  );
  const { activeTab: activeTabFromStore } = useSelector(
    (state: RootState) => state.workspace
  );

  // const activeTab = useRef<string>("inspiration");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [currentCanvasImage, setCurrentCanvasImage] = useState<string>("");

  const { isCanvasModalOpen } = useSelector((state: RootState) => state.canvas);
  const { isGenerated } = useSelector((state: RootState) => state.workspace);

  // Check permissions
  const canEdit = projectId ? canEditProject(projectId) : false;
  const canAdmin = projectId ? canAdminProject(projectId) : false;

  const getAllJob = useSelector((state: RootState) => state.jobs.list);
  const { currentImageUrl } = useSelector((state: RootState) => state.studio);

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

  // Job status variables
  const jobProgress = 0; // The new job slice doesn't have progress tracking like the old one
  //const hasResult = currentJob?.id ? true : false; // Simple check if there's a current job

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

  const handleGenerate = async () => {
    if (!canEdit) {
      toast.error("You do not have permission to generate designs");
      return;
    }

    if (!currentImageUrl) {
      toast.error("Please upload an image first");
      return;
    }

    if (!projectId) {
      toast.error("No project selected");
      return;
    }
  };

  const handleCancelJob = () => {
    if (currentJob) {
      dispatch(clearCurrentJob());
    }
    toast.info("Job cancelled");

    if (projectId) {
      dispatch(
        logActivity({
          projectId,
          type: "ai_job_failed",
          action: "AI Job Cancelled",
          detail: "Design generation cancelled by user",
        })
      );
    }
  };

  // Handle style change with activity logging
  const handleStyleChange = (value: string) => {
    if (!canEdit) {
      toast.error("You do not have permission to change design settings");
      return;
    }
  };

  // Handle level change with activity logging
  const handleLevelChange = (checked: boolean) => {
    if (!canEdit) {
      toast.error("You do not have permission to change design settings");
      return;
    }
  };

  const handlePreserveToggle = (id: string) => {
    if (canEdit) {
      // dispatch(togglePreserveObject(id));
    }
  };

  const handleToneChange = (value: string) => {
    if (canEdit) {
      // dispatch(setTone(value));
    }
  };

  const handleIntensityChange = (value: number) => {
    if (canEdit) {
      // dispatch(setIntensity(value));
    }
  };

  const handleDesignHubClick = () => {
    // setActiveTab("design-hub");
    // console.log("Design Hub tab clicked");
    dispatch(updateActiveTab("design-hub"));
    dispatch(setCanvasType("draw"));
  };

  const handleInspirationClick = () => {
    // setActiveTab("inspiration");
    dispatch(updateActiveTab("inspiration"));
  };

  const handleChangeTab = (value: string) => {
    dispatch(updateActiveTab(value));
    console.log("Tab changed to:", value);
  };

  useEffect(() => {
    if (!activeTabFromStore) {
      dispatch(updateActiveTab("inspiration"));
    }
  }, [dispatch, activeTabFromStore]);

  const handleCloseMask = () => {
    dispatch(setIsCanvasModalOpen(false));
  };

  return (
    <>
      <div className="py-3 pt-2 px-4 flex items-center justify-between align-center md:hidden">
        <div className="text-start">
          <Link to="/">
            {" "}
            <img
              className="w-44 text-center"
              src={dzinlylogo}
              alt="dzinly logo"
            ></img>
          </Link>
        </div>
        <Link to="/">
          <Button className="flex items-center space-x-2 h-8 mt-1 py-1 rounded-2 text-sm border-gray-200 bg-white text-gray-800 hover:bg-gray-50 shadow-transparent ">
            <IoMdArrowRoundBack className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </Link>
      </div>

      <div className="flex sm:flex-row flex-col md:h-screen bg-background relative">
        {/* <Breadcrumb /> */}
        <div className="w-full md:w-1/4 border-r overflow-hidden hidden md:block">
          <div className="py-3 pt-2 px-4 flex items-center justify-between align-center">
            <div className="text-start">
              <Link to="/">
                {" "}
                <img
                  className="w-44 text-center"
                  src={dzinlylogo}
                  alt="dzinly logo"
                ></img>
              </Link>
            </div>
            <Link to="/">
              <Button className="flex items-center space-x-2 h-8 mt-1 py-1 rounded-2 text-sm border-gray-200 bg-white text-gray-800 hover:bg-gray-50 shadow-transparent ">
                <IoMdArrowRoundBack className="w-4 h-4" />
                <span>Back</span>
              </Button>
            </Link>
          </div>

          <Tabs
            value={activeTabFromStore ?? "inspiration"}
            onValueChange={handleChangeTab}
            className="w-full h-full flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="inspiration" onClick={handleInspirationClick}>
                Inspiration
              </TabsTrigger>
              <TabsTrigger value="design-hub" onClick={handleDesignHubClick}>
                Design Hub
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="design-hub"
              className="flex-grow overflow-auto flex"
            >
              {/* All Segments - Left Side */}
              <div className="flex border-r">
                <AllSegments />
              </div>

              {/* Studio Sidebar - Right Side */}
              <div className="flex-1">
                <StudioSidebar
                  currentUserRole={currentUserRole}
                  canEdit={canEdit}
                  canAdmin={canAdmin}
                  activeTab={activeTabFromStore ?? "design-hub"}
                  onTabChange={handleChangeTab}
                  onShareClick={() => setShareDialogOpen(true)}
                  projectId={projectId}
                  // selectedSegmentType={selectedSegmentType}
                  // designSettings={designSettings}
                  isJobRunning={isJobRunning}
                  jobError={jobError}
                  // currentJob={currentJob}
                  // currentImageUrl={currentImageUrl}
                  // isUploading={isUploading}
                  jobProgress={jobProgress}
                  onStyleChange={handleStyleChange}
                  onLevelChange={handleLevelChange}
                  onPreserveToggle={handlePreserveToggle}
                  onToneChange={handleToneChange}
                  onIntensityChange={handleIntensityChange}
                  onGenerate={handleGenerate}
                  onCancelJob={handleCancelJob}
                />
              </div>
            </TabsContent>

            <TabsContent
              value="inspiration"
              className="flex-grow overflow-auto"
            >
              <InspirationSidebar />
            </TabsContent>
          </Tabs>
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
    </>
  );
}
