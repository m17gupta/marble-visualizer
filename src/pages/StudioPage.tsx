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
import { ShareProjectDialog } from '@/components/ShareProjectDialog';
import { toast } from 'sonner';

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
  const { currentProject, currentUserRole } = useSelector((state: RootState) => state.projects);
  
  const [activeTab, setActiveTab] = useState("design");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [currentCanvasImage, setCurrentCanvasImage] = useState<string>("");

  // Check permissions
  const canEdit = projectId ? canEditProject(projectId) : false;
  const canAdmin = projectId ? canAdminProject(projectId) : false;

  const getAllJob = useSelector((state: RootState) => state.jobs.list);

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
     if(currentImageUrl && currentImageUrl !== "") {
   
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

  return (
    <div className="flex sm:flex-row flex-col md:h-screen bg-background">
      {/* Studio Sidebar */}
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

      {/* Main Canvas */}
      <StudioMainCanvas
        currentCanvasImage={currentCanvasImage}
        isUploading={isUploading}
        canEdit={canEdit}
        isJobRunning={isJobRunning}
        onFileUpload={handleFileUpload}
        onClearImage={() => dispatch(clearCurrentImage())}
      />

      {/* Share Project Dialog */}
      {shareDialogOpen && currentProject && (
        <ShareProjectDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          projectId={currentProject.id?.toString() || ''}
          projectName={currentProject.name || ''}
        />
      )}
    </div>
  );
}
