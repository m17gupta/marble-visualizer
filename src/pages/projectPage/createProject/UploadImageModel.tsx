import UploadingProgress from "@/components/workSpace/visualTool/UploadingProgress";
import React, { useRef } from "react";
import { Clock, Home, ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import ViewUploader, { convertToWebP } from "./ViewUploader";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { createProject, updateIsCreateDialog } from "@/redux/slices/projectSlice";
import useViewFiles from "@/hooks/useViewFiles";
import { setIsContinue, setIsUploading, ViewType } from "@/redux/slices/visualizerSlice/workspaceSlice";
import { toast } from "sonner";
import { ProjectModel } from "@/models/projectModel/ProjectModel";
import {
  DirectS3UploadService,
  UploadProgress,
} from "@/services/uploadImageService/directS3UploadService";
import { addHouseImage } from "@/redux/slices/visualizerSlice/genAiSlice";
import { CreateJob, CreateJobParams } from "@/utils/CreateJob";
import { setIsAnalyseImage, setJobUrl, setProjectId } from "@/redux/slices/projectAnalyseSlice";

type props={
  resetProjectCreated: () => void;
}
const UploadImageModel = ({ resetProjectCreated }: props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [uploadWebp, setUploadWeb] = React.useState<File | null>(null);
  const [typeView, setTypeView] = React.useState<string>("");
  const [projectName, setProjectName] = React.useState<string>("New Project");
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const createdProjectId = useRef<number | null>(null);
    const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const [isCreatingProject, setIsCreatingProject] =
    React.useState<boolean>(false);
      const [isCreatingJob, setIsCreatingJob] = React.useState<boolean>(false);
  const viewTypes: { key: ViewType; label: string }[] = [
    { key: "front", label: "" },
  ];

    const { profile } = useSelector((state: RootState) => state.userProfile);
    const { list: projectList } = useSelector(
      (state: RootState) => state.projects
    );
  const {
    viewFiles,
    setViewFile,
    removeViewFile,
    hasAnyFiles,
    isAllViewsUploaded,
  } = useViewFiles();

  const handleGoBack = () => {
    if (isAuthenticated) {
      dispatch(updateIsCreateDialog(false));
    } else {
      //dispatch(updateWorkspaceType("workspace"));
      navigate("/app/projects");
    }
  };

  // Upload a file for a given view
  const handleFileUpload = async (file: File, view: ViewType) => {
    const data: any = await convertToWebP(file);

    setViewFile(view, file);
    setUploadedFile(file);
    setUploadWeb(data);
    setTypeView(view);
  };

  const handleFileRemove = (view: ViewType) => {
    removeViewFile(view);
    setUploadWeb(null);
  };

  const handleContinue = () => {
    if (hasAnyFiles && projectName.trim()) {
      // create project firstly
      dispatch(setIsContinue(true));
      handleCreateProject();
    } else if (!projectName.trim()) {
      toast.error("Please enter a project name");
    }
  };

   const handleCreateProject = async () => {
      setIsCreatingProject(true);
      const projectData: ProjectModel = {
        name: projectName ?? `New Project-${projectList.length + 1}`,
        description: "This is a demo project",
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: profile?.user_id,
        thumbnail:
          "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2",
      };
  
      try {
        const result = await dispatch(createProject(projectData)).unwrap();
        console.log("Project creation result:", result);
        if (result.id) {
          createdProjectId.current = result.id;
          //toast.success("Project created successfully!");
          setIsCreatingProject(false);
          handleUpload();
        }
      } catch (error) {
        console.error("Project creation failed:", error);
        toast.error("Failed to create project");
        setIsCreatingProject(false);
      }
    }

      const handleUpload = async () => {
        if (!uploadedFile || !profile?.id) return;
    
        // Check if AWS credentials are configured
        if (!DirectS3UploadService.isConfigured()) {
          const configError =
            "AWS credentials not configured. Please set your environment variables.";
          toast.error(configError);
          return;
        }
        dispatch(setIsUploading(true));
    
        try {
          // Use direct S3 upload service
    
          const result = await DirectS3UploadService.uploadFile(
            uploadedFile,
            profile.id,
            (progress: UploadProgress) => {
              // Calculate percentage from the upload progress
              setUploadProgress(progress.percentage || 0);
            }
          );
    
          if (result.success && result.fileUrl && result.key) {
            const res = await DirectS3UploadService.uploadFile(
              uploadWebp!,
              profile.id
            
            );
            dispatch(addHouseImage(result.fileUrl));
            // create job with uploaded file
            const jobData: CreateJobParams = {
              jobUrl: result.fileUrl,
              projectId: createdProjectId.current,
              jobType: typeView,
              dispatch: dispatch,
            };
    
            dispatch(setJobUrl(result.fileUrl));
            dispatch(setProjectId(createdProjectId.current ?? 0));
         
            setIsCreatingJob(true);
            CreateJob(jobData, {
              resetForm: () => {
                setIsCreatingJob(false);
    
                 resetProjectCreated();
              },
              clearProjectId: () => {
                createdProjectId.current = null;
                setIsCreatingJob(false);
              },
              clearImages: () => {
                setUploadedFile(null);
                setUploadWeb(null);
                setIsCreatingJob(false);
              },
            });
            // Store URL for future use if needed
          } else {
            toast.error(result.error || "Upload failed");
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Upload failed";
          toast.error(errorMessage);
          setIsCreatingProject(false);
          setIsCreatingJob(false);
        } finally {
          dispatch(setIsUploading(false));
        }
      };
  return (
    <>
      {/* Upload Progress Overlay */}
      <UploadingProgress
        fileName={uploadedFile?.name || null}
        progress={uploadProgress}
        isCreatingProject={isCreatingProject}
        isCreatingJob={isCreatingJob}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className=" border-b border-gray-200 py-6 pt-6 bg-white shadow-sm">
          <div className="mx-auto px-3">
            <div className="text-center relative flex items-center justify-center ">
              {/* Back button positioned absolutely in header */}
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="text-md border-0 absolute left-0 top-0 md:top-1/2 transform -translate-y-1/2 flex items-center space-x-2 text-gray-700 hover:text-gray-900 bg-transparent  shadow-none "
              >
                <ArrowLeft className="h-6 w-6 md:w-4 " />
                <span>Back</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-10 bg-white border mt-3 rounded-md shadow">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <h2 className="text-xl font-medium text-gray-900">
                  Upload Image
                </h2>
              </div>

              <div className="bg-white rounded-xl shadow-sm border-none">
                {viewTypes.map((viewType) => (
                  <ViewUploader
                    key={viewType.key}
                    viewType={viewType.label}
                    uploadedFile={viewFiles[viewType.key]}
                    onFileUpload={(file) =>
                      handleFileUpload(file, viewType.key)
                    }
                    onFileRemove={() => handleFileRemove(viewType.key)}
                    disabled={hasAnyFiles && !viewFiles[viewType.key]}
                  />
                ))}

               
              </div>
            </div>

            {/* Photo Upload Grid */}
            <div>
              <div className="flex items-center mb-6 border-b pb-3">
                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <h2 className="text-xl font-medium text-gray-900 ">
                  Previous Uploads
                </h2>
              </div>

              <div>
                <div className="grid grid-cols-4 gap-3 ">
                  <div className="relative cursor-pointer overflow-hidden rounded-md border-2 transition-all border-transparent hover:border-gray-300 ">
                    <img
                      src="https://images.renovateai.app/ren/resize:fit:1366:768:0/watermark:0:re/plain/s3://renovate-ai/1966ab9b-93ad-4e06-a379-f63b38ba6f00"
                      alt="uploaded_image"
                      className="aspect-square w-full object-cover"
                    />
                  </div>

                  <div className="relative cursor-pointer overflow-hidden rounded-md border-2 transition-all border-transparent hover:border-gray-300 ">
                    <img
                      src="https://images.renovateai.app/ren/resize:fit:1366:768:0/watermark:0:re/plain/s3://renovate-ai/1966ab9b-93ad-4e06-a379-f63b38ba6f00"
                      alt="uploaded_image"
                      className="aspect-square w-full object-cover"
                    />
                  </div>

                  <div className="relative cursor-pointer overflow-hidden rounded-md border-2 transition-all border-transparent hover:border-gray-300 ">
                    <img
                      src="https://images.renovateai.app/ren/resize:fit:1366:768:0/watermark:0:re/plain/s3://renovate-ai/1966ab9b-93ad-4e06-a379-f63b38ba6f00"
                      alt="uploaded_image"
                      className="aspect-square w-full object-cover"
                    />
                  </div>

                  <div className="relative cursor-pointer overflow-hidden rounded-md border-2 transition-all border-transparent hover:border-gray-300 ">
                    <img
                      src="https://images.renovateai.app/ren/resize:fit:1366:768:0/watermark:0:re/plain/s3://renovate-ai/1966ab9b-93ad-4e06-a379-f63b38ba6f00"
                      alt="uploaded_image"
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                  <div className="relative cursor-pointer overflow-hidden rounded-md border-2 transition-all border-transparent hover:border-gray-300 ">
                    <img
                      src="https://images.renovateai.app/ren/resize:fit:1366:768:0/watermark:0:re/plain/s3://renovate-ai/1966ab9b-93ad-4e06-a379-f63b38ba6f00"
                      alt="uploaded_image"
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={!hasAnyFiles || !projectName.trim()}
              className={` text-sm font-semibold rounded-lg transition-all ${
                hasAnyFiles && projectName.trim()
                  ? "mx-auto flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm font-medium"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {!projectName.trim()
                ? "Please enter a project name"
                : hasAnyFiles
                ? `Continue`
                : "Upload at least one view to continue"}
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Supported formats: JPG, PNG • Maximum file size: 10MB per image
            </p>
            <p className="mt-1">
              You can upload additional views after the initial project delivery
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadImageModel;
