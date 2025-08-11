import { AppDispatch, RootState } from '@/redux/store';
import  { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { fetchJobComments } from '@/redux/slices/comments/JobComments';

const GetAllJobComments = () => {

    const {list: jobList} = useSelector((state: RootState) => state.jobs);
    const {projectComments, isfetched} = useSelector((state: RootState) => state.jobComments);

     const isAPi= useRef<boolean>(false);
     const dispatch= useDispatch<AppDispatch>();
       useEffect(() => {
         if (!isfetched && 
            !isAPi.current && 
            jobList.length > 0 &&
            jobList[0].id &&
             projectComments.length === 0) {
           isAPi.current = true;
           getComments(jobList[0].id);
         }
       },[isfetched,projectComments, jobList]);

    const getComments= async (jobId: number) => {
       try{
         await  dispatch(fetchJobComments(jobId));
       }catch(  error) {
           console.error("Error fetching job comments:", error);
       }
    }
  return (
    null
  )
}

export default GetAllJobComments