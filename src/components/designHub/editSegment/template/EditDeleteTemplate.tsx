import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../ui/button";
import { Badge } from "@/components/ui/badge";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import EditDeleteSegment from "../EditDeleteSegment";
import { AppDispatch, RootState } from "@/redux/store";
import { changeGroupSegment, resetEditSegment, updateSegmentById } from "@/redux/slices/segmentsSlice";
import { updateIsCreatedMasterArray } from "@/redux/slices/MasterArraySlice";

const EditDeleteTemplate = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  
  const { selectedSegments } = useSelector(
    (state: RootState) => state.segments
  );
  // delete segment


  const handleCancel = () => {
    // setUserSelectedSegment([]);
    // dispatch(updateIsDeleteSegModal(false));
  };

  const handleSaveChanges = () => {
      //updateSegmentById
      if(selectedSegments && selectedSegments.length>0){
        selectedSegments.map((item, index)=>{
          updatSegmentById(item, index+1)
        })
      }
  }

  // update the segment based og id
  const updatSegmentById=async(data:SegmentModal, indexValue :number)=>{
  try{
    const response= await dispatch(updateSegmentById(data)).unwrap
    console.log("response", response, "indexValue",indexValue)
    if(indexValue===selectedSegments?.length){
      // console.log("update mater Array")
       dispatch(changeGroupSegment(selectedSegments))
       dispatch(resetEditSegment())
       dispatch(updateIsCreatedMasterArray(false))
    }
  }catch(err){
    console.log("err",err)
  }
  }
  return (
    <>
      <div className="pb-3">
   

        <div className="px-3 pt-2">
          <div className="flex items-center justify-between mb-0">
            <h4 className="text-[15px] font-medium">
              Choose segment to edit or delete
            </h4>
          </div>
        
        </div>
      </div>

      <EditDeleteSegment />

      {/* Footer */}
      <div className="flex justify-end gap-3 px-3 pt-2 mt-6 border-t">
    
        
         <Button variant="outline" onClick={handleSaveChanges}>
          Save
        </Button>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        
       
      </div>
    </>
  );
};

export default EditDeleteTemplate;
