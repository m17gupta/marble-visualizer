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
// import { setCanvasReady } from "@/redux/slices/canvasSlice";
// import {
//   LoadImageWithCORS,
//   LoadImageWithFetch,
//   setBackgroundImage,
// } from "@/components/canvasUtil/canvasImageUtils";
// import { toast } from "sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { AnimatePresence, motion } from "framer-motion";
// import { Card, CardContent } from "@/components/ui/card";
// import { collectPoints } from "@/components/canvasUtil/CreatePolygon";

// type NamedFabricObject = fabric.Object & { name?: string };

// interface CanvasOutlinerLayerProps {
//   imageUrl?: string;
//   width: number;
//   height: number;
//   className?: string;
//   onImageLoad?: () => void;
// }
// const OutLineCanvas = ({
//   imageUrl,
//   width,
//   height,
//   className,
//   onImageLoad,
// }: CanvasOutlinerLayerProps) => {
//   const dispatch = useDispatch<AppDispatch>();

//   const { isCanvasReady } = useSelector((state: RootState) => state.canvas);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [allSegArray, setAllSegArray] = useState<SegmentModal[]>([]);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
//   const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
//   const backgroundImageRef = useRef<fabric.Image | null>(null);
//   const originalViewportTransform = useRef<fabric.TMat2D | null>(null);
//   const { segments } = useSelector(
//     (state: RootState) => state.materialSegments
//   );

//     const { allSegments: allSegmentArray } = useSelector(
//       (state: RootState) => state.segments
//     );
//   const { aiTrainImageWidth, aiTrainImageHeight } = useSelector(
//     (state: RootState) => state.canvas
//   );

//     // update all segment Array
//     useEffect(() => {
//       if (allSegmentArray && allSegmentArray.length > 0) {
//         setAllSegArray(allSegmentArray);
//       } else {
//         setAllSegArray([]);
//       }
//     }, [allSegmentArray]);

//   const handleMouseMove = useCallback(
//       (event: fabric.TEvent) => {
//         if (!fabricCanvasRef.current) return;
//         const canvas = fabricCanvasRef.current;
//         console.log("canvas", canvas.getObjects());
//         const fabricEvent = event as unknown as { target?: NamedFabricObject };
//         const target = fabricEvent.target;
//          console.log("target", target?.name);
//         // if (target !== undefined) {
//         //   const targetName = target.name;
//         //   if (targetName) {
//         //     handlePolygonVisibilityOnMouseMove(fabricCanvasRef, targetName);
//         //   }
//         // } else {
//         //   HideAllSegments(fabricCanvasRef);
//         // }
//       },
//       []
//     );
  

//   // Initialize Fabric.js canvas
//   useEffect(() => {
//     if (!canvasRef.current || fabricCanvasRef.current) return;

//     const canvas = new fabric.Canvas(canvasRef.current, {
//       width,
//       height,
//       selection: true,
//       preserveObjectStacking: true,
//       backgroundColor: "#282828",
//     });

//     fabricCanvasRef.current = canvas;

//     // Store the original viewport transform
//     originalViewportTransform.current = canvas.viewportTransform
//       ? ([...canvas.viewportTransform] as fabric.TMat2D)
//       : null;

//     canvas.on("mouse:move", (event) => {
//       handleMouseMove(event);
//     });
//     dispatch(setCanvasReady(true));

//     return () => {
//       canvas.dispose();
//       fabricCanvasRef.current = null;
//       backgroundImageRef.current = null;
//       dispatch(setCanvasReady(false));
//     };
//   }, [width, height, dispatch]);

//   // Load background image with comprehensive CORS and fallback handling
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

//   useEffect(() => {
//     const canvas = fabricCanvasRef.current;
//     console.log("allSegArray", allSegArray);
//     console.log("segments", segments);
//     console.log("fabricCanvasRef", fabricCanvasRef);
//     console.log("height", height);
//     console.log("width", width);
//     if (
//       allSegArray &&
//       allSegArray.length > 0 &&
//       segments &&
//       segments.length > 0 &&
//       height &&
//       width &&
//       canvas
//     ) {
//       console.log("Redrawing polygons on canvas");
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
//         if (!fabricCanvasRef.current) {
//           console.warn(
//             `[PolygonOverlay] fabricCanvasRef.current missing at segment ${idx}`
//           );
//           return;
//         }
//     console.log("outline e")
//         collectPoints(
//           annotation_points_float,
//           short_title,
//           segment_bb_float,
//           segment_type,
//           group_label_system,
//           segColor,
//           fabricCanvasRef, // Pass the actual Canvas instance, not the ref
//           isFill,
//           height,
//           width,
//           aiTrainImageWidth,
//           aiTrainImageHeight
//         );
//       });

//       canvas.renderAll();
//     }
//   }, [
//     allSegArray,
//     segments,
//     fabricCanvasRef,
//     height,
//     width,
//     aiTrainImageWidth,
//     aiTrainImageHeight,
//   ]);
//   return (
//     <>
//       <TooltipProvider>
//         <div className={cn("flex flex-col space-y-4 mt-4", className)}>
//           {/* Canvas Container */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.3 }}
//             className="relative px-4"
//             ref={containerRef}
//           >
            
//             <Card className="overflow-hidden">
//               <CardContent className="p-0">
              
//                 <div className="relative bg-gray-50 flex items-center justify-center">
//                   <canvas
//                     ref={canvasRef}
//                     className="border-0 block mx-auto w-full h-full"
//                     style={{ width: "100%", height: "100%", display: "block" }}
//                   />

//                   {/* Image Loading Overlay */}
//                   {isImageLoading && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 z-10">
//                       <div className="text-center">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
//                         <p className="text-sm text-muted-foreground">
//                           Loading background image...
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {/* Canvas Status */}
//                   {!isCanvasReady && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
//                       <div className="text-center">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
//                         <p className="text-sm text-muted-foreground">
//                           Initializing canvas...
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       </TooltipProvider>
//     </>
//   );
// };

// export default OutLineCanvas;
