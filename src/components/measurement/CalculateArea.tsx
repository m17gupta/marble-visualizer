import { RootState, AppDispatch } from '@/redux/store'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { calculatePolygonAreaInPixels } from '../canvasUtil/CalculatePolygonArea'
import { changeGroupSegment } from '@/redux/slices/segmentsSlice'

const CalculateArea = () => {

    const dispatch = useDispatch<AppDispatch>();
    const {allSegments}= useSelector((state:RootState)=>state.segments)
    const {list :jobLists}= useSelector((state:RootState)=>state.jobs)


    useEffect(() => {
        if (allSegments.length > 0 &&
            jobLists.length > 0 &&
            jobLists[0].distance_ref
        ) {
            // Calculate area for each segment that doesn't already have area_pixel calculated
            allSegments.forEach(segment => {
               // Only calculate if area_pixel is not already set or is different from calculated value
               if (segment.annotation_points_float && segment.annotation_points_float.length > 0) {
                   const areaInPixels = calculatePolygonAreaInPixels(segment.annotation_points_float);

                   // Only update if seg_area_pixel is missing or different
                   if (segment.seg_area_pixel !== areaInPixels) {
                       const updatedSegment = {
                           ...segment,
                           seg_area_pixel: areaInPixels
                       };
                       
                       // Dispatch the update to Redux
                       dispatch(changeGroupSegment([updatedSegment]));
                   }
               }
            });
        }
    }, [allSegments, jobLists, dispatch]);

  return (
    <div>CalculateArea</div>
  )
}

export default CalculateArea