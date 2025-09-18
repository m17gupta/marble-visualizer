import { StudioMainCanvas } from "@/components/studio/StudioMainCanvas";
import StudioMainTabs from "@/components/studio/studioMainTabs/StudioMainTabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ImagePreview from "@/components/workSpace/projectWorkSpace/ImagePreview";
import { canEditProject } from "@/middlewares/authMiddleware";
import { clearCurrentImage } from "@/redux/slices/studioSlice";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const StudioMobilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [canvasWidth, setCanvasWidth] = useState(420);
  const [canvasHeight, setCanvasHeight] = useState(250);
  const { id: projectId } = useParams<{ id: string }>();
  const canEdit = projectId ? canEditProject(projectId) : false;

  const { error: jobError, isCreating: isJobRunning } = useSelector(
    (state: RootState) => state.jobs
  );

  const { activeTab: activeTabFromStore } = useSelector(
    (state: RootState) => state.workspace
  );

  
  const handleBackToProject = () => {
    navigate("/projects");
  };

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
  return (
    <div>
      <div className="flex items-center justify-between gap-3 p-3 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <IoArrowBack onClick={handleBackToProject} />
          <h6 className="font-semibold">Project One</h6>
        </div>
      </div>
      {activeTabFromStore != "inspiration" && (
        <StudioMainCanvas
          // currentCanvasImage={currentCanvasImage}
          isUploading={true}
          canEdit={canEdit}
          isJobRunning={isJobRunning}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          onFileUpload={handleFileUpload}
          onClearImage={() => dispatch(clearCurrentImage())}
        />
      )}

      <StudioMainTabs />
    </div>
  );
};

export default StudioMobilePage;
