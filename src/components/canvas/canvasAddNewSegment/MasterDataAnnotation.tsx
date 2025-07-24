import { JobService } from '@/services/jobService/JobService';
import React, { useEffect, useRef } from 'react'


type Props={
    annotationPointsFloat: number[];
    segName: string;
    resetAnnotationPoints: () => void;
}
const MasterDataAnnotation = ({ annotationPointsFloat, segName, resetAnnotationPoints }: Props) => {


    const isApi= useRef(true);

    useEffect(() => {
        if (isApi.current && annotationPointsFloat.length > 0 && segName) {
            isApi.current = false;
            getMasterAnnotation(annotationPointsFloat, segName);
        }
    },[annotationPointsFloat, segName]);
    const getMasterAnnotation = async (segmentationInt: number[], segName: string) => {
        try {
            const response = await JobService.getMasterAnnotationData(segmentationInt, segName);

            console.log('Master Annotation Data:', response);
            if(response ){
                 isApi.current = true;
                resetAnnotationPoints();
            }
        }catch  (error) {
            console.error('Error fetching master data:', error);
             isApi.current = true;
             resetAnnotationPoints();
        }   
    }
  return (
    null
  )
}

export default MasterDataAnnotation