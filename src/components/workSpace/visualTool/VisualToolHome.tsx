import React, { useState } from 'react';
import { Clock, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../../ui/button';

import ViewUploader from './ViewUploader';
import { setIsContinue, setIsUploading, ViewType } from '@/redux/slices/visualizerSlice/workspaceSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';

import useViewFiles from '@/hooks/useViewFiles';

import GestUserHome from '../gestUser/GestUserHome';
import { RootState } from '@/redux/store';
import { createProject } from '@/redux/slices/projectSlice';
import { ProjectModel } from '@/models/projectModel/ProjectModel';
import { toast } from 'sonner';

import { DirectS3UploadService } from '@/services/uploadImageService/directS3UploadService';
import { CreateJob, CreateJobParams } from '@/utils/CreateJob';


const VisualToolHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [typeView, setTypeView] = React.useState<string>("");
  const { viewFiles, setViewFile, removeViewFile, hasAnyFiles, isAllViewsUploaded } = useViewFiles();

  const { profile } = useSelector((state: RootState) => state.userProfile);
  const [createdProjectId, setCreatedProjectId] = useState<number | null>(null);

  // Upload a file for a given view
  const handleFileUpload = (file: File, view: ViewType) => {
    setViewFile(view, file);
    setUploadedFile(file);
    setTypeView(view);
  };

  const handleFileRemove = (view: ViewType) => {
    removeViewFile(view);
  };

  const handleContinue = () => {
    if (hasAnyFiles) {
      // create project firstly
      dispatch(setIsContinue(true));
      handleCreateProject();
      console.log('Creating project with ID:', createdProjectId);
    }
  };

  // create project firstly
  const handleCreateProject = async () => {
    const projectData: ProjectModel = {
      name: "New Project",
      description: "This is a demo project",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: profile?.user_id,
      thumbnail: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2",
    };

    try {
      const result = await dispatch(createProject(projectData)).unwrap();
      setCreatedProjectId(result.id || null);
      toast.success('Project created successfully!');
      handleUpload();
    } catch (error) {
      console.error('Project creation failed:', error);
      toast.error('Failed to create project');
    }
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  // Define view types and their display names
  const viewTypes: { key: ViewType; label: string }[] = [
    { key: 'front', label: 'Front View' },
    { key: 'rear', label: 'Rear View' },
    { key: 'left', label: 'Left View' },
    { key: 'right', label: 'Right View' },
  ];
  const handleUpload = async () => {
    if (!uploadedFile || !profile?.id) return;

    // Check if AWS credentials are configured
    if (!DirectS3UploadService.isConfigured()) {
      const configError = 'AWS credentials not configured. Please set your environment variables.';
      toast.error(configError);
      return;
    }
    dispatch(setIsUploading(true));

    try {
      // Use direct S3 upload service
      const result = await DirectS3UploadService.uploadFile(
        uploadedFile,
        profile.id,
        (progress) => {
          console.log('Upload progress:', progress);
          // Progress tracking if needed in the future
        }
      );

      console.log('Upload result:', result.fileUrl);

      if (result.success && result.fileUrl && result.key) {
        console.log('File uploaded successfully:', result.fileUrl);

        // create job with uploaded file
        const jobData: CreateJobParams = {
              jobUrl: result.fileUrl,
              projectId: createdProjectId,
              jobType: "exterior",
              dispatch: dispatch,
            };
             CreateJob(jobData, {
                    resetForm: () =>{
                      console.log('Form reset');
                    },
                    clearProjectId: () => setCreatedProjectId(null),
                    clearImages: () => {  
                    setUploadedFile(null);
                    }
                  });
        // Store URL for future use if needed
      } else {
        toast.error(result.error || 'Upload failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      toast.error(errorMessage);
    } finally {
      dispatch(setIsUploading(false));
    }
  };
  return (

    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className=" border-b border-gray-200 py-6">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center relative flex items-center justify-center ">
              {/* Back button positioned absolutely in header */}
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="absolute left-0 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-10">Home View</h1>
                <p className="text-lg text-gray-600 mb-1">
                  Select the initial view you want to work on
                </p>
                <p className="text-sm text-gray-500">
                  (Additional views available after delivery of initial project)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Instructions Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Photo Instructions */}

            <div>
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Photo Instruction</h2>
              </div>


              <div className="bg-white rounded-xl p-8 shadow-sm">

                <div className="space-y-6">
                  {/* Time Recommendation */}
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16  rounded-full flex items-center justify-center">
                      <Clock className="h-10 w-10 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        For the best results, we recommend taking your photo between 10am and 4pm.{' '}
                        <span className="font-semibold">Overcast conditions are best.</span>
                      </p>
                    </div>
                  </div>

                  {/* Device Recommendation */}
                  <div className="flex items-center space-x-3">
                    <div className="w-18 h-20  rounded-full flex items-center justify-center">
                      {/* <div className="w-10 h-8 bg-gray-800 rounded border-2 border-gray-600 relative"> */}
                      {/* <div className="w-4 h-3 bg-gray-300 rounded-sm absolute top-1 left-2"></div> */}
                      {/* </div> */}
                      {/* <img src={Camera} alt="Camera Icon" className="h-16 w-16 object-contain" /> */}
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        Project images need to be a min. of 1MB in landscape orientation.{' '}
                        <span className="font-semibold">We can only render what is visible in image.</span>
                      </p>
                    </div>
                  </div>

                  {/* Quality Guidelines */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-16  rounded-full flex items-center justify-center">
                      <Home className="h-8 w-8 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        Be sure to avoid pictures that are blurry, far-away or obstructed by objects.
                      </p>
                    </div>
                  </div>

                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1">
                    See Example
                  </button>
                </div>
              </div>
            </div>

            {/* Photo Upload Grid */}
            <div>
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Photo Upload</h2>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm">


                <div className="grid grid-cols-2 gap-4">
                  {viewTypes.map((viewType) => (
                    <ViewUploader
                      key={viewType.key}
                      viewType={viewType.label}
                      uploadedFile={viewFiles[viewType.key]}
                      onFileUpload={(file) => handleFileUpload(file, viewType.key)}
                      onFileRemove={() => handleFileRemove(viewType.key)}
                      disabled={hasAnyFiles && !viewFiles[viewType.key]}
                    />
                  ))}
                </div>

                {/* Upload Summary */}
                {hasAnyFiles && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">{typeView}</span>  views selected
                      {isAllViewsUploaded && (
                        <span className="ml-2 text-green-700 font-medium">✓ All views ready!</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <Button
              onClick={handleContinue}
              disabled={!hasAnyFiles}
              className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all ${hasAnyFiles
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              {hasAnyFiles ? `Continue with ${typeView} view` : 'Upload at least one view to continue'}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Supported formats: JPG, PNG • Maximum file size: 10MB per image</p>
            <p className="mt-1">You can upload additional views after the initial project delivery</p>
          </div>
        </div>
      </div>

      <GestUserHome />


    </>
  );
};

export default VisualToolHome;