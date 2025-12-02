import VisualToolHome from '@/components/workSpace/visualTool/VisualToolHome'
import { resetIsUploadedSegments } from '@/redux/slices/segmentsSlice';

import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AddProject = () => {
    const dispatch = useDispatch<AppDispatch>();
  const navigate= useNavigate()
         const { isUploadedSegments } = useSelector(
    (state: RootState) => state.segments
  );
    const handleResetProjectCreated = () => {
   
    };
     useEffect(()=>{
      if(isUploadedSegments){
        dispatch(resetIsUploadedSegments(false))
        navigate("/admin/projects")
      }
    },[isUploadedSegments])
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-8">
 
        <VisualToolHome 
                resetProjectCreated={handleResetProjectCreated} />
      </div>
    </div>
  )
}

export default AddProject