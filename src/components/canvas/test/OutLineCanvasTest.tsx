// import { AppDispatch, RootState } from "@/redux/store";
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import * as fabric from "fabric";
// import { cn } from "@/lib/utils";

// import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";

// import { collectPoints } from "@/components/canvasUtil/CreatePolygon";

// type NamedFabricObject = fabric.Object & {
//   name?: string;
//   groupName?: string;
//   subGroupName?: string;
//   isActived?: boolean;
// };
// type CanvasOutlinerLayerProps = {
//   canvas: React.RefObject<any>;
//   className?: string;
//   width?: number;
//   height?: number;
// };
// const OutLineCanvasTest = ({
//   canvas,
//   width,
//   height,
//   className,
// }: CanvasOutlinerLayerProps) => {
//    const dispatch = useDispatch<AppDispatch>();
 
   
//    const { allSegments: allSegmentArray } = useSelector(
//      (state: RootState) => state.segments
//    );
//    // Remove unused refs: containerRef, backgroundImageRef, fabricCanvasRef
//    const [allSegArray, setAllSegArray] = useState<SegmentModal[]>([]);
//    const originalViewportTransform = React.useRef<fabric.TMat2D | null>(null);
//    const { segments } = useSelector(
//      (state: RootState) => state.materialSegments
//    );
//      const { hoverGroup } = useSelector((state: RootState) => state.canvas);
 
//    const { aiTrainImageWidth, aiTrainImageHeight } = useSelector(
//      (state: RootState) => state.canvas
//    );
 
 
//    const [updateSelectedSegment, setUpdateSelectedSegment] =
//      useState<SegmentModal | null>(null);
 
//    const { selectedSegment } = useSelector(
//      (state: RootState) => state.masterArray
//    );
//    const { isResetZoom } = useSelector((state: RootState) => state.canvas);
 

//   // update all segment Array
//   useEffect(() => {
//     if (allSegmentArray && allSegmentArray.length > 0) {
//       setAllSegArray(allSegmentArray);
//     } else {
//       setAllSegArray([]);
//     }
//   }, [allSegmentArray]);


//  useEffect(() => {
//     // Get the fabric canvas from CanavasImage
//     const fabricCanvas = canvas.current?.getFabricCanvas();
//     if (!fabricCanvas) return;

//     // Remove only overlays created by this component
//     const overlays = fabricCanvas.getObjects().filter((obj: any) => obj.subGroupName === 'outline-overlay');
//     overlays.forEach((obj: any) => fabricCanvas.remove(obj));

//     if (
//       allSegArray &&
//       allSegArray.length > 0 &&
//       segments &&
//       segments.length > 0 &&
//       height &&
//       width &&
//       canvas
//     ) {
//       allSegArray.forEach((seg, idx) => {
//         const {
//           segment_type,
//           group_label_system,
//           short_title,
//           annotation_points_float,
//           segment_bb_float,
//         } = seg;
//         const segColor =
//           segments.find(
//             (s: { name: string; color_code: string }) => s.name === segment_type
//           )?.color_code || "#FF1493";
//         const isFill = true;
//         if (!annotation_points_float || annotation_points_float.length === 0) return;
//         if (!segment_bb_float || segment_bb_float.length === 0) return;
//         if (!group_label_system) return;
//         if (!short_title) return;
//         if (!segment_type) return;
//         if (!segColor) return;
//         if (!canvas.current) return;

//         // Pass a unique subGroupName for overlays
//         collectPoints(
//           annotation_points_float,
//           short_title,
//           segment_bb_float,
//           segment_type,
//           group_label_system,
//           segColor,
//           canvas,
//           isFill,
//           height,
//           width,
//           aiTrainImageWidth,
//           aiTrainImageHeight,
//           'outline-overlay' // extra arg for subGroupName
//         );
//       });
//       fabricCanvas.renderAll();
//     }
    
//     // Cleanup function: This will remove all overlays when the component unmounts
//     return () => {
//       const unmountOverlays = fabricCanvas.getObjects().filter((obj: any) => obj.subGroupName === 'outline-overlay');
//       unmountOverlays.forEach((obj: any) => fabricCanvas.remove(obj));
//       fabricCanvas.renderAll();
//     };
    
//   }, [
//     allSegArray,
//     segments,
//     height,
//     width,
//     aiTrainImageWidth,
//     aiTrainImageHeight,
//     canvas
//   ]);
//   return null
// };

// export default OutLineCanvasTest;
