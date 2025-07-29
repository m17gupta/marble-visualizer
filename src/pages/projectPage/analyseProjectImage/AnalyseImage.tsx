import  { useEffect, useRef } from 'react'
import { setIsAnalyseFinish, setIsAnalyseProcess, setProjectId } from '@/redux/slices/projectAnalyseSlice';
import {  updateProjectAnalysis } from '@/redux/slices/projectSlice';
import { AppDispatch, RootState } from '@/redux/store';

import { useDispatch, useSelector } from 'react-redux';
import { ProjectApiResponse } from '@/services/projects/projectApi/ProjectApi';

const AnalyseImage = () => {

    const {jobUrl, projectId, isAnalyseImage,} = useSelector((state: RootState) => state.projectAnalyse);
     const dispatch = useDispatch<AppDispatch>();
     const isApi = useRef(true);
    useEffect(() => {
        if(isAnalyseImage && 
            jobUrl && 
            projectId &&
            isApi.current) {
            isApi.current = false; 
            dispatch(setIsAnalyseProcess(false));
            dispatch(setProjectId(null));
            handleAnalyseImage(jobUrl, projectId);
        }
    },[jobUrl, projectId, isAnalyseImage ])

    const handleAnalyseImage = async(jobUrl:string , projectId:number) => {

        try{

      const response = await dispatch(updateProjectAnalysis({ url: jobUrl, id: projectId })); 
      // console.log("Response from image analysis:", response);
      if(response && response.payload &&response.payload) {

        const responseData = response.payload as ProjectApiResponse;
        if(responseData.success) {
            console.log("Image analysis successful:", responseData.data);
             dispatch(setIsAnalyseFinish(true));
        }
      
      }
      
       
    }catch(error) {
      alert("Error analysing image. Please try again.");
        console.error("Error analysing image:", error);
    }
  }


  

  return (
   null
  )
}
    
export default AnalyseImage