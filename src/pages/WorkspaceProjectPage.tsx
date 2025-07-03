import GuidancePanel from '@/components/workSpace/projectWorkSpace/GuidancePanel';
import ImagePreview from '@/components/workSpace/projectWorkSpace/ImagePreview';
import InspirationSidebar from '@/components/workSpace/projectWorkSpace/InspirationSidebar';
import React from 'react';
import { useParams } from 'react-router-dom';

const WorkspaceProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className="flex h-screen">
      {/* Left: Inspiration and uploads */}
      <div className="w-1/4 border-r">
        <InspirationSidebar />
      </div>
      {/* Middle: Main image preview and AI Guidance panel */}
      <div className="w-3/4 p-4 flex flex-col bg-gray-100">
        {/* <h2 className="text-lg font-medium mb-4">Project ID: {projectId}</h2> */}
        <ImagePreview  />
        <div className="mt-4 ">
          <GuidancePanel />
        </div>
      </div>
    </div>
  );
};

export default WorkspaceProjectPage;
