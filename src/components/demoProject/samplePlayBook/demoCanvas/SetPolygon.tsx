
import { collectPoints } from '@/components/canvasUtil/test/CreatePolygonTest';
import { SegmentModal } from '@/models/jobSegmentsModal/JobSegmentModal';
import { RootState } from '@/redux/store';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { boolean } from 'zod';
type Props = {
  canvas: React.RefObject<any>;
  width: number;
  height: number;
};
const SetPolygon: React.FC<Props> = ({ canvas, width, height }) => {
  const { selectedDemoMasterItem, demoMasterArray } = useSelector((state: RootState) => state.demoMasterArray);
  const { aiTrainImageHeight, aiTrainImageWidth } = useSelector((state: RootState) => state.canvas);
  const isRendered = React.useRef<boolean>(true);

  useEffect(() => {
    // console.log("SetPolygon useEffect triggered",canvas.current);
    if (demoMasterArray && demoMasterArray.length === 0) {
      isRendered.current = true;
      canvas.current?.clear();
      console.log("Canvas cleared as demoMasterArray is empty");
    }
    else if (canvas.current &&
      aiTrainImageWidth &&
      aiTrainImageHeight &&
      isRendered.current &&
      demoMasterArray &&
      demoMasterArray.length > 0) {
      isRendered.current = false;
      const fc = canvas.current;
      const vw = width;
      const canvasWidth = fc.getWidth();
      const canvasHeight = fc.getHeight();

      demoMasterArray.forEach((segment, idx) => {
        const allSegment = segment.allSegments as SegmentModal[];
        allSegment.forEach((seg, idx) => {
          const {
            id,
            segment_type,
            group_label_system,
            short_title,
            annotation_points_float,
            segment_bb_float,
          } = seg;
          const segColor = segment?.color_code || "#FF1493";

          const isFill = false;
          if (!annotation_points_float || annotation_points_float.length === 0) {
            toast.error("No annotation points found");

            return;
          }
          if (!segment_bb_float || segment_bb_float.length === 0) {
            toast.error("No bounding box found for segment:" + short_title);
            return;
          }
          if (!group_label_system) {
            toast.error("No group label found for segment:" + short_title);
            return;
          }
          if (!short_title) {
            toast.error("No short title found for segment:" + short_title);
            return;
          }
          if (!segment_type) {
            toast.error("No segment type found for segment:" + short_title);
            return;
          }
          if (!segColor) {
            toast.error("No segment color found for segment:" + short_title);
            return;
          }
          if (!canvas.current) {
            toast.error("Canvas reference is null");
            return;
          }
          if (!id) {
            toast.error("No segment ID found for segment:" + short_title);
            return;
          }
          const demoCanvas = true
          //console.log("SetPolygon calling collectPoints",short_title);
          // Pass a unique subGroupName for overlays
          collectPoints(
            id,
            annotation_points_float,
            short_title,
            segment_bb_float,
            segment_type,
            group_label_system,
            segColor,
            canvas,
            false,
            canvasHeight,
            canvasWidth,
            aiTrainImageWidth,
            aiTrainImageHeight,
            demoCanvas
            //'hover-overlay' // extra arg for subGroupName
          );

        });
        fc.renderAll();
      });
    }
  }, [demoMasterArray, aiTrainImageHeight, aiTrainImageWidth, canvas])
  return (
    null
  )
}

export default SetPolygon