import { AppDispatch, RootState } from '@/redux/store';
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSegmentsByJobId } from "@/redux/slices/segmentsSlice";


const GetSegments = () => {

    const {list: jobList} = useSelector((state: RootState) => state.jobs);
   const {allSegments,isLoadingSegments}= useSelector((state: RootState) => state.segments);
    const isApi=useRef<boolean>(true)
   const dispatch= useDispatch<AppDispatch>()


    useEffect(() => {
        if(isApi.current &&
            jobList &&
            jobList[0] &&
            jobList[0].id &&
            allSegments &&
            allSegments.length === 0 &&
             !isLoadingSegments){
            isApi.current=false;
        getAllSegments(jobList[0].id);
        }
    },[jobList,allSegments,isLoadingSegments])



    const getAllSegments = async (jobId: number) => {
        console.log("fetch from getSegment component")
        try {
            await dispatch(getSegmentsByJobId(jobId)).unwrap();
        } catch (error) {
            console.error("Error fetching segments:", error);
        }
    }
  return (
   null
  )
}

export default GetSegments