// import { AppDispatch, RootState } from "@/redux/store";
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import * as fabric from "fabric";
// import type { Canvas } from "fabric/fabric-impl";
// import {
//   LoadImageWithCORS,
//   LoadImageWithFetch,
//   setBackgroundImage,
// } from "../canvasUtil/canvasImageUtils";
// import { toast } from "sonner";
// import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { motion, AnimatePresence } from "framer-motion";
// import { collectPoints } from "../canvasUtil/CreatePolygon";
// import { cn } from "@/lib/utils";
// import { Card, CardContent } from "../ui/card";
// import {
//   setCanvasReady,
//   setIsResetZoom,
//   setMousePosition,
//   setZoom,
// } from "@/redux/slices/canvasSlice";
// import {
//   handlePolygonVisibilityOnMouseMove,
//   handlePolygonVisibilityTest,
//   HideAllSegments,
// } from "../canvasUtil/HoverSegment";
// import { SelectedAnimation } from "../canvasUtil/SelectedAnimation";
// import { ZoomCanvasMouse } from "../canvasUtil/ZoomCanvas";
// import { all } from "axios";
// import { getContainedPolygonNamesByBoundingBox } from "../canvasUtil/DetectPolygonUnderTarget";
// import { getCutOutArea } from "../canvasUtil/CutOutArea";
// import CanavasImage from "./CanavasImage";
// // Removed duplicate import of React and useRef

// type NamedFabricObject = fabric.Object & { name?: string };

// interface CanvasHoverLayerProps {
//   canvas: React.RefObject<Canvas>;
//   className?: string;
//   width?: number;
//   height?: number;
// }
// const PolygonOverlay = ({
//   canvas,
//   className,
//   width,
//   height,
// }: CanvasHoverLayerProps) => {
//   // Ref to access the fabric canvas from CanavasImage
//   const canavasImageRef = React.useRef<any>(null);
//   const dispatch = useDispatch<AppDispatch>();

//   const { isCanvasReady } = useSelector((state: RootState) => state.canvas);
//   const { allSegments: allSegmentArray } = useSelector(
//     (state: RootState) => state.segments
//   );
//   // Remove unused refs: containerRef, backgroundImageRef, fabricCanvasRef
//   const [allSegArray, setAllSegArray] = useState<SegmentModal[]>([]);
//   const originalViewportTransform = React.useRef<fabric.TMat2D | null>(null);
//   const { segments } = useSelector(
//     (state: RootState) => state.materialSegments
//   );
//     const { hoverGroup } = useSelector((state: RootState) => state.canvas);

//   const { aiTrainImageWidth, aiTrainImageHeight } = useSelector(
//     (state: RootState) => state.canvas
//   );

//   const [imageWidth, setImageWidth] = useState<number>(0);
//   const [imageHeight, setImageHeight] = useState<number>(0);
//   const [updateSelectedSegment, setUpdateSelectedSegment] =
//     useState<SegmentModal | null>(null);
//   const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
//   const { selectedSegment } = useSelector(
//     (state: RootState) => state.masterArray
//   );
//   const { isResetZoom } = useSelector((state: RootState) => state.canvas);

//   // upate all segmnet Array
//   useEffect(() => {
//     if (allSegmentArray && allSegmentArray.length > 0) {
//       setAllSegArray(allSegmentArray);
//     } else {
//       setAllSegArray([]);
//     }
//   }, [allSegmentArray]);

//   // Removed resizeCanvas and containerRef logic as it's not used after refactor

//   // Removed handleResize effect as fabricCanvasRef is not used locally

//   // Update selected segment
//   useEffect(() => {
//     if (selectedSegment) {
//       setUpdateSelectedSegment(selectedSegment);
//     } else {
//       setUpdateSelectedSegment(null);
//     }
//   }, [selectedSegment]);

//   const handleMouseMove = (event: fabric.TEvent) => {
//     const fabricCanvas = canavasImageRef.current?.getFabricCanvas?.();
//     if (!fabricCanvas) return;
//     const fabricRef = { current: fabricCanvas };
//     const fabricEvent = event as unknown as { target?: NamedFabricObject };
//     const target = fabricEvent.target;
//     const pointer = fabricCanvas.getPointer(event.e);
//     if (target !== undefined) {
//       const targetName = target.name;
//       if (targetName) {
//         const fabricPoint = new fabric.Point(pointer.x, pointer.y);
//         dispatch(setMousePosition({
//           x: Math.round(fabricPoint.x),
//           y: Math.round(fabricPoint.y),
//         }));
//         handlePolygonVisibilityTest(fabricRef, targetName, fabricPoint);
//       }
//     } else {
//       HideAllSegments(fabricRef);
//     }
//   };



//   const isPolygonUpdate = React.useRef(false);
//   useEffect(() => {
//     // Get the fabric canvas from CanavasImage
//     const fabricCanvas = canavasImageRef.current?.getFabricCanvas?.();

//     if (
//       allSegArray &&
//       allSegArray.length > 0 &&
//       segments &&
//       segments.length > 0 &&
//       height &&
//       width &&
//       fabricCanvas
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
//         const isFill = false;
//         if (!annotation_points_float || annotation_points_float.length === 0) {
//           console.warn(
//             `[PolygonOverlay] Segment ${idx} missing annotation_points_float`,
//             seg
//           );
//           return;
//         }
//         if (!segment_bb_float || segment_bb_float.length === 0) {
//           console.warn(
//             `[PolygonOverlay] Segment ${idx} missing segment_bb_float`,
//             seg
//           );
//           return;
//         }
//         if (!group_label_system) {
//           console.warn(
//             `[PolygonOverlay] Segment ${idx} missing group_label_system`,
//             seg
//           );
//           return;
//         }
//         if (!short_title) {
//           console.warn(
//             `[PolygonOverlay] Segment ${idx} missing short_title`,
//             seg
//           );
//           return;
//         }
//         if (!segment_type) {
//           console.warn(
//             `[PolygonOverlay] Segment ${idx} missing segment_type`,
//             seg
//           );
//           return;
//         }
//         if (!segColor) {
//           console.warn(`[PolygonOverlay] Segment ${idx} missing segColor`, seg);
//           return;
//         }
//         if (!fabricCanvas) {
//           console.warn(
//             `[PolygonOverlay] fabricCanvas missing at segment ${idx}`
//           );
//           return;
//         }

//         collectPoints(
//           annotation_points_float,
//           short_title,
//           segment_bb_float,
//           segment_type,
//           group_label_system,
//           segColor,
//           { current: fabricCanvas }, // Pass as ref-like object
//           isFill,
//           height,
//           width,
//           aiTrainImageWidth,
//           aiTrainImageHeight
//         );
//         if (idx == allSegArray.length - 1) {
//           isPolygonUpdate.current = true;
//         }
//       });

//       fabricCanvas.renderAll();
//     }
//   }, [
//     allSegArray,
//     segments,
//     height,
//     width,
//     aiTrainImageWidth,
//     aiTrainImageHeight,
//   ]);

//   // hover on group segment

//   useEffect(() => {
//     const fabricCanvas = canavasImageRef.current?.getFabricCanvas?.();
//     if (!fabricCanvas) return;
//     const fabricRef = { current: fabricCanvas };
//     if (hoverGroup == null) {
//       HideAllSegments(fabricRef);
//     } else if (hoverGroup.length > 0) {
//       hoverGroup.forEach((groupName) => {
//         handlePolygonVisibilityOnMouseMove(fabricRef, groupName);
//       });
//     }
//   }, [hoverGroup]);

//   // update Animation on selected segment
//   useEffect(() => {
//     const fabricCanvas = canavasImageRef.current?.getFabricCanvas?.();
//     if (!fabricCanvas || !updateSelectedSegment) return;

//     const canvas = fabricCanvas;
//     const segName = updateSelectedSegment.short_title;
//     const annotatonPoints = updateSelectedSegment.annotation_points_float;
//     const color =
//       segments.find(
//         (s: { name: string; color_code: string }) =>
//           s.name === updateSelectedSegment.segment_type
//       )?.color_code || "#FE0056";
//     if (!annotatonPoints || annotatonPoints.length === 0 || !segName || !color)
//       return;
//     // Remove existing selected animation
//     const allObjects = canvas.getObjects();
//     allObjects.forEach((item: any) => {
//       const namedItem = item as NamedFabricObject;
//       if (
//         item instanceof fabric.Polygon &&
//         namedItem.name === `SelectedPolygon`
//       ) {
//         canvas.remove(item);
//       }
//     });

//     // Add new selected animation
//     SelectedAnimation({ current: fabricCanvas }, annotatonPoints, segName, color);
//   }, [updateSelectedSegment, segments]);

//   useEffect(() => {
//     const fabricCanvas = canavasImageRef.current?.getFabricCanvas?.();
//     if (isResetZoom && fabricCanvas && originalViewportTransform.current) {
//       dispatch(setIsResetZoom(false));
//       // Reset to original viewport transform
//       fabricCanvas.setViewportTransform(originalViewportTransform.current);
//       fabricCanvas.setZoom(1);
//       fabricCanvas.requestRenderAll();
//       dispatch(setZoom(1));
//       toast.success("Canvas reset to original state");
//     }
//   }, [isResetZoom]);

//   // cut out section

//   useEffect(() => {
//     const fabricCanvas = canavasImageRef.current?.getFabricCanvas?.();
//     if (!fabricCanvas) return;
//     const fabricRef = { current: fabricCanvas };
//     const canvas = fabricCanvas;
//     const objects = canvas.getObjects();
//     const scalex = canvas.width / aiTrainImageWidth;
//     const scaley = canvas.height / aiTrainImageHeight;
//     if (isPolygonUpdate.current && allSegArray && allSegArray.length > 0) {
//       const getWallSegment = allSegArray.filter(
//         (seg) => seg.segment_type === "Wall"
//       );
//       if (getWallSegment.length > 0) {
//         // Do something with wall segments
//         getWallSegment.map((item) => {
//           const getAllPolyName = getContainedPolygonNamesByBoundingBox(
//             fabricRef,
//             item?.short_title ?? ""
//           );
//           console.log("getAllPolyName", getAllPolyName);
//           if (getAllPolyName.length > 0) {
//             const allTrimPoly = getAllPolyName.filter(
//               (polyName) =>
//                 polyName.startsWith("WI") || polyName.startsWith("TR")
//             );
//             const color = segments.find(
//                 (s: { name: string; color_code: string }) =>
//                   s.name === item.segment_type
//               )?.color_code || "#FE0056";
//             if (allTrimPoly.length > 0) {
//               getCutOutArea(
//                 fabricRef,
//                 item.annotation_points_float || [],
//                 item.short_title || "",
//                 item.short_title || "",
//                 item.segment_type || "",
//                 item.group_label_system || "",
//                 item.segment_bb_float || [],
//                 color,
//                 scalex,
//                 scaley,
//                 allTrimPoly,
//                 allSegArray
//               );
//             }
//           }
//         });
//       }
//     }
//   }, [allSegArray, isPolygonUpdate]);

//   const handleImageLoad = React.useCallback(() => {
//     setIsImageLoading(false);
//   }, []);

//   return (
//     <>
//       {/* <CanavasImage
//         imageUrl={imageUrl}
//         width={width}
//         height={height}
//         onImageLoad={handleImageLoad}
//         ref={canavasImageRef}
//          onMouseMove={handleMouseMove}
//       /> */}
//     </>
//   );
// };

// export default PolygonOverlay;
