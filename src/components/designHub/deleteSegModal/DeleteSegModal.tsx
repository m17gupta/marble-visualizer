
import { AppDispatch, RootState } from '@/redux/store';

import { useDispatch, useSelector } from 'react-redux';
import DeleteModal from '@/pages/projectPage/deleteProject/DeleteModel'
import { deleteSegmentById, resetEditSegment, updateAndDeleteSelectedSegment, updateIsDeleteSegModal, updateMultipleSegment } from '@/redux/slices/segmentsSlice';

import { toast } from 'sonner';
import { SegmentModal } from '@/models/jobSegmentsModal/JobSegmentModal';
import { updateselectedMasterArrayAndGroup } from '@/redux/slices/MasterArraySlice';
import { updateEditSegmentsOncanvas, updateIsDelete } from '@/redux/slices/canvasSlice';
import UpdateCanvasAfterDelete from './UpdateCanvasAfterDelete';
const DeleteSegModal = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isDeleteSegModal,selectedSegments } = useSelector((state: RootState) => state.segments);
     const {allSegments} = useSelector((state: RootState) => state.segments);
    const handleCloseModal = () => {
      dispatch(updateIsDeleteSegModal(false));
    };


  const handleDeleteSegment = async () => {
    // Ensure selectedSegments is always an array and filter out undefined ids
     dispatch(updateIsDeleteSegModal(false));
    const allSelected: number[] = (selectedSegments ?? [])
      .map(seg => seg.id)
      .filter((id): id is number => typeof id === 'number');
    if (allSelected.length === 0) return;
   // console.log("Deleting segments with IDs:", allSelected);
    try {
      const response = await dispatch(deleteSegmentById(allSelected)).unwrap();
      if (response && response.success) {
    
        if (selectedSegments) {
          afterDeleteSegement(selectedSegments);
        }
        }
    } catch (error) {
      console.error("Error deleting segment:", error);
    }
  };

  // after deleteing 1) deleet from allSegments 2) getAll segmnet and sort it  3) change the allSegments  4) save into database

  const afterDeleteSegement = (selectedSegments:SegmentModal[]) => {

    if(!selectedSegments || selectedSegments.length === 0 || allSegments.length === 0) return;
    const allsegAfterDelete = allSegments.filter(seg => !selectedSegments.some(sel => sel.id === seg.id));
     const getSegType= selectedSegments[0].segment_type;
     //console.log("All Segments after delete:", allsegAfterDelete);
     const allSegmentSegType = allsegAfterDelete.filter(seg => seg.segment_type === getSegType);
     //sort it based on name
     const sortedSegments = allSegmentSegType.sort((a, b) => {
       // Extract number from short_title (e.g., 'Wl1' => 1, 'Wl12' => 12)
       const numA = parseInt((a.short_title ?? "").match(/(\d+)$/)?.[1] ?? "0", 10);
       const numB = parseInt((b.short_title ?? "").match(/(\d+)$/)?.[1] ?? "0", 10);
       return numA - numB;
     });

    
     //rename the segments based on sorted order
     const updatedSegments = sortedSegments.map((seg, index) => {
      const segTitle=seg.short_title??"";
      const prefix = segTitle.replace(/(\d+)$/,"");
      return { ...seg, short_title: `${prefix}${index + 1}` };
     });

   
     // Update the allsegAfterDelete array with the renamed segments
     const finalAllSegments = allsegAfterDelete.map(seg => {
       const updatedSeg = updatedSegments.find(updated => updated.id === seg.id);
       return updatedSeg || seg;
     });

     if(finalAllSegments.length > 0 && getSegType) {
      dispatch(updateEditSegmentsOncanvas(selectedSegments))
      dispatch(updateIsDelete(true))
      updateAllSegmentsInDB(getSegType, finalAllSegments);
     }
   
  }

  // save all segment to database
  const updateAllSegmentsInDB = async (segType:string,allSegments:SegmentModal[]) => {
    try {
      const response = await dispatch(updateMultipleSegment(allSegments)).unwrap();
      console.log("Update all segments response:", response);
    
      if (response && response.success) {
        toast.success("All segments updated successfully");
        dispatch(updateAndDeleteSelectedSegment({segType, allSegmnets: allSegments}))
        dispatch(updateselectedMasterArrayAndGroup({segType, newSegments: allSegments}));
        dispatch(resetEditSegment());
      }
    } catch(error) {
      console.error("Error updating all segments:", error);
    } 
  }
  return (
    <>
   <DeleteModal 
     isOpen={isDeleteSegModal}
     onCancel={handleCloseModal}
     type={"segment"}
     onDeleteSegment={handleDeleteSegment}
   />
 
   </>
  )

}

export default DeleteSegModal