import React from 'react';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface UploadingProgressProps {
  fileName: string | null;
  progress?: number;
  isCreatingProject: boolean;
  isCreatingJob: boolean;
}

const UploadingProgress: React.FC<UploadingProgressProps> = ({
  fileName,
  progress = 0,
  isCreatingProject,
  isCreatingJob
}) => {
  const { isUploading } = useSelector((state: RootState) => state.workspace);
  
  if (!isUploading && !isCreatingProject && !isCreatingJob) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-lg">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isCreatingProject ? 'Creating Project...' : 
             isCreatingJob ? 'Setting Up Your Design Job...' : 
             'Uploading Your Image...'}
          </h2>
          
          <p className="text-gray-600 mb-4">
            {isCreatingProject ? 'Setting up your new project' : 
             isCreatingJob ? 'Preparing your design for processing' : 
             fileName ? `Uploading ${fileName}` : 'Processing your file'}
          </p>
          
          {isUploading && !isCreatingProject && !isCreatingJob && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          
          <p className="text-sm text-gray-500">
            {isCreatingProject ? 'This will only take a moment...' :
             isCreatingJob ? 'Your design will be ready soon...' :
             'Please don\'t close this window during upload'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadingProgress;
