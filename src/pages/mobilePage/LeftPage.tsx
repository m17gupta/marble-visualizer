import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StudioPage } from "../StudioPage";
import AllSegments from "@/components/studio/segment/AllSegments";
import { useDispatch } from "react-redux";
import { StudioSidebar } from "@/components/studio/StudioSidebar";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { canEditProject, canAdminProject } from "@/middlewares/authMiddleware";
import { useParams } from "react-router-dom";
import { updateActiveTab } from "@/redux/slices/visualizerSlice/workspaceSlice";
import { clearCurrentJob } from "@/redux/slices/jobSlice";
import { toast } from "sonner";
import { logActivity } from "@/redux/slices/activityLogsSlice";
import InspirationSidebar from "@/components/workSpace/projectWorkSpace/InspirationSidebar";
// Dummy components and handlers for demonstration

const LeftPage = () => {
  const { currentImageUrl } = useSelector((state: RootState) => state.studio);
  const { id: projectId } = useParams<{ id: string }>();
  const { currentUserRole, currentProject } = useSelector(
    (state: RootState) => state.projects
  );
  const canEdit = projectId ? canEditProject(projectId) : false;
  const canAdmin = projectId ? canAdminProject(projectId) : false;
  const [activeTabFromStore, setActiveTabFromStore] =
    React.useState<string>("inspiration");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  // Dummy handlers
  const handleInspirationClick = () => setActiveTabFromStore("inspiration");
  const handleDesignHubClick = () => setActiveTabFromStore("design-hub");
  const jobProgress = 0;
  const handleChangeTab = (value: string) => {
    dispatch(updateActiveTab(value));
    console.log("Tab changed to:", value);
  };

  const dispatch = useDispatch<AppDispatch>();

  const handleStyleChange = (value: string) => {
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

  const {
    currentJob,
    error: jobError,
    isCreating: isJobRunning,
  } = useSelector((state: RootState) => state.jobs);
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

  const handleLevelChange = (checked: boolean) => {
    if (!canEdit) {
      toast.error("You do not have permission to change design settings");
      return;
    }
  };

  return (
    <div>
      {/* <StudioPage /> */}
      <Tabs
        value={activeTabFromStore}
        onValueChange={setActiveTabFromStore}
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

        <TabsContent value="design-hub" className=" overflow-auto flex">
          <div className="flex border-r">
            <AllSegments />
          </div>
          <div className="">
            <StudioSidebar
              // currentUserRole={currentUserRole}
              // canEdit={canEdit}
              // canAdmin={canAdmin}
              activeTab={activeTabFromStore ?? "design-hub"}
              onTabChange={handleChangeTab}
              // onShareClick={() => setShareDialogOpen(true)}
              projectId={projectId}
              // isJobRunning={isJobRunning}
              // jobError={jobError}

              // jobProgress={jobProgress}
              // onStyleChange={handleStyleChange}
              // onLevelChange={handleLevelChange}
              // onPreserveToggle={handlePreserveToggle}
              // onToneChange={handleToneChange}
              // onIntensityChange={handleIntensityChange}
              // onGenerate={handleGenerate}
              // onCancelJob={handleCancelJob}
            />
          </div>
        </TabsContent>

        <TabsContent value="inspiration" className="flex-grow overflow-auto">
          <InspirationSidebar />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeftPage;
