import { getAllJobs } from '@/redux/slices/jobSlice';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import GetSelectedJob from './GetSelectedJob';


type  Props={
    selectedProjectId: number | undefined;
}
const JobHome = ({ selectedProjectId }: Props) => {


    const getAllJob= useSelector(getAllJobs)
     const [isFetchJob, setIsFetchJob] = React.useState(false);

  
    useEffect(() => {
      if(selectedProjectId &&
        getAllJob && getAllJob.length===0
      ) {
       
        setIsFetchJob(true);
      

      }
    }, [getAllJob, selectedProjectId]);

   

  return (
   <> 
   {isFetchJob &&
   selectedProjectId &&
   <GetSelectedJob
   selectedProjectId={selectedProjectId}
   />}


   </> 
  );  
}

export default JobHome