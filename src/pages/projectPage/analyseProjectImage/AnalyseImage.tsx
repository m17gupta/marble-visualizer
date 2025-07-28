import  { useEffect, useRef } from 'react'
import { setIsAnalyseProcess } from '@/redux/slices/projectAnalyseSlice';
import { updateProjectAnalysis } from '@/redux/slices/projectSlice';
import { AppDispatch, RootState } from '@/redux/store';

import { useDispatch, useSelector } from 'react-redux';

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
            handleAnalyseImage(jobUrl, projectId);
        }
    },[jobUrl, projectId, isAnalyseImage ])

    const handleAnalyseImage = async(jobUrl:string , projectId:number) => {

        try{

         await dispatch(updateProjectAnalysis({ url: jobUrl, id: projectId })); 
       
    }catch(error) {
        console.error("Error analysing image:", error);
    }
  }
  return (
   null
  )
}
    
export default AnalyseImage