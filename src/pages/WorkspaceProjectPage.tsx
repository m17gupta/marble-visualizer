import GetAllInspirational from '@/components/swatchBookData/GetAllInsiprational';

import InspirationSidebar from '@/components/workSpace/projectWorkSpace/InspirationSidebar';
import WorkSpaceHome from '@/components/workSpace/WorkSpaceHome';

import React from 'react';


const WorkspaceProjectPage: React.FC = () => {

  // const { isGenerated } = useSelector((state: RootState) => state.workspace);

  // const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return (
    <>


      <div className='flex'>
        {/* Left: Inspiration and uploads */}
        <div className="w-1/4 border-r">
          <InspirationSidebar />
        </div>



        {/* Middle: Main image preview and AI Guidance panel */}

        {/* {!isGenerated ? (<div className="w-3/4 p-4 flex flex-col bg-gray-50 h-[calc(100vh-3px)] overflow-auto">
       
          <ImagePreview />



          <div className="mt-4 ">
            <GuidancePanel />
          </div>
        </div>) : (
          <CompareGenAiHome />
        )} */}
        <WorkSpaceHome />
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