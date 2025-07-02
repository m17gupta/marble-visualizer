import React from 'react';
import { Clock, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../../ui/button';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useViewFiles } from '@/hooks/useWorkspace';
import ViewUploader from './ViewUploader';
import { ViewType } from '@/redux/slices/visualizerSlice/workspaceSlice';
import { useNavigate } from 'react-router-dom';

const VisualToolHome = () => {
  const navigate = useNavigate();
  const { enterStepperMode } = useWorkspace();
  const { viewFiles, setViewFile, removeViewFile, hasAnyFiles, fileCount, isAllViewsUploaded } = useViewFiles();

  const handleFileUpload = (view: ViewType, file: File) => {
    setViewFile(view, file);
  };

  const handleFileRemove = (view: ViewType) => {
    removeViewFile(view);
  };

  const handleContinue = () => {
    if (hasAnyFiles) {
      enterStepperMode();
      console.log('Proceeding with uploaded files:', viewFiles);
    }
  };

  const handleGoBack = () => {
    // Navigate back to the previous page or dashboard
    navigate(-1); // Go back one step in browser history
    // Alternative: navigate('/app/dashboard') or navigate('/app/projects')
  };

  // Define view types and their display names
  const viewTypes: { key: ViewType; label: string }[] = [
    { key: 'front', label: 'Front View' },
    { key: 'rear', label: 'Rear View' },
    { key: 'left', label: 'Left View' },
    { key: 'right', label: 'Right View' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center relative">
            {/* Back button positioned absolutely in header */}
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Home View</h1>
            <p className="text-lg text-gray-600 mb-1">
              Select the initial view you want to work on
            </p>
            <p className="text-sm text-gray-500">
              (Additional views available after delivery of initial project)
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Instructions Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Photo Instructions */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold mr-3">
                1
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Photo Instruction</h2>
            </div>

            <div className="space-y-6">
              {/* Time Recommendation */}
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Clock className="h-8 w-8 text-gray-600" />
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
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="w-8 h-6 bg-gray-800 rounded border-2 border-gray-600 relative">
                    <div className="w-4 h-3 bg-gray-300 rounded-sm absolute top-1 left-2"></div>
                  </div>
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
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Home className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    Be sure to avoid pictures that are blurry, far-away or obstructed by objects.
                  </p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1">
                    See Example
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Upload Grid */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold mr-3">
                2
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Photo Upload</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {viewTypes.map((viewType) => (
                <ViewUploader
                  key={viewType.key}
                  viewType={viewType.label}
                  uploadedFile={viewFiles[viewType.key]}
                  onFileUpload={(file) => handleFileUpload(viewType.key, file)}
                  onFileRemove={() => handleFileRemove(viewType.key)}
                  disabled={false}
                />
              ))}
            </div>

            {/* Upload Summary */}
            {hasAnyFiles && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">{fileCount}</span> of 4 views uploaded
                  {isAllViewsUploaded && (
                    <span className="ml-2 text-green-700 font-medium">✓ All views ready!</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!hasAnyFiles}
            className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all ${
              hasAnyFiles
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {hasAnyFiles ? `Continue with ${fileCount} view${fileCount > 1 ? 's' : ''}` : 'Upload at least one view to continue'}
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Supported formats: JPG, PNG • Maximum file size: 10MB per image</p>
          <p className="mt-1">You can upload additional views after the initial project delivery</p>
        </div>
      </div>
    </div>
  );
};

export default VisualToolHome;