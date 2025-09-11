import { RootState } from '@/redux/store';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import * as fabric from "fabric";
import { JobSegmentModel } from '@/models';
import { SegmentModal } from '@/models/jobSegmentsModal/JobSegmentModal';
import { collectPoints } from '@/components/canvasUtil/test/CreatePolygonTest';
type NamedFabricObject = fabric.Object & {
  name?: string;
  groupName?: string;
  subGroupName?: string;
  isActived?: boolean;
};
type props = {
     canvasRef: React.RefObject<any>,
}

const UpdateSegmentaOnCanvas = ({ canvasRef }: props) => {
  const { aiTrainImageWidth, aiTrainImageHeight } = useSelector(
    (state: RootState) => state.canvas
  );
   const { segments } = useSelector(
      (state: RootState) => state.materialSegments
    );
    const {editSegments} = useSelector((state: RootState) => state.canvas);

    useEffect(() => {
        const fabricCanvas = canvasRef.current?.getFabricCanvas();
        if(!fabricCanvas || !editSegments || editSegments.length === 0) return;
          const width = fabricCanvas.getWidth();
          const height = fabricCanvas.getHeight();
        // remove old group
        const allObjects = fabricCanvas.getObjects();
      editSegments.map((seg) => {
          const segName = seg.short_title ??"";
          const segType = seg.segment_type ?? "";

            // console.log("allObjects", allObjects);
            allObjects.forEach((obj: NamedFabricObject) => {
              if (
                obj.type === "group" &&
                obj.name === segName &&
                typeof (obj as fabric.Group).getObjects === "function"
              ) {
        
                 console.log("allGroupObjects  need to delete", obj);
                 // remove the old one
                 fabricCanvas?.remove(obj);
                    // add the new one
                    createNewGroup(seg,width??0,height??0);
              }
            });
      });
        fabricCanvas?.renderAll();
    },[editSegments,canvasRef])


    // create new group after edit
    const createNewGroup = (segment:SegmentModal,width:number,height:number) => {
        const {
          id,
          segment_type,
          group_label_system,
          short_title,
          annotation_points_float,
          segment_bb_float,
        } = segment;

        const segColor =
          segments.find(
            (s: { name: string; color_code: string }) => s.name === segment_type
          )?.color_code || "#FF1493";
          if (!annotation_points_float || annotation_points_float.length === 0)
          return;
        if (!segment_bb_float || segment_bb_float.length === 0) return;
        if (!group_label_system) return;
        if (!short_title) return;
        if (!segment_type) return;
        if (!segColor) return;
        if (!canvasRef.current) return;
        if (!id) return;
 const isFill = false;
        collectPoints(
                 id,
                 annotation_points_float,
                 short_title,
                 segment_bb_float,
                 segment_type,
                 group_label_system,
                 segColor,
                 canvasRef,
                 isFill,
                 height,
                 width,
                 aiTrainImageWidth,
                 aiTrainImageHeight
                 //'hover-overlay' // extra arg for subGroupName
               );

      
      }
    

    return (
      null
    )
}

export default UpdateSegmentaOnCanvas