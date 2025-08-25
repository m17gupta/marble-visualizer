import { HouseSegmentModel } from '@/models/projectModel/ProjectModel';
import { setIsAnalyseFinish, setJobUrl } from '@/redux/slices/projectAnalyseSlice';
import { fetchHouseSegments } from '@/redux/slices/projectSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const GetHouseSegments = () => {
   const dispatch = useDispatch<AppDispatch>();
     const isApi = useRef(true);
     const {jobUrl,isAnalyseFinish} = useSelector((state: RootState) => state.projectAnalyse);


     useEffect(() => {
       if (isAnalyseFinish && jobUrl!= null && isApi.current) {
        isApi.current = false;
        dispatch(setIsAnalyseFinish(false));
        dispatch(setJobUrl(null));
         getHouseSegmentsAnnottation(jobUrl);
       }
     }, [isAnalyseFinish, jobUrl]);

    const getHouseSegmentsAnnottation = async (jobUrl:string ) => {
    const data:HouseSegmentModel={
        home_url: jobUrl,
        segment_prompt: ["Wall", "Roof", "Trim", "Window", "Door", "Garage Door"],
    }
    try {
    const response= await dispatch(fetchHouseSegments(data)).unwrap();

    console.log("House segments fetched successfully:", response);
     
    } catch (error) {
      console.error("Error fetching house segments:", error);
    }
  }
  return (
   null
  )
}

export default GetHouseSegments