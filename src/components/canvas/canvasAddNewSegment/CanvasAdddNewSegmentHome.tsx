import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import MasterDataAnnotation from './MasterDataAnnotation';
import AddSegmentModal from './AddSegmentModal';
import { addSegment, cancelDrawing, updateAddSegMessage, updateIsAddSegmentModalOpen, updateIsMasterDataAnnotationOpen, updateNewSegmentDrawn } from '@/redux/slices/segmentsSlice';
import { SegmentModal, MsterDataAnnotationResponse } from '@/models/jobSegmentsModal/JobSegmentModal';
import { addNewSegmentToMasterArray, addNewSegmentToSelectedMasterArray } from '@/redux/slices/MasterArraySlice';

const CanvasAdddNewSegmentHome = () => {
   const dispatch = useDispatch<AppDispatch>();

   const [segmentData, setSegmentData] = React.useState<SegmentModal | null>(null);

  const {segmentDrawn, isAddSegmentModalOpen, isMasterDataAnnotationOpen} = useSelector((state: RootState) => state.segments);  

  const [isOpenModal, setIsOpenModal] = React.useState(isAddSegmentModalOpen);
    const {list} = useSelector((state: RootState) => state.jobs);
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
     dispatch(updateIsMasterDataAnnotationOpen(true))
    setIsOpenModal(false);
  };


  const handleResetModal = async (data: MsterDataAnnotationResponse) => {

    const segData:SegmentModal= {
      job_id: list[0]?.id,
      title: segmentDrawn.category,
      short_title: segmentDrawn.shortName,
      group_name_user: segmentDrawn.groupName,
      group_desc:"",
      segment_type: segmentDrawn.segType,
      annotation_points_float: data.annotation,
      segment_bb_float: data.bb_annotation_int,
      annotation_type: "user",
      seg_perimeter:data.perimeter_pixel,
      seg_area_sqmt: 0,
      seg_skewx: 0,
      seg_skewy: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      group_label_system: segmentDrawn.childName,
      
    }
     const response = await dispatch(addSegment(segData)).unwrap();
               dispatch(updateAddSegMessage(" Updating segment details..."));
    if (response && response.success) {
     
      // update into master Array
          dispatch(updateAddSegMessage(""));
      dispatch(cancelDrawing())
      dispatch(addNewSegmentToMasterArray(response.data));
      dispatch(addNewSegmentToSelectedMasterArray(response.data))
       dispatch(updateNewSegmentDrawn(response.data));
    }
    setSegmentData(segData);
    dispatch(updateIsMasterDataAnnotationOpen(false));
  }

  const handleResetModalFail = () => {
    dispatch(updateIsMasterDataAnnotationOpen(false));
  }
  return (
    <>
   { isOpenModal && <AddSegmentModal
      open={isOpenModal}
      onClose={handleCloseModal}
      onSave={handleSaveModal}
    />}
    
    {
    isMasterDataAnnotationOpen && 
    segmentDrawn.annotation.length > 0 && 
    segmentDrawn.childName && 
      <MasterDataAnnotation 
        annotationPointsFloat={segmentDrawn.annotation}
        segName={segmentDrawn.childName}
        resetAnnotationPoints={handleResetModal}
        resetAnnotationPointsFail={handleResetModalFail}
      />}
    </>
  )
}

export default CanvasAdddNewSegmentHome