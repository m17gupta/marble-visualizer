import React, { useEffect, useState } from 'react'
import SegmentEditModal from './SegmentEditModal'
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { changeGroupSegment, updateAddSegMessage, updateIsSegmentEdit, updateSegmentById } from '@/redux/slices/segmentsSlice';
import { SegmentModal } from '@/models/jobSegmentsModal/JobSegmentModal';
import { toast } from 'sonner';
import { changeGroupSelectedSegment, deletedChangeGroupSegment } from '@/redux/slices/MasterArraySlice';
import { MasterModel } from '@/models/jobModel/JobModel';

const SegmentHome = () => {

    const dispatch = useDispatch<AppDispatch>();
    const [ isOpen, setIsOpen] = useState(false);

        const {isSegmentEdit} = useSelector((state: RootState) => state.segments);
  


useEffect(() => {
    if(isSegmentEdit) {
      setIsOpen(isSegmentEdit);
    }else{
        setIsOpen(false);
    }
}, [isSegmentEdit]);


const handleCloseEditModal = () => {
    dispatch(updateIsSegmentEdit(false))
    setIsOpen(false);
  };

    const updateSegmentBasedOnId = async (segmentData: SegmentModal): Promise<boolean> => {
      const response = await dispatch(updateSegmentById(segmentData));
      if (updateSegmentById.fulfilled.match(response)) {
        toast.success("Segment updated successfully!");
        return true;
      } else {
        toast.error("Failed to update segment.")
        return false;
      }
    };

  const handleSaveSegment = async(data: SegmentModal, new_master: MasterModel | null) => {
     handleCloseEditModal()
     const isUpdated = await updateSegmentBasedOnId(data);
    if (!isUpdated) {
      return;
    }
    //  setIsUpdated(false);
    // update all Segments Array
    dispatch(changeGroupSegment(data));
    // update master array
    dispatch(changeGroupSelectedSegment({
      master: new_master,
      updatedSegment: data,
    }));

    //delete the selected segment and  from master array
    dispatch(deletedChangeGroupSegment(data))

     dispatch(updateAddSegMessage(null));
    
  }


  return (
    <>
    <SegmentEditModal
    open={isOpen}
    onClose={handleCloseEditModal}
    onSave={handleSaveSegment}
    />
    </>
  )
}

export default SegmentHome