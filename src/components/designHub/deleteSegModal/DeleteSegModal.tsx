
import { AppDispatch, RootState } from '@/redux/store';

import { useDispatch, useSelector } from 'react-redux';
import DeleteModal from '@/pages/projectPage/deleteProject/DeleteModel'
import { deleteSegmentById, resetEditSegment, updateIsDeleteSegModal } from '@/redux/slices/segmentsSlice';
import { deleteSegment } from '@/redux/slices/MasterArraySlice';
import { toast } from 'sonner';
const DeleteSegModal = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isDeleteSegModal,selectedSegments } = useSelector((state: RootState) => state.segments);

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
        // delete segment from master array
        allSelected.forEach(segmentId => {
          dispatch(deleteSegment(segmentId));
        });
         toast.success("Segment deleted successfully");
                 dispatch(resetEditSegment())
        }
    } catch (error) {
      console.error("Error deleting segment:", error);
    }
  };
  return (
   <DeleteModal 
     isOpen={isDeleteSegModal}
     onCancel={handleCloseModal}
     type={"segment"}
     onDeleteSegment={handleDeleteSegment}
   />
  )
}

export default DeleteSegModal