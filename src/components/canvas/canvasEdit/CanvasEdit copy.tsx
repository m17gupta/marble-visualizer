// import { AppDispatch, RootState } from "@/redux/store";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import * as fabric from "fabric";
// import { toast } from "sonner";
// import {
//   AddImageToCanvas,
//   LoadImageWithCORS,
//   LoadImageWithFetch,
//   setBackgroundImage,
// } from "@/components/canvasUtil/canvasImageUtils";
// import { setCanvasReady, setCanvasType } from "@/redux/slices/canvasSlice";
// import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { motion, AnimatePresence } from "framer-motion";
// import { Card, CardContent } from "@/components/ui/card";
// import { cn } from "@/lib/utils";

// import { getMinMaxBBPoint } from "@/components/canvasUtil/GetMInMaxBBPoint";
// import {
//   changeGroupSegment,
//   updateAddSegMessage,
//   updateSegmentById,
// } from "@/redux/slices/segmentsSlice";
// import { addNewSegmentToMasterArray } from "@/redux/slices/MasterArraySlice";

// import CommonToolBar from "../CommonToolBar";

// export interface PointModel {
//   x: number;
//   y: number;
// }

// interface CanvasEditProps {
//   imageUrl?: string;
//   width?: number;
//   height?: number;
//   className?: string;
//   onImageLoad?: () => void;
// }

// const CanvasEdit: React.FC<CanvasEditProps> = ({
//   imageUrl,
//   width,
//   height,
//   className,
//   onImageLoad,
// }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { isCanvasReady } = useSelector((state: RootState) => state.canvas);
//   const { selectedSegment } = useSelector(
//     (state: RootState) => state.masterArray
//   );
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
//   const backgroundImageRef = useRef<fabric.Image | null>(null);
//   const originalViewportTransform = useRef<fabric.TMat2D | null>(null);
//   const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
//   const { aiTrainImageWidth, aiTrainImageHeight } = useSelector(
//     (state: RootState) => state.canvas
//   );

//   // For dragging a polygon point
//   const [dragInfo, setDragInfo] = useState<{
//     poly?: fabric.Polygon;
//     pointIdx?: number;
//   } | null>(null);

//   // -- Place these BEFORE your component declaration --

//   function getObjectSizeWithStroke(object: fabric.Object): fabric.Point {
//     const scaleX = object.scaleX || 1;
//     const scaleY = object.scaleY || 1;
//     const strokeWidth = object.strokeWidth || 0;
//     const stroke = new fabric.Point(
//       object.strokeUniform ? strokeWidth / scaleX : strokeWidth,
//       object.strokeUniform ? strokeWidth / scaleY : strokeWidth
//     );
//     return new fabric.Point(
//       (object.width || 0) * scaleX + stroke.x,
//       (object.height || 0) * scaleY + stroke.y
//     );
//   }

//   const polygonPositionHandler = function (
//     this: { pointIndex: number },
//     dim: fabric.Point,
//     finalMatrix: fabric.TMat2D,
//     fabricObject: fabric.Polygon,
//     _currentControl: fabric.Control
//   ): fabric.Point {
//     const point = fabricObject.points?.[this.pointIndex];
//     if (!point) return new fabric.Point(0, 0);
//     const x = point.x - (fabricObject.pathOffset?.x ?? 0);
//     const y = point.y - (fabricObject.pathOffset?.y ?? 0);
//     return fabric.util.transformPoint(
//       new fabric.Point(x, y),
//       fabric.util.multiplyTransformMatrices(
//         fabricObject.canvas?.viewportTransform ?? [1, 0, 0, 1, 0, 0],
//         fabricObject.calcTransformMatrix()
//       )
//     );
//   };

//   const anchorWrapper = useCallback(
//     (
//       anchorIndex: number,
//       fn: (
//         eventData: fabric.TPointerEvent,
//         transform: fabric.Transform,
//         x: number,
//         y: number
//       ) => boolean,
//       canvas: fabric.Canvas
//     ) => {
//       return function (
//         eventData: fabric.TPointerEvent,
//         transform: fabric.Transform,
//         x: number,
//         y: number
//       ) {
//         const fabricObject = transform.target as fabric.Polygon;
//         if (
//           fabricObject &&
//           fabricObject.points &&
//           fabricObject.points[anchorIndex]
//         ) {
//           // Convert global (x, y) to local polygon coordinates
//           const mouseLocalPosition = fabric.util.transformPoint(
//             new fabric.Point(x, y),
//             fabric.util.invertTransform(fabricObject.calcTransformMatrix())
//           );
//           const polygonBaseSize = getObjectSizeWithStroke(fabricObject);
//           const size = fabricObject._getTransformedDimensions();
//           const finalPointPosition = new fabric.Point(
//             (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
//               (fabricObject.pathOffset?.x ?? 0),
//             (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
//               (fabricObject.pathOffset?.y ?? 0)
//           );
//           fabricObject.points[anchorIndex] = finalPointPosition;
//           fabricObject.setCoords();
//           canvas.requestRenderAll();
//           // Optional: fix jumpy behavior
//           fabricObject.left = fabricObject.left ?? 0;
//           fabricObject.top = fabricObject.top ?? 0;
//           return fn(eventData, transform, x, y);
//         }
//         return false;
//       };
//     },
//     []
//   );

//   const actionHandlers = function (
//     _eventData: fabric.TPointerEvent,
//     _transform: fabric.Transform,
//     _x: number,
//     _y: number
//   ): boolean {
//     return true; // You can set more conditions here if needed
//   };

//   useEffect(() => {
//     if (!canvasRef.current || fabricCanvasRef.current) return;
//     const canvas = new fabric.Canvas(canvasRef.current, {
//       width,
//       height,
//       backgroundColor: "#f8f9fa",
//       selection: true,
//       preserveObjectStacking: true,
//     });
//     fabricCanvasRef.current = canvas;
//     originalViewportTransform.current =
//       canvas.viewportTransform && [...canvas.viewportTransform].length === 6
//         ? ([...canvas.viewportTransform] as fabric.TMat2D)
//         : [1, 0, 0, 1, 0, 0];

//     // --- Mouse events for dragging annotation points ---
//     const handleMouseDown = (opt: fabric.TPointerEventInfo) => {
//       const pointer = opt.pointer;
//       const polygons = canvas.getObjects("polygon") as fabric.Polygon[];
//       for (const poly of polygons) {
//         if (!poly.visible) continue;
//         if (!poly.points) continue;
//         // Check proximity to points
//         for (let i = 0; i < poly.points.length; i++) {
//           const pt = poly.points[i];
//           const polyX = poly.left! + pt.x * (poly.scaleX || 1);
//           const polyY = poly.top! + pt.y * (poly.scaleY || 1);
//           if (
//             Math.abs(pointer.x - polyX) < 10 &&
//             Math.abs(pointer.y - polyY) < 10
//           ) {
//             setDragInfo({ poly, pointIdx: i });
//             return;
//           }
//         }
//       }
//       setDragInfo(null);
//     };

//     // --- Double click event for point deletion and insertion ---
//     const handleDoubleClick = (opt: fabric.TPointerEventInfo) => {
//       const pointer = opt.pointer;
//       const polygons = canvas.getObjects("polygon") as fabric.Polygon[];

//       for (const poly of polygons) {
//         if (!poly.visible || !poly.points) continue;

//         // Check if double-clicking on an existing point (delete point)
//         for (let i = 0; i < poly.points.length; i++) {
//           const pt = poly.points[i];
//           const polyX = poly.left! + pt.x * (poly.scaleX || 1);
//           const polyY = poly.top! + pt.y * (poly.scaleY || 1);

//           if (
//             Math.abs(pointer.x - polyX) < 10 &&
//             Math.abs(pointer.y - polyY) < 10
//           ) {
//             // Delete point if polygon has more than 3 points
//             if (poly.points.length > 3) {
//               poly.points.splice(i, 1);
//               recreatePolygonWithControls(poly, canvas);
//               canvas.requestRenderAll();
//               toast.success("Point deleted successfully");
//             } else {
//               toast.error(
//                 "Cannot delete point. Polygon must have at least 3 points."
//               );
//             }
//             return;
//           }
//         }

//         // Check if double-clicking on polygon edge (add point between two existing points)
//         for (let i = 0; i < poly.points.length; i++) {
//           const currentPt = poly.points[i];
//           const nextPt = poly.points[(i + 1) % poly.points.length];

//           const currentX = poly.left! + currentPt.x * (poly.scaleX || 1);
//           const currentY = poly.top! + currentPt.y * (poly.scaleY || 1);
//           const nextX = poly.left! + nextPt.x * (poly.scaleX || 1);
//           const nextY = poly.top! + nextPt.y * (poly.scaleY || 1);

//           // Calculate distance from pointer to line segment
//           const distance = getDistanceToLineSegment(
//             pointer.x,
//             pointer.y,
//             currentX,
//             currentY,
//             nextX,
//             nextY
//           );

//           if (distance < 8) {
//             // 8px tolerance for edge detection
//             // Convert pointer coordinates to local polygon coordinates
//             const localX = (pointer.x - poly.left!) / (poly.scaleX || 1);
//             const localY = (pointer.y - poly.top!) / (poly.scaleY || 1);

//             // Insert new point after current point
//             poly.points.splice(i + 1, 0, new fabric.Point(localX, localY));
//             recreatePolygonWithControls(poly, canvas);
//             canvas.requestRenderAll();
//             toast.success("Point added successfully");
//             return;
//           }
//         }
//       }
//     };

//     // Helper function to calculate distance from point to line segment
//     const getDistanceToLineSegment = (
//       px: number,
//       py: number,
//       x1: number,
//       y1: number,
//       x2: number,
//       y2: number
//     ): number => {
//       const A = px - x1;
//       const B = py - y1;
//       const C = x2 - x1;
//       const D = y2 - y1;

//       const dot = A * C + B * D;
//       const lenSq = C * C + D * D;
//       let param = -1;
//       if (lenSq !== 0) {
//         param = dot / lenSq;
//       }

//       let xx, yy;
//       if (param < 0) {
//         xx = x1;
//         yy = y1;
//       } else if (param > 1) {
//         xx = x2;
//         yy = y2;
//       } else {
//         xx = x1 + param * C;
//         yy = y1 + param * D;
//       }

//       const dx = px - xx;
//       const dy = py - yy;
//       return Math.sqrt(dx * dx + dy * dy);
//     };

//     // Helper function to recreate polygon with updated controls
//     const recreatePolygonWithControls = (
//       oldPoly: fabric.Polygon,
//       canvas: fabric.Canvas
//     ) => {
//       if (!oldPoly.points) return;

//       // Create new polygon with updated points
//       const newPolygon = new fabric.Polygon(oldPoly.points, {
//         left: oldPoly.left,
//         top: oldPoly.top,
//         fill: oldPoly.fill,
//         strokeWidth: oldPoly.strokeWidth,
//         stroke: oldPoly.stroke,
//         scaleX: oldPoly.scaleX,
//         scaleY: oldPoly.scaleY,
//         objectCaching: false,
//         transparentCorners: false,
//         selectable: false,
//         hasControls: true,
//         hasBorders: false,
//         cornerStyle: "circle",
//         cornerColor: "rgb(255 1 154)",
//         cornerSize: 7,
//         cornerStrokeColor: "rgb(7 239 253)",
//       }) as fabric.Polygon;

//       // Attach per-point controls for the new polygon
//       newPolygon.controls = {
//         ...newPolygon.points?.reduce((acc, _point, index) => {
//           const controlKey = `p${index}`;
//           acc[controlKey] = new fabric.Control({
//             cursorStyle: "pointer",
//             positionHandler: polygonPositionHandler.bind({ pointIndex: index }),
//             actionHandler: anchorWrapper(index, actionHandlers, canvas).bind({
//               pointIndex: index,
//             }),
//             actionName: "modifyPolygon",
//           });
//           return acc;
//         }, {} as { [key: string]: fabric.Control }),
//       };

//       // Remove old polygon and add new one
//       canvas.remove(oldPoly);
//       canvas.add(newPolygon);
//       canvas.setActiveObject(newPolygon);
//     };

//     const handleMouseMove = (opt: fabric.TPointerEventInfo) => {
//       if (!dragInfo?.poly || dragInfo.pointIdx == null) return;
//       const pointer = opt.pointer;
//       const poly = dragInfo.poly;
//       const px = (pointer.x - poly.left!) / (poly.scaleX || 1);
//       const py = (pointer.y - poly.top!) / (poly.scaleY || 1);
//       poly.points![dragInfo.pointIdx] = new fabric.Point(px, py);
//       poly.setCoords();
//       canvas.requestRenderAll();

//       const pol = canvas.getActiveObject() as fabric.Polygon | null;
//       if (pol && pol.points) {
//         const updatedPoints = pol.points.map((pt) => ({ x: pt.x, y: pt.y }));
//       }
//     };
//     const handleMouseUp = () => setDragInfo(null);

//     canvas.on("mouse:down", handleMouseDown);
//     canvas.on("mouse:move", handleMouseMove);
//     canvas.on("mouse:up", handleMouseUp);
//     canvas.on("mouse:dblclick", handleDoubleClick);

//     dispatch(setCanvasReady(true));
//     return () => {
//       canvas.off("mouse:down", handleMouseDown);
//       canvas.off("mouse:move", handleMouseMove);
//       canvas.off("mouse:up", handleMouseUp);
//       canvas.off("mouse:dblclick", handleDoubleClick);
//       canvas.dispose();
//       fabricCanvasRef.current = null;
//       backgroundImageRef.current = null;
//     };
//   }, [width, height, dispatch, dragInfo, anchorWrapper]);

//   // Load background image
//   useEffect(() => {
//     if (!fabricCanvasRef.current || !isCanvasReady || !imageUrl) {
//       return;
//     }

//     const canvas = fabricCanvasRef.current;

//     //Remove existing background image (ensure full cleanup)
//     if (backgroundImageRef.current) {
//       canvas.remove(backgroundImageRef.current);
//       backgroundImageRef.current = null;
//       canvas.discardActiveObject();
//       canvas.renderAll();
//     }

//     const tryLoadImage = async () => {
//       setIsImageLoading(true); // Start loading indicator

//       // Strategy 1: Try different CORS modes
//       const corsOptions: (string | null)[] = ["anonymous", "use-credentials"];
//       for (const corsMode of corsOptions) {
//         try {
//           const imgElement = await LoadImageWithCORS(imageUrl, corsMode);
//           // setImageWidth(imgElement.width);
//           // setImageHeight(imgElement.height);
//           setBackgroundImage(
//             fabricCanvasRef,
//             imageUrl,
//             backgroundImageRef,
//             (loading: boolean) => {
//               setIsImageLoading(loading);
//               if (!loading && onImageLoad) {
//                 onImageLoad();
//               }
//             }
//           );
//           return;
//         } catch (error) {
//           console.warn(`Failed to load with CORS mode: ${corsMode}`, error);
//         }
//       }

//       // Strategy 2: Try different fetch modes
//       const fetchModes: RequestMode[] = ["cors", "no-cors", "same-origin"];
//       for (const fetchMode of fetchModes) {
//         try {
//           const imgElement = await LoadImageWithFetch(imageUrl, fetchMode);
//           // setImageWidth(imgElement.width);
//           // setImageHeight(imgElement.height);
//           setBackgroundImage(
//             fabricCanvasRef,
//             imageUrl,
//             backgroundImageRef,
//             (loading: boolean) => {
//               setIsImageLoading(loading);
//               if (!loading && onImageLoad) {
//                 onImageLoad();
//               }
//             }
//           );
//           return;
//         } catch (error) {
//           console.warn(`Failed to load with fetch mode: ${fetchMode}`, error);
//         }
//       }

//       // All strategies failed
//       setIsImageLoading(false); // Stop loading indicator on failure
//       console.error("All image loading strategies failed for URL:", imageUrl);
//       const errorMessage = imageUrl.includes("s3.")
//         ? "Failed to load S3 image due to CORS restrictions. Please configure your S3 bucket CORS policy to allow requests from your domain."
//         : "Failed to load background image. The image server may not allow cross-origin requests.";

//       toast.error(errorMessage, {
//         duration: 6000,
//         description: "Check browser console for detailed error information.",
//       });

//       if (onImageLoad) {
//         onImageLoad();
//       }
//     };

//     tryLoadImage();
//   }, [imageUrl, isCanvasReady, width, height, onImageLoad]);

//   // Create the polygon with annotation points
//   useEffect(() => {
//     const canvas = fabricCanvasRef.current;
//     if (!canvas) return;
//     canvas.getObjects("polygon").forEach((obj) => canvas.remove(obj));

//     if (
//       selectedSegment &&
//       selectedSegment.annotation_points_float &&
//       selectedSegment.annotation_points_float.length > 0 &&
//       selectedSegment.segment_bb_float &&
//       selectedSegment.segment_bb_float.length > 0 &&
//       selectedSegment.short_title
//     ) {
//       const { width: canvasWidth, height: canvasHeight } = canvas;
//       const ratioWidth = canvasWidth / aiTrainImageWidth;
//       const ratioHeight = canvasHeight / aiTrainImageHeight;
//       const points: PointModel[] = [];
//       for (
//         let i = 0;
//         i < selectedSegment.annotation_points_float.length;
//         i += 2
//       ) {
//         points.push({
//           x: selectedSegment.annotation_points_float[i] * ratioWidth,
//           y: selectedSegment.annotation_points_float[i + 1] * ratioHeight,
//         });
//       }

//       // Make editable polygon
//       const polygon = new fabric.Polygon(points, {
//         left: selectedSegment.segment_bb_float[0] * ratioWidth,
//         top: selectedSegment.segment_bb_float[1] * ratioHeight,
//         fill: "transparent",
//         strokeWidth: 2,
//         stroke: "rgb(7 239 253)",
//         scaleX: 1,
//         scaleY: 1,
//         objectCaching: false,
//         transparentCorners: false,
//         selectable: false,
//         hasControls: true,
//         hasBorders: false,
//         cornerStyle: "circle",
//         cornerColor: "rgb(255 1 154)",
//         cornerSize: 7,
//         cornerStrokeColor: "rgb(7 239 253)",
//       }) as fabric.Polygon;

//       // Attach per-point controls
//       polygon.controls = {
//         ...polygon.points?.reduce((acc, _point, index) => {
//           const controlKey = `p${index}`;
//           acc[controlKey] = new fabric.Control({
//             cursorStyle: "pointer",
//             positionHandler: polygonPositionHandler.bind({ pointIndex: index }),
//             actionHandler: anchorWrapper(index, actionHandlers, canvas).bind({
//               pointIndex: index,
//             }),
//             actionName: "modifyPolygon",
//           });
//           return acc;
//         }, {} as { [key: string]: fabric.Control }),
//       };

//       canvas.add(polygon);
//       canvas.setActiveObject(polygon);
//       canvas.requestRenderAll();
//     }
//   }, [selectedSegment, anchorWrapper]);

//   const handleResetCanvas = () => {
//     const canvas = fabricCanvasRef.current;
//     if (canvas) {
//       canvas.clear();
//       const tempObjects = canvas
//         .getObjects()
//         .filter(
//           (obj) =>
//             (obj as fabric.Object & { data?: { type?: string } }).data?.type ===
//               "temp-line" ||
//             (obj as fabric.Object & { data?: { type?: string } }).data?.type ===
//               "preview-line" ||
//             (obj as fabric.Object & { data?: { type?: string } }).data?.type ===
//               "temp-point"
//         );
//       tempObjects.forEach((obj) => canvas.remove(obj));
//       canvas.renderAll();
//     }
//   };

//   const handleSaveAnnotation = () => {
//     const canvas = fabricCanvasRef.current;
//     if (canvas) {
//           const ratioWidth = aiTrainImageWidth / (canvas.width);
//     const ratioHeight = aiTrainImageHeight / (canvas.height);
//       const poly = canvas.getActiveObject() as fabric.Polygon | null;
//       if (poly && poly.points) {
//         const updatedPoints = poly.points.map((pt) => ({ x: pt.x*ratioWidth, y: pt.y*ratioHeight }));
//         const polygonNumberArray = updatedPoints.flatMap((point) => [
//           Number(point.x.toFixed(2)),
//           Number(point.y.toFixed(2)),
//         ]);
//         const getMinMax = getMinMaxBBPoint(polygonNumberArray);

//         const data: SegmentModal = {
//           id: selectedSegment?.id || 0,
//           job_id: selectedSegment?.job_id || 0,
//           title: selectedSegment?.title || "",
//           short_title: selectedSegment?.short_title || "",
//           group_name_user: selectedSegment?.group_name_user || "",
//           group_desc: selectedSegment?.group_desc || "",
//           segment_type: selectedSegment?.segment_type || "",
//           annotation_points_float: polygonNumberArray,
//           segment_bb_float: getMinMax,
//           annotation_type: selectedSegment?.annotation_type || "",
//           seg_perimeter: selectedSegment?.seg_perimeter || 0,
//           seg_area_sqmt: selectedSegment?.seg_area_sqmt || 0,
//           seg_skewx: selectedSegment?.seg_skewx || 0,
//           seg_skewy: selectedSegment?.seg_skewy || 0,
//           created_at: selectedSegment?.created_at || new Date().toISOString(),
//           updated_at: new Date().toISOString(),
//           group_label_system: selectedSegment?.group_label_system || "",
//         };
//         updateSegment(data);
//       }
//     }
//   };

//   const updateSegment = async (segData: SegmentModal) => {
//     try {
//       const response = await dispatch(updateSegmentById(segData)).unwrap();
//       dispatch(updateAddSegMessage(" Updating segment details..."));
//       if (response && response.success) {
//         // update into master Array
//         dispatch(updateAddSegMessage(null));
//         handleResetCanvas();
//         // update all Segments Array
//         dispatch(changeGroupSegment(segData));
//         // update master array
//         dispatch(addNewSegmentToMasterArray(segData));
//         dispatch(updateAddSegMessage(null));
//         dispatch(setCanvasType("hover"));
//       }
//     } catch (error) {
//       console.error("Error updating segment:", error);
//       toast.error("Failed to update segment.");
//     }
//   };


//   const handleCancelAnnotation  =()=>{
//     dispatch(setCanvasType("hover"))
//   }
//   return (
//     <TooltipProvider>
//       <div className={cn("flex flex-col space-y-4", className)}>
//         <CommonToolBar
//           title={"Edit Annotation"}
//           onSaveAnnotation={handleSaveAnnotation}
//           onCancel={handleCancelAnnotation}
//         />
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="relative px-4"
//         >
//           <Card className="overflow-hidden">
//             <CardContent className="p-0">
//               <div className="relative bg-gray-50 flex items-center justify-center min-h-[600px] min-w-[800px]">
//                 <canvas
//                   ref={canvasRef}
//                   className="border-0 block"
//                   style={{ maxWidth: "100%", height: "auto" }}
//                 />
//                 {!isCanvasReady && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
//                     <div className="text-center">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
//                       <p className="text-sm text-muted-foreground">
//                         Initializing canvas...
//                       </p>
//                     </div>
//                   </div>
//                 )}
//                 <AnimatePresence></AnimatePresence>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </TooltipProvider>
//   );
// };

// export default CanvasEdit;
