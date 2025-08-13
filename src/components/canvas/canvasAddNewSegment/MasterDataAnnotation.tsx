import { calculatePolygonAreaInPixels } from '@/components/canvasUtil/CalculatePolygonArea';
import { MsterDataAnnotationResponse } from '@/models/jobSegmentsModal/JobSegmentModal';
import { JobService } from '@/services/jobService/JobService';
import { useEffect, useRef } from 'react'


type Props = {
    annotationPointsFloat: number[];
    segName: string;
    resetAnnotationPoints: (data: MsterDataAnnotationResponse) => void;
    resetAnnotationPointsFail: () => void;
}
const MasterDataAnnotation = ({ annotationPointsFloat, segName, resetAnnotationPoints, resetAnnotationPointsFail }: Props) => {


    const isApi = useRef(true);

    useEffect(() => {
        if (isApi.current &&
            annotationPointsFloat.length > 0 &&
            segName) {
            isApi.current = false;
            getMasterAnnotation(annotationPointsFloat, segName);
        }
    }, [annotationPointsFloat, segName]);
    const getMasterAnnotation = async (segmentationInt: number[], segName: string) => {
        try {
            const xs = [];
            const ys = [];
            for (let i = 0; i < segmentationInt.length; i += 2) {
                xs.push(segmentationInt[i]);
                ys.push(segmentationInt[i + 1]);
            }
            const xmin = Math.min(...xs);
            const xmax = Math.max(...xs);
            const ymin = Math.min(...ys);
            const ymax = Math.max(...ys);

         

            // const pixelArea = calculatePolygonAreaInPixels(segmentationInt);
            const segData: MsterDataAnnotationResponse = {
                annotation: segmentationInt,
                bb_annotation_int: [xmin, ymin, xmax, ymax],
                // bb_area_pixel: pixelArea,
            }

            resetAnnotationPoints(segData);
            // const response: MsterDataAnnotationResponse = await JobService.getMasterAnnotationData(segmentationInt, segName);

            // console.log('Master Annotation Data:', response);
            // if(response ){
            //      isApi.current = true;
            //     resetAnnotationPoints(response);
            // }
        } catch (error) {
            console.error('Error fetching master data:', error);
            isApi.current = true;
            resetAnnotationPointsFail();
        }
    }
    return (
        null
    )
}

export default MasterDataAnnotation