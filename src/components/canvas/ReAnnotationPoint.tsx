import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMinMaxBBPoint } from '../canvasUtil/GetMInMaxBBPoint';
import { SegmentModal } from '@/models/jobSegmentsModal/JobSegmentModal';
import { changeGroupSegment, resetReAnnoatationPoints, updateSegmentById } from '@/redux/slices/segmentsSlice';
import { addNewSegmentToMasterArray, updateSelectedSegment } from '@/redux/slices/MasterArraySlice';
import { setCanvasType } from '@/redux/slices/canvasSlice';
import { calculatePolygonAreaInPixels } from '../canvasUtil/CalculatePolygonArea';

const ReAnnotationPoint = () => {

    const { reAnnotationPoints } = useSelector((state: RootState) => state.segments);
    const { selectedSegment } = useSelector((state: RootState) => state.masterArray);
    const { canvasType } = useSelector((state: RootState) => state.canvas);
    const isApi = React.useRef(true);
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
        if(selectedSegment &&
             reAnnotationPoints &&
             reAnnotationPoints.length>0 &&
              selectedSegment.segment_type &&isApi.current)  {
            isApi.current = false;
         
            updateReAnnotationPoints(reAnnotationPoints);
        }
    },[reAnnotationPoints, selectedSegment, canvasType]);


    const updateReAnnotationPoints = async (points: number[]) => {
        if (!selectedSegment || points.length === 0 || !selectedSegment.segment_type) return;
     const area_pixel= calculatePolygonAreaInPixels(points||[])
        const minMax = getMinMaxBBPoint(points);
        const data: SegmentModal = {
            id: selectedSegment.id,
            job_id: selectedSegment.job_id,
            short_title: selectedSegment.short_title,
            title: selectedSegment.title,
            group_name_user: selectedSegment.group_name_user,
            group_desc: selectedSegment.group_desc,
            segment_type: selectedSegment.segment_type,
            annotation_points_float: points,
            seg_area_pixel: area_pixel,
             segment_bb_float: minMax,
            annotation_type: "user",
            seg_perimeter: selectedSegment.seg_perimeter,
            seg_area_sqmt: selectedSegment.seg_area_sqmt,
            seg_skewx: selectedSegment.seg_skewx,
            seg_skewy: selectedSegment.seg_skewy,
            group_label_system: selectedSegment?.group_label_system,
           

        }
      
        try{
             const response= await dispatch(updateSegmentById(data)).unwrap();
          
             if(response.success ) {
              
                // update segments Array
                dispatch(changeGroupSegment(data))
                // update master array
                 dispatch(addNewSegmentToMasterArray(data));

                 // update selected segment
                 dispatch(updateSelectedSegment(data));

                 dispatch(setCanvasType("hover"))
                 dispatch(resetReAnnoatationPoints())
                 isApi.current = true;
             }
        }catch (error) {
            isApi.current = true;
            console.error("Error updating re-annotation points:", error);
        }

    }
    return (
        null
    )
}

export default ReAnnotationPoint