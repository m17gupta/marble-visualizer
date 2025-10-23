import { getSegmentsByJobId } from '@/redux/slices/segmentsSlice'
import { AppDispatch, RootState } from '@/redux/store'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const GetDemoprojectSegmemt = () => {
    const dispatch= useDispatch<AppDispatch>()
    const navigate = useNavigate();
   const {list:projectList}= useSelector   ((state:RootState) => state.projects)
    const {currentJob}= useSelector((state:RootState) => state.jobs)
    const {allSegments,isLoadingManualAnnotation}= useSelector((state:RootState) => state.segments)
    const isApi= useRef<boolean>(false)

    useEffect(( )=>{
      isApi.current=true
    },[])
    
    useEffect(() => {
        if (!currentJob || isLoadingManualAnnotation ) return;
        if (allSegments.length > 0 && isApi.current) {
          // // If segments are already loaded, navigate to the visualizer
          // navigate("/try-visualizer/project");
        } else if(isApi.current) {
           // get all segments from current jobs
           isApi.current= false
          //  console.log("fectch all segmnet")
           dispatch(getSegmentsByJobId(currentJob.id ?? 0 ));
        }

    },[currentJob,allSegments,isLoadingManualAnnotation])
  return (
    null
  )
}

export default GetDemoprojectSegmemt