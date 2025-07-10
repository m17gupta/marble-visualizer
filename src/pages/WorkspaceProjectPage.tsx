import GetAllInspirational from '@/components/swatchBookData/GetAllInsiprational';
import CompareGenAiHome from '@/components/workSpace/compareGenAiImages/CompareGenAiHome';
import GuidancePanel from '@/components/workSpace/projectWorkSpace/GuidancePanel';
import ImagePreview from '@/components/workSpace/projectWorkSpace/ImagePreview';
import InspirationSidebar from '@/components/workSpace/projectWorkSpace/InspirationSidebar';
import { RootState } from '@/redux/store';
import React from 'react';
import { useSelector } from 'react-redux';

const WorkspaceProjectPage: React.FC = () => {

  const { isGenerated } = useSelector((state: RootState) => state.workspace);

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return (
    <>


      <div className='flex'>
        {/* Left: Inspiration and uploads */}
        <div className="w-1/4 border-r">
          <InspirationSidebar />
        </div>



        {/* Middle: Main image preview and AI Guidance panel */}

        {!isGenerated ? (<div className="w-3/4 p-4 flex flex-col bg-gray-50 h-[calc(100vh-3px)] overflow-auto">
          {/* <h2 className="text-lg font-medium mb-4">Project ID: {projectId}</h2> */}
          <ImagePreview />



          <div className="mt-4 ">
            <GuidancePanel />
          </div>
        </div>) : (
          <CompareGenAiHome />
        )}
      </div>

      {/* get all inspiration images */}
      <div className='aa'>
        <GetAllInspirational />
      </div>

    </>
  );
};

export default WorkspaceProjectPage;


//  