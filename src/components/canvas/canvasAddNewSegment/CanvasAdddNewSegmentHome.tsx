import { RootState } from '@/redux/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import MasterDataAnnotation from './MasterDataAnnotation';
import AddSegmentModal from './AddSegmentModal';
import { updateIsAddSegmentModalOpen } from '@/redux/slices/segmentsSlice';

const CanvasAdddNewSegmentHome = () => {
   const dispatch = useDispatch();
  const {segmentDrawn, isAddSegmentModalOpen} = useSelector((state: RootState) => state.segments);  

  const [isOpenModal, setIsOpenModal] = React.useState(isAddSegmentModalOpen);

  // update open and close modal
  useEffect(() => {
    if(isAddSegmentModalOpen) {
      setIsOpenModal(isAddSegmentModalOpen);
    }else{
      setIsOpenModal(false);
    }
  }, [isAddSegmentModalOpen]);


  const handleCloseModal = () => {
    dispatch(updateIsAddSegmentModalOpen(false));
    setIsOpenModal(false);
  };

  const handleSaveModal = () => {
     dispatch(updateIsAddSegmentModalOpen(false));
    setIsOpenModal(false);
  };
  return (
    <>
   { isOpenModal && <AddSegmentModal
      open={isOpenModal}
      onClose={handleCloseModal}
      onSave={handleSaveModal}
    />}
    
    {segmentDrawn.annotation.length > 0 && segmentDrawn.segType && 
      <MasterDataAnnotation 
        annotationPointsFloat={segmentDrawn.annotation}
        segName={segmentDrawn.segType}
        resetAnnotationPoints={() => {
          // Reset the drawn segment
          segmentDrawn.annotation = [];
          segmentDrawn.segType = '';
          segmentDrawn.groupName = '';
          segmentDrawn.childName = '';
          segmentDrawn.shortName = '';
        }}
   
   />}
    </>
  )
}

export default CanvasAdddNewSegmentHome