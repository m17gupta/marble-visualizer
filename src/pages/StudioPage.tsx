import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  setCurrentProject,
  setSelectedSegmentType,
  setStyle,
  setLevel,
  togglePreserveObject,
  setTone,
  setIntensity,
  uploadImage,
  clearCurrentImage,
  clearError,
  updateCurentImage,

} from '@/redux/slices/studioSlice';
import { loadSegments } from '@/redux/slices/segmentsSlice';
import { createJob, fetchJobsByProject, clearError as clearJobError, clearCurrentJob } from '@/redux/slices/jobSlice';
import { fetchActivityLogs, logActivity } from '@/redux/slices/activityLogsSlice';
import { canEditProject, canAdminProject } from '@/middlewares/authMiddleware';
import { StudioSidebar, StudioMainCanvas } from '@/components/studio';
// import { ShareProjectDialog } from '@/components/ShareProjectDialog';
import { toast } from 'sonner';
import InspirationSidebar from "@/components/workSpace/projectWorkSpace/InspirationSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { updateActiveTab } from "@/redux/slices/visualizerSlice/workspaceSlice";
import ImagePreview from "@/components/workSpace/projectWorkSpace/ImagePreview";
import GuidancePanel from "@/components/workSpace/projectWorkSpace/GuidancePanel";
import CompareGenAiHome from "@/components/workSpace/compareGenAiImages/CompareGenAiHome";
import AllSegments from "@/components/studio/segment/AllSegments";
import SwatchBookDataHome from "@/components/swatchBookData/SwatchBookDataHome";

//type DrawingTool = "select" | "polygon";

export function StudioPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const {
    designSettings,
    selectedSegmentType,
    currentImageUrl,
    isUploading,
    error,
  } = useSelector((state: RootState) => state.studio);

  const { segments, activeSegmentId } = useSelector((state: RootState) => state.segments);
  const { currentJob, error: jobError, isCreating: isJobRunning } = useSelector((state: RootState) => state.jobs);
  const { currentUserRole } = useSelector((state: RootState) => state.projects);

  const [activeTab, setActiveTab] = useState("inspiration");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [currentCanvasImage, setCurrentCanvasImage] = useState<string>("");
  const [rightPanelContent, setRightPanelContent] = useState<string | null>(null);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  const { isGenerated } = useSelector((state: RootState) => state.workspace);

  const { activeTab: activeTabFromStore } = useSelector((state: RootState) => state.workspace);
  // Check permissions
  const canEdit = projectId ? canEditProject(projectId) : false;
  const canAdmin = projectId ? canAdminProject(projectId) : false;

  const getAllJob = useSelector((state: RootState) => state.jobs.list);


  // update active tab from store
  useEffect(() => {
    if (activeTabFromStore) {
      setActiveTab(activeTabFromStore);
    }
  }, [activeTabFromStore]);
  // update the current job
  useEffect(() => {
    console.log("getAllJob effect triggered", { getAllJob, length: getAllJob?.length });
    if (getAllJob &&
      getAllJob.length > 0
    ) {

      dispatch(updateCurentImage(getAllJob[0].full_image || ""));
    }
  }, [getAllJob, dispatch, currentImageUrl]);




  // Add debugging for currentImageUrl changes
  useEffect(() => {
    if (currentImageUrl && currentImageUrl !== "") {

      setCurrentCanvasImage(currentImageUrl)
    }
  }, [currentImageUrl]);

  // Update selected segment type when active segment changes
  useEffect(() => {
    if (activeSegmentId) {
      const activeSegment = segments.find((s) => s.id === activeSegmentId);
      if (activeSegment?.type) {
        dispatch(setSelectedSegmentType(activeSegment.type));
      }
    } else {
      dispatch(setSelectedSegmentType(null));
    }
  }, [activeSegmentId, segments, dispatch]);

  useEffect(() => {
    if (projectId) {
      dispatch(setCurrentProject(projectId));
      // dispatch(fetchProjectAccess(projectId));
      dispatch(loadSegments(projectId));
      dispatch(fetchActivityLogs(projectId));

      // Fetch jobs for this project
      dispatch(fetchJobsByProject(parseInt(projectId)));

      // Log project access
      dispatch(
        logActivity({
          projectId,
          type: "project_created",
          action: "Project Opened",
          detail: "Studio session started",
        })
      );
    }
  }, [projectId, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

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

    const result = await dispatch(uploadImage(file));
    if (uploadImage.fulfilled.match(result)) {
      toast.success("Image uploaded successfully!");

      // Log activity
      if (projectId) {
        dispatch(
          logActivity({
            projectId,
            type: "image_uploaded",
            action: "Image Uploaded",
            detail: `Background image "${file.name}" added to canvas`,
            metadata: { fileName: file.name, fileSize: file.size },
          })
        );
      }
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

    // Prepare job data for the new job slice
    const jobData = {
      title: `Design Generation - ${new Date().toLocaleString()}`,
      jobType: designSettings.style,
      full_image: currentImageUrl,
      thumbnail: currentImageUrl,
      project_id: parseInt(projectId),
      segements: JSON.stringify({
        style: designSettings.style,
        level: designSettings.level,
        preserve: designSettings.preserve,
        tone: designSettings.tone,
        intensity: designSettings.intensity,
        segments: segments.map(segment => ({
          id: segment.id,
          points: segment.points,
          materialId: segment.material?.materialId,
        })),
      }),
    };

    // Log activity
    dispatch(
      logActivity({
        projectId,
        type: "ai_job_started",
        action: "AI Job Started",
        detail: `Design generation started with ${designSettings.style} style`,
        metadata: {
          style: designSettings.style,
          level: designSettings.level,
          tone: designSettings.tone,
          intensity: designSettings.intensity,
          segmentCount: segments.length,
        },
      })
    );

    const result = await dispatch(createJob(jobData));
    if (createJob.fulfilled.match(result)) {
      toast.success('AI job started! Processing your design...');
      // Fetch updated jobs for the project
      dispatch(fetchJobsByProject(parseInt(projectId)));
    }
  };

  const handleCancelJob = () => {
    if (currentJob) {
      dispatch(clearCurrentJob());
    }
    toast.info('Job cancelled');

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

    const previousStyle = designSettings.style;
    dispatch(setStyle(value));

    if (projectId && previousStyle !== value) {
      dispatch(
        logActivity({
          projectId,
          type: "style_changed",
          action: "Style Changed",
          detail: `Design style updated to ${value}`,
          metadata: { previousStyle, newStyle: value },
        })
      );
    }
  };

  // Handle level change with activity logging
  const handleLevelChange = (checked: boolean) => {
    if (!canEdit) {
      toast.error("You do not have permission to change design settings");
      return;
    }

    const newLevel = checked ? 2 : 1;
    const previousLevel = designSettings.level;
    dispatch(setLevel(newLevel));

    if (projectId && previousLevel !== newLevel) {
      dispatch(
        logActivity({
          projectId,
          type: "style_changed",
          action: "Processing Level Changed",
          detail: `Processing level updated to Level ${newLevel}`,
          metadata: { previousLevel, newLevel },
        })
      );
    }
  };

  const handlePreserveToggle = (id: string) => {
    if (canEdit) {
      dispatch(togglePreserveObject(id));
    }
  };

  const handleToneChange = (value: string) => {
    if (canEdit) {
      dispatch(setTone(value));
    }
  };

  const handleIntensityChange = (value: number) => {
    if (canEdit) {
      dispatch(setIntensity(value));
    }
  };

  // Handle right panel actions
  const handleToolSelect = (tool: string) => {
    setRightPanelContent(tool);
    setIsRightPanelOpen(true);
  };

  const handleCloseRightPanel = () => {
    setIsRightPanelOpen(false);
    setRightPanelContent(null);
  };

  // Render right panel content based on selected tool
  const renderRightPanelContent = () => {
    switch (rightPanelContent) {
      case 'materials':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Material Library</h3>
            <div className="space-y-2">
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-full h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded mb-2"></div>
                <p className="text-sm font-medium">Blue Paint</p>
              </div>
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-full h-20 bg-gradient-to-r from-green-500 to-green-600 rounded mb-2"></div>
                <p className="text-sm font-medium">Green Paint</p>
              </div>
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-full h-20 bg-gradient-to-r from-red-500 to-red-600 rounded mb-2"></div>
                <p className="text-sm font-medium">Red Paint</p>
              </div>
            </div>
          </div>
        );
      case 'tools':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Drawing Tools</h3>
            <div className="space-y-2">
              <button className="w-full p-3 border rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                  </div>
                  <span>Polygon Tool</span>
                </div>
              </button>
              <button className="w-full p-3 border rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
                    </svg>
                  </div>
                  <span>Select Tool</span>
                </div>
              </button>
            </div>
          </div>
        );
      case 'layers':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Layers</h3>
            <div className="space-y-2">
              <div className="p-3 border rounded-lg bg-blue-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Background</span>
                  <div className="flex gap-2">
                    <button className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300"></button>
                    <button className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300"></button>
                  </div>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Segments</span>
                  <div className="flex gap-2">
                    <button className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300"></button>
                    <button className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300"></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Tool Panel</h3>
            <p className="text-gray-500">Select a tool to see options here.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex sm:flex-row flex-col md:h-screen bg-background">
      <div className="w-1/4 border-r overflow-hidden">
        <Tabs defaultValue="inspiration" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-1">
            <TabsTrigger value="design-hub"
              onClick={() => updateActiveTab("design-hub")}
            >Design Hub</TabsTrigger>
            <TabsTrigger value="inspiration"
              onClick={() => updateActiveTab("inspiration")}
            >Inspiration</TabsTrigger>
          </TabsList>

          <TabsContent value="design-hub" className="flex-grow overflow-auto flex">
            {/* All Segments - Left Side */}
            <div className="flex-1 border-r">
              <AllSegments/>
            </div>

            {/* Studio Sidebar - Right Side */}
            <div className="flex-1">
              <StudioSidebar
                currentUserRole={currentUserRole}
                canEdit={canEdit}
                canAdmin={canAdmin}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onShareClick={() => setShareDialogOpen(true)}
                projectId={projectId}
                selectedSegmentType={selectedSegmentType}
                designSettings={designSettings}
                isJobRunning={isJobRunning}
                jobError={jobError}
                currentJob={currentJob}
                currentImageUrl={currentImageUrl}
                isUploading={isUploading}
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

          <TabsContent value="inspiration" className="flex-grow overflow-auto">
            <InspirationSidebar />
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Canvas */}
   
     <StudioMainCanvas
        currentCanvasImage={currentCanvasImage}
        isUploading={isUploading}
        canEdit={canEdit}
        isJobRunning={isJobRunning}
        onFileUpload={handleFileUpload}
        onClearImage={() => dispatch(clearCurrentImage())}
      />
{/* 
      {activeTab === "inspiration" &&
        !isGenerated ? (<div className="w-3/4 p-4 flex flex-col bg-gray-50 h-[calc(100vh-3px)] overflow-auto">

          <ImagePreview />



          <div className="mt-4 ">
            <GuidancePanel />
          </div>
        </div>) : (
        <CompareGenAiHome />
      )} */}


      {/* Share Project Dialog */}
      {/* {shareDialogOpen && currentProject && (
        <ShareProjectDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          projectId={currentProject.id?.toString() || ''}
          projectName={currentProject.name || ''}
        />
      )} */}
      <SwatchBookDataHome/>
    </div>
  );
}
