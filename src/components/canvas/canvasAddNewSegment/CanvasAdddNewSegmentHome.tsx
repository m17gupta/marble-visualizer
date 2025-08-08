import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import MasterDataAnnotation from './MasterDataAnnotation';
import AddSegmentModal from './AddSegmentModal';
import { addSegment, cancelDrawing, updateAddSegMessage, updateIsAddSegmentModalOpen, updateIsMasterDataAnnotationOpen, updateIsNewMasterArray, updateNewSegmentDrawn } from '@/redux/slices/segmentsSlice';
import { SegmentModal, MsterDataAnnotationResponse } from '@/models/jobSegmentsModal/JobSegmentModal';
import { addNewSegmentToMasterArray, addNewSegmentToSelectedMasterArray } from '@/redux/slices/MasterArraySlice';
import { setCanvasType } from '@/redux/slices/canvasSlice';
import AddSegSidebar from './AddSegSidebar';
import { calculatePolygonAreaInPixels } from '@/components/canvasUtil/CalculatePolygonArea';

const CanvasAdddNewSegmentHome = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [segmentData, setSegmentData] = React.useState<SegmentModal | null>(null);

  const { segmentDrawn, isAddSegmentModalOpen, isMasterDataAnnotationOpen } = useSelector((state: RootState) => state.segments);

  const { isNewMasterArray } = useSelector((state: RootState) => state.segments);
  const [isOpenModal, setIsOpenModal] = React.useState(isAddSegmentModalOpen);
  const [isNewAddedMasterArray, setIsNewAddedMasterArray] = React.useState(isNewMasterArray);

  const { list } = useSelector((state: RootState) => state.jobs);
  // update open and close modal
  useEffect(() => {
    if (isAddSegmentModalOpen) {
      setIsOpenModal(isAddSegmentModalOpen);
    } else {
      setIsOpenModal(false);
    }
  }, [isAddSegmentModalOpen]);


  // update new master array modal
  useEffect(() => {
    if (isNewMasterArray) {
      setIsNewAddedMasterArray(isNewMasterArray);
    } else {
      setIsNewAddedMasterArray(false);
    }
  }, [isNewMasterArray]);

  const handleCloseModal = () => {
    dispatch(updateIsAddSegmentModalOpen(false));
    setIsOpenModal(false);
    dispatch(setCanvasType("hover"));
  };

  const handleSaveModal = () => {
    dispatch(updateIsAddSegmentModalOpen(false));
    dispatch(updateIsMasterDataAnnotationOpen(true))
    setIsOpenModal(false);
  };


  const handleResetModal = async (data: MsterDataAnnotationResponse) => {
     const area_pixel= calculatePolygonAreaInPixels(data.annotation||[])
    const segData: SegmentModal = {
      job_id: list[0]?.id,
      title: segmentDrawn.category,
      short_title: segmentDrawn.shortName,
      group_name_user: segmentDrawn.groupName,
      group_desc: "",
      segment_type: segmentDrawn.segType,
      annotation_points_float: data.annotation,
      segment_bb_float: data.bb_annotation_int,
      annotation_type: "user",
      seg_perimeter: data.perimeter_pixel,
      seg_area_sqmt: 0,
      seg_skewx: 0,
      seg_skewy: 0,
      seg_area_pixel: area_pixel,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      group_label_system: segmentDrawn.groupName,

    }
    const response = await dispatch(addSegment(segData)).unwrap();
    dispatch(updateAddSegMessage(" Updating segment details..."));
    if (response && response.success) {

      // update into master Array
      dispatch(updateAddSegMessage(null));
      dispatch(cancelDrawing())
      dispatch(addNewSegmentToMasterArray(response.data));
      dispatch(addNewSegmentToSelectedMasterArray(response.data))
      dispatch(updateNewSegmentDrawn(response.data));
    }
    setSegmentData(segData);
    dispatch(setCanvasType("hover"))
    dispatch(updateIsMasterDataAnnotationOpen(false));
  }

  const handleResetModalFail = () => {
    dispatch(updateIsMasterDataAnnotationOpen(false));
  }

  const handleCloseNewMasterArrayModal = () => {
    setIsNewAddedMasterArray(false);
    dispatch(updateIsNewMasterArray(false));
    dispatch(setCanvasType("hover"));
  };

  const handleSaveNewMasterArrayModal = () => {
    dispatch(setCanvasType("draw"))
    setIsNewAddedMasterArray(false);
    dispatch(updateIsNewMasterArray(false));

  };
  return (
    <>
      {isOpenModal && <AddSegSidebar
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

      {/*  add new Master Array modal */}
      <AddSegmentModal
        open={isNewAddedMasterArray}
        onClose={handleCloseNewMasterArrayModal}
        onSave={handleSaveNewMasterArrayModal}
      />
    </>
  )
}

export default CanvasAdddNewSegmentHome