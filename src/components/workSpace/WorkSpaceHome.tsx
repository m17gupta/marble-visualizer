import React from 'react'
import GenAiImages from './compareGenAiImages/GenAiImages'
import GuidancePanel from './projectWorkSpace/GuidancePanel'
import CompareGenAiHome from './compareGenAiImages/CompareGenAiHome'
import ImagePreview from './projectWorkSpace/ImagePreview'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

import StudioPageMobile from '@/pages/StudioPageMobile'

const WorkSpaceHome = () => {
     
      const {currentTabContent} = useSelector((state: RootState) => state.studio);
  return (
    <>
     <div className="w-full md:w-3/4 p-4 flex flex-col bg-gray-50 h-[calc(100vh-3px)] overflow-auto">
            {/* <h2 className="text-lg font-medium mb-4">Project ID: {projectId}</h2> */}
           {currentTabContent==="home" &&
             <ImagePreview /> }

           {currentTabContent==="compare" &&
             <CompareGenAiHome /> }

           

            <div className="mt-4 ">
              <GuidancePanel />
              <GenAiImages />

            </div>
          </div>
         <div className="md:hidden block">
            <StudioPageMobile />
            </div>
          </>

  )
}

export default WorkSpaceHome