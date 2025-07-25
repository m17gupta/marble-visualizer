<<<<<<< Updated upstream
import React from 'react'
import GenAiImages from './compareGenAiImages/GenAiImages'
import GuidancePanel from './projectWorkSpace/GuidancePanel'
import CompareGenAiHome from './compareGenAiImages/CompareGenAiHome'
import ImagePreview from './projectWorkSpace/ImagePreview'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import CanvasAdddNewSegmentHome from '../canvas/canvasAddNewSegment/CanvasAdddNewSegmentHome'
import StudioPageMobile from '@/pages/StudioPageMobile'
=======
import React, { useEffect, useState } from "react";
import GenAiImages from "./compareGenAiImages/GenAiImages";
import GuidancePanel from "./projectWorkSpace/GuidancePanel";
import CompareGenAiHome from "./compareGenAiImages/CompareGenAiHome";
import ImagePreview from "./projectWorkSpace/ImagePreview";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import CanvasAdddNewSegmentHome from "../canvas/canvasAddNewSegment/CanvasAdddNewSegmentHome";
import { fetchJobsByProject } from "@/redux/slices/jobSlice";
import { useParams } from "react-router-dom";
import { parse } from "path";
import { GenAiChat } from "@/models/genAiModel/GenAiModel";
import {
  fetchGenAiChat,
  resetGenAiState,
  setCurrentGenAiImage,
} from "@/redux/slices/visualizerSlice/genAiSlice";
>>>>>>> Stashed changes

const WorkSpaceHome = () => {
  const { currentTabContent } = useSelector((state: RootState) => state.studio);
  const param = useParams();
  const id = param.id !== undefined ? parseInt(param.id) : 0;
  const { list: projects } = useSelector((state: RootState) => state.projects);
  const findProject = projects.find((d) => d.id == id);
  const jobId =
    findProject?.jobData !== undefined ? findProject.jobData[0].id : 0;
  const {
    genAiImages,
    requests,
    error,
    isFetchingGenAiImages,
    currentGenAiImage,
  } = useSelector((state: RootState) => state.genAi);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!genAiImages || genAiImages.length === 0) {
      dispatch(fetchGenAiChat(jobId!));
    }
  }, [genAiImages]);
  console.log(genAiImages);

  return (
    <>
<<<<<<< Updated upstream
     <div className="w-full md:w-3/4 p-4 flex flex-col bg-gray-50 h-[calc(100vh-3px)] overflow-auto">
            {/* <h2 className="text-lg font-medium mb-4">Project ID: {projectId}</h2> */}
           {currentTabContent==="home" &&
             <ImagePreview /> }
=======
      <div className="w-3/4 p-4 flex flex-col bg-gray-50 h-[calc(100vh-3px)] overflow-auto">
        {/* <h2 className="text-lg font-medium mb-4">Project ID: {projectId}</h2> */}
        {currentTabContent === "home" && <ImagePreview />}
>>>>>>> Stashed changes

        {currentTabContent === "compare" && <CompareGenAiHome />}

        <div className="mt-4 ">
          <GuidancePanel />
          <GenAiImages />
        </div>
      </div>
    </>
  );
};

<<<<<<< Updated upstream
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
=======
export default WorkSpaceHome;
>>>>>>> Stashed changes
