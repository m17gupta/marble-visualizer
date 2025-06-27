import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
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
import { fetchProjectAccess } from '@/redux/slices/projectSlice';
import { canEditProject, canAdminProject } from '@/middlewares/authMiddleware';
import { CanvasEditor } from '@/components/CanvasEditor';
// import { ResultPreview } from '@/components/ResultPreview';
import { ActivityTimeline } from '@/components/ActivityTimeline';
// import { VersionHistory } from '@/components/VersionHistory';
import { SegmentsList } from '@/components/SegmentsList';
import { ShareProjectDialog } from '@/components/ShareProjectDialog';
import { SwatchRecommendations } from '@/components/swatch/SwatchRecommendations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  Zap,
  Settings,
  Palette,
  Layers,
  Eye,
  X,
  Square,
  Shapes,
  Sparkles,
  AlertCircle,
  History,
  Clock,
  Share2,
  Shield,
  Crown,
  Edit3,
  Lock,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DrawingTool = "select" | "polygon";

const styleOptions = [
  { value: "modern", label: "Modern", description: "Clean, minimalist design" },
  {
    value: "classic",
    label: "Classic",
    description: "Traditional, timeless style",
  },
  {
    value: "industrial",
    label: "Industrial",
    description: "Raw, urban aesthetic",
  },
  {
    value: "scandinavian",
    label: "Scandinavian",
    description: "Light, natural, cozy",
  },
  {
    value: "mediterranean",
    label: "Mediterranean",
    description: "Warm, coastal vibes",
  },
  {
    value: "contemporary",
    label: "Contemporary",
    description: "Current, trendy design",
  },
];

const preserveOptions = [
  { id: "roof", label: "Roof", description: "Keep original roof structure" },
  { id: "windows", label: "Windows", description: "Preserve window placement" },
  { id: "doors", label: "Doors", description: "Maintain door positions" },
  {
    id: "landscaping",
    label: "Landscaping",
    description: "Keep garden elements",
  },
  {
    id: "driveway",
    label: "Driveway",
    description: "Preserve driveway layout",
  },
  { id: "fence", label: "Fence", description: "Keep existing fencing" },
];

const toneOptions = [
  { value: "warm", label: "Warm", color: "bg-orange-500" },
  { value: "cool", label: "Cool", color: "bg-blue-500" },
  { value: "neutral", label: "Neutral", color: "bg-gray-500" },
  { value: "vibrant", label: "Vibrant", color: "bg-purple-500" },
  { value: "earthy", label: "Earthy", color: "bg-green-600" },
];

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
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState("design");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // Check permissions
  const canEdit = projectId ? canEditProject(projectId) : false;
  const canAdmin = projectId ? canAdminProject(projectId) : false;

  const getAllJob = useSelector((state: RootState) => state.jobs.list);

  // update the current job
  useEffect(() => {
    if (getAllJob &&
      getAllJob.length > 0 
    ) {
      dispatch(updateCurentImage(getAllJob[0].full_image || ""));
    }
  }, [getAllJob]);

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
  const hasResult = currentJob?.id ? true : false; // Simple check if there's a current job

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
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

  // Role badge component
  const RoleBadge = () => {
    if (!currentUserRole) return null;

    const roleConfig = {
      admin: {
        icon: Crown,
        color:
          "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950 dark:border-yellow-800",
        label: "Admin",
      },
      editor: {
        icon: Edit3,
        color:
          "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800",
        label: "Editor",
      },
      viewer: {
        icon: Eye,
        color: "text-muted-foreground bg-muted border-border",
        label: "Viewer",
      },
    };

    const config = roleConfig[currentUserRole];
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={cn("text-xs", config.color)}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="flex sm:flex-row flex-col md:h-screen bg-background">
      {/* Fixed Width Sidebar */}
      <motion.aside
        initial={{ x: -288, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sm:w-72 w-full bg-card border-r border-border flex flex-col h-[calc(100vh-150px)] overflow-y-scroll"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Design Studio
                </h2>
                <p className="text-sm text-muted-foreground">
                  Configure your design
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <RoleBadge />
              {canAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShareDialogOpen(true)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Permission Alert */}
          {!canEdit && (
            <Alert className="mb-4">
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-xs">
                You have view-only access to this project. Contact an admin to
                request edit permissions.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Tabs Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <div className="px-4 pt-2 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-5 h-9">
              <TabsTrigger value="design" className="text-xs p-1">
                <Palette className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="segments" className="text-xs p-1">
                <Shapes className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="swatches" className="text-xs p-1">
                <Target className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs p-1">
                <History className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="activity" className="text-xs p-1">
                <Clock className="h-3 w-3" />
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Scrollable Tab Content */}
          <ScrollArea className="flex-1 px-4">
            <div className="py-4 space-y-6">
              <TabsContent value="design" className="space-y-6 mt-0">
                {/* Job Status Alert */}
                {isJobRunning && (
                  <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200">
                      AI is processing your design... This may take a few
                      minutes.
                    </AlertDescription>
                  </Alert>
                )}

                {currentJob && jobError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {jobError || 'AI processing failed. Please try again.'}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Style Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <Palette className="h-4 w-4 text-primary" />
                    <Label className="text-sm font-medium">Style</Label>
                  </div>
                  <Select
                    value={designSettings.style}
                    onValueChange={handleStyleChange}
                    disabled={isJobRunning || !canEdit}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    <SelectContent>
                      {styleOptions.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          <div>
                            <div className="font-medium">{style.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {style.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                <Separator />

                {/* Level Toggle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <Label className="text-sm font-medium">
                      Processing Level
                    </Label>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        Level {designSettings.level}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {designSettings.level === 1
                          ? "Basic processing"
                          : "Advanced processing"}
                      </div>
                    </div>
                    <Switch
                      checked={designSettings.level === 2}
                      onCheckedChange={handleLevelChange}
                      disabled={isJobRunning || !canEdit}
                    />
                  </div>
                </motion.div>

                <Separator />

                {/* Preserve Objects */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-primary" />
                    <Label className="text-sm font-medium">
                      Preserve Objects
                    </Label>
                  </div>
                  <div className="space-y-3">
                    {preserveOptions.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-3"
                      >
                        <Checkbox
                          id={option.id}
                          checked={designSettings.preserve.includes(option.id)}
                          onCheckedChange={() =>
                            canEdit && dispatch(togglePreserveObject(option.id))
                          }
                          disabled={isJobRunning || !canEdit}
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={option.id}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {option.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <Separator />

                {/* Color Tone */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <Palette className="h-4 w-4 text-primary" />
                    <Label className="text-sm font-medium">Color Tone</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {toneOptions.map((tone) => (
                      <button
                        key={tone.value}
                        onClick={() => canEdit && dispatch(setTone(tone.value))}
                        disabled={isJobRunning || !canEdit}
                        className={cn(
                          "p-3 rounded-lg border text-left transition-all",
                          designSettings.tone === tone.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 bg-muted/30",
                          (isJobRunning || !canEdit) &&
                            "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={cn("w-3 h-3 rounded-full", tone.color)}
                          />
                          <span className="text-sm font-medium">
                            {tone.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>

                <Separator />

                {/* Intensity Slider */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <Label className="text-sm font-medium">Intensity</Label>
                    </div>
                    <Badge variant="secondary">
                      {designSettings.intensity}%
                    </Badge>
                  </div>
                  <Slider
                    value={[designSettings.intensity]}
                    onValueChange={(value) =>
                      canEdit && dispatch(setIntensity(value[0]))
                    }
                    max={100}
                    step={5}
                    className="w-full"
                    disabled={isJobRunning || !canEdit}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Subtle</span>
                    <span>Dramatic</span>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="segments" className="space-y-4 mt-0">
                {projectId && <SegmentsList projectId={projectId} />}
              </TabsContent>

              <TabsContent value="swatches" className="mt-0">
                <SwatchRecommendations
                  selectedSegmentType={selectedSegmentType}
                />
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                {/* {projectId && <VersionHistory projectId={projectId} />} */}
              </TabsContent>

              <TabsContent value="activity" className="mt-0">
                {projectId && <ActivityTimeline projectId={projectId} />}
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>

        {/* Generate Button - Fixed at bottom */}
        <div className="p-4 border-t border-border flex-shrink-0">
          <AnimatePresence mode="wait">
            {isJobRunning ? (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-sm">
                  <span>Generating design...</span>
                  <span>{jobProgress}%</span>
                </div>
                <Progress value={jobProgress} className="h-2" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelJob}
                  className="w-full"
                  disabled={!canEdit}
                >
                  <Square className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="generate"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Button
                  onClick={handleGenerate}
                  disabled={!currentImageUrl || isUploading || !canEdit}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  {!canEdit ? (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      View Only
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Design
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Main Canvas Area - Takes remaining width */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 space-y-6"
          >
            {/* Canvas Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Design Canvas
                </h1>
                <p className="text-muted-foreground">
                  {canEdit
                    ? "Upload an image and use drawing tools to create segments"
                    : "View-only access to this project"}
                </p>
              </div>
              {currentImageUrl && canEdit && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => dispatch(clearCurrentImage())}
                    disabled={isJobRunning}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>
              )}
            </div>

            {/* Canvas Content */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {currentImageUrl ? (
                  <motion.div
                    key="canvas"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <CanvasEditor
                      imageUrl={currentImageUrl}
                      width={800}
                      height={600}
                      className="mb-6"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card
                      className={cn(
                        "h-96 border-2 border-dashed transition-colors",
                        canEdit ? "cursor-pointer" : "cursor-not-allowed",
                        dragActive && canEdit
                          ? "border-primary bg-primary/5"
                          : "border-muted-foreground/25 hover:border-primary/50 bg-muted/10"
                      )}
                      onDrop={canEdit ? handleDrop : undefined}
                      onDragOver={canEdit ? handleDragOver : undefined}
                      onDragLeave={canEdit ? handleDragLeave : undefined}
                      onClick={
                        canEdit
                          ? () => fileInputRef.current?.click()
                          : undefined
                      }
                    >
                      <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
                        <motion.div
                          animate={{ scale: dragActive && canEdit ? 1.1 : 1 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-4"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                              <div>
                                <h3 className="text-lg font-semibold text-foreground">
                                  Uploading...
                                </h3>
                                <p className="text-muted-foreground">
                                  Please wait while we process your image
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="p-4 rounded-full bg-primary/10 mx-auto w-fit">
                                {canEdit ? (
                                  <Upload className="h-8 w-8 text-primary" />
                                ) : (
                                  <Lock className="h-8 w-8 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <h3 className="text-xl font-semibold mb-2 text-foreground">
                                  {canEdit
                                    ? "Upload Your Image"
                                    : "No Image Uploaded"}
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                  {canEdit
                                    ? "Drag and drop an image here, or click to browse"
                                    : "Contact an admin to upload images to this project"}
                                </p>
                                {canEdit && (
                                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                                    <span>PNG, JPEG up to 10MB</span>
                                  </div>
                                )}
                              </div>
                              {canEdit && (
                                <Button variant="outline" className="mt-4">
                                  <ImageIcon className="mr-2 h-4 w-4" />
                                  Choose File
                                </Button>
                              )}
                            </>
                          )}
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hidden file input */}
              {canEdit && (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="hidden"
                />
              )}
            </div>

            {/* Result Preview */}
            {/* {currentImageUrl && hasResult && projectId && (
              <ResultPreview
                originalImageUrl={currentImageUrl}
                projectId={projectId}
              />
            )} */}
          </motion.div>
        </ScrollArea>
      </main>

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
