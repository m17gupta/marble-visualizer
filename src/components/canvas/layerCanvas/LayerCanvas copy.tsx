// import * as fabric from "fabric";
// import {
//   AddImageToCanvas,
//   LoadImageWithCORS,
//   LoadImageWithFetch,
// } from "@/components/canvasUtil/canvasImageUtils";
// import { setCanvasReady, setZoom } from "@/redux/slices/canvasSlice";
// import { AppDispatch, RootState } from "@/redux/store";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
// import {
//   handlePolygonVisibilityOnMouseMove,
//   HideAllSegments,
// } from "@/components/canvasUtil/HoverSegment";
// import { toast } from "sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { AnimatePresence, motion } from "framer-motion";
// import { cn } from "@/lib/utils";
// import { Card, CardContent } from "@/components/ui/card";
// import { PointModel } from "../canvasEdit/CanvasEdit";
// import { setBackgroundImage } from "./SetBackGroundImage";

// type NamedFabricObject = fabric.Object & { name?: string };

// interface CanvasTestLayerProps {
//   imageUrl?: string;
//   width?: number;
//   height?: number;
//   className?: string;
//   onImageLoad?: () => void;
// }
// const LayerCanvas = ({
//   imageUrl,
//   width = 800,
//   height = 600,
//   className,
//   onImageLoad,
// }: CanvasTestLayerProps) => {
//   const dispatch = useDispatch<AppDispatch>();

//   const { isCanvasReady } = useSelector((state: RootState) => state.canvas);

//   const [allSegArray, setAllSegArray] = useState<SegmentModal[]>([]);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
//   const backgroundImageRef = useRef<fabric.Image | null>(null);
//   const originalViewportTransform = useRef<fabric.TMat2D | null>(null);
//   const { segments } = useSelector(
//     (state: RootState) => state.materialSegments
//   );

//   const { allPolygon } = useSelector(
//     (state: RootState) => state.testCanvas
//   );
//   const handleMouseMove = useCallback((event: fabric.TEvent) => {
//     if (!fabricCanvasRef.current) return;
//     const canvas = fabricCanvasRef.current;
//     console.log("canavvsss",canvas)
//     console.log("canvas", canvas.getObjects());
//     const fabricEvent = event as unknown as { target?: NamedFabricObject };
//     const target = fabricEvent.target;
//     console.log("target", target?.name);
//     if (target !== undefined) {
//       const targetName = target.name;
//       if (targetName) {
//         handlePolygonVisibilityOnMouseMove(fabricCanvasRef, targetName);
//       }
//     } else {
//       HideAllSegments(fabricCanvasRef);
//     }
//   }, []);

//     const [loading, setLoading] = useState(false);


//   useEffect(() => {
//   if (!canvasRef.current || fabricCanvasRef.current||!imageUrl) return;

//   const canvas = new fabric.Canvas(canvasRef.current, {
//     selection: true,
//     preserveObjectStacking: true,
   
//   });

//   fabricCanvasRef.current = canvas;

//   originalViewportTransform.current = canvas.viewportTransform
//     ? ([...canvas.viewportTransform] as fabric.TMat2D)
//     : null;

//   // Load background image (800x600)
//   setBackgroundImage(
//     canvas,
//     imageUrl,
//     setLoading
//   );

//   canvas.on("mouse:move", handleMouseMove);
//   canvas.on("mouse:wheel", () => {
//     dispatch(setZoom(canvas.getZoom()));
//   });

//   dispatch(setCanvasReady(true));

//   return () => {
//     canvas.dispose();
//     fabricCanvasRef.current = null;
//     backgroundImageRef.current = null;
//     dispatch(setCanvasReady(false));
//   };
// }, [width, height, imageUrl, dispatch, handleMouseMove]);


//   // Initialize Fabric.js canvas
//   // useEffect(() => {
//   //   if (!canvasRef.current || fabricCanvasRef.current) return;

//   //   const canvas = new fabric.Canvas(canvasRef.current, {
//   //     width: 800,
//   //     height: 600,
//   //     selection: true,
//   //     preserveObjectStacking: true,
//   //     backgroundColor: "#282828",
//   //   });

//   //   fabricCanvasRef.current = canvas;

//   //   // Store the original viewport transform
//   //   originalViewportTransform.current = canvas.viewportTransform
//   //     ? ([...canvas.viewportTransform] as fabric.TMat2D)
//   //     : null;

//   //   // Canvas event handlers
//   //   // canvas.on("mouse:down", handleMouseDown);
//   //   canvas.on("mouse:move", (event) => {
//   //     handleMouseMove(event);
//   //   });
//   //    canvas.on("mouse:move", (event) => {
//   //     handleMouseMove(event);
//   //   });
//   //   // canvas.on("mouse:dblclick", handleDoubleClick);

//   //   // canvas.on("selection:cleared", () => {

//   //   // });

//   //   canvas.on("mouse:wheel", (event) => {
//   //     //  handleMouseWheel(event);
//   //     dispatch(setZoom(canvas.getZoom()));
//   //   });

//   //   // Keyboard shortcuts
//   //   // document.addEventListener("keydown", handleKeyDown);

//   //   dispatch(setCanvasReady(true));

//   //   return () => {
//   //     canvas.dispose();
//   //     fabricCanvasRef.current = null;
//   //     backgroundImageRef.current = null;
//   //     dispatch(setCanvasReady(false));
//   //   };
//   // }, [width, height, dispatch, handleMouseMove]);


  
  
//   // Load background image with comprehensive CORS and fallback handling
//   // useEffect(() => {
//   //   if (!fabricCanvasRef.current || !isCanvasReady || !imageUrl) {
//   //     return;
//   //   }

//   //   const canvas = fabricCanvasRef.current;

//   //   // Remove existing background image (ensure full cleanup)
//   //   if (backgroundImageRef.current) {
//   //     canvas.remove(backgroundImageRef.current);
//   //     backgroundImageRef.current = null;
//   //     canvas.discardActiveObject();
//   //     canvas.renderAll();
//   //   }

//   //   const tryLoadImage = async () => {
//   //     // Strategy 1: Try different CORS modes
//   //     const corsOptions: (string | null)[] = ["anonymous", "use-credentials"];
//   //     for (const corsMode of corsOptions) {
//   //       try {
//   //         const imgElement = await LoadImageWithCORS(imageUrl, corsMode);

//   //         AddImageToCanvas(
//   //           imgElement,
//   //           fabricCanvasRef,
//   //           width,
//   //           height,
//   //           backgroundImageRef,
//   //           onImageLoad
//   //         );
//   //         return;
//   //       } catch (error) {
//   //         console.warn(`Failed to load with CORS mode: ${corsMode}`, error);
//   //       }
//   //     }

//   //     // Strategy 2: Try different fetch modes
//   //     const fetchModes: RequestMode[] = ["cors", "no-cors", "same-origin"];
//   //     for (const fetchMode of fetchModes) {
//   //       try {
//   //         const imgElement = await LoadImageWithFetch(imageUrl, fetchMode);

//   //         AddImageToCanvas(
//   //           imgElement,
//   //           fabricCanvasRef,
//   //           width,
//   //           height,
//   //           backgroundImageRef,
//   //           onImageLoad
//   //         );
//   //         return;
//   //       } catch (error) {
//   //         console.warn(`Failed to load with fetch mode: ${fetchMode}`, error);
//   //       }
//   //     }

//   //     // All strategies failed
//   //     console.error("All image loading strategies failed for URL:", imageUrl);
//   //     const errorMessage = imageUrl.includes("s3.")
//   //       ? "Failed to load S3 image due to CORS restrictions. Please configure your S3 bucket CORS policy to allow requests from your domain."
//   //       : "Failed to load background image. The image server may not allow cross-origin requests.";

//   //     toast.error(errorMessage, {
//   //       duration: 6000,
//   //       description: "Check browser console for detailed error information.",
//   //     });

//   //     if (onImageLoad) {
//   //       onImageLoad();
//   //     }
//   //   };

//   //   tryLoadImage();
//   // }, [imageUrl, isCanvasReady, width, height, onImageLoad]);



//   useEffect(() => {
//     console.log("annotation", allPolygon);

//     if (fabricCanvasRef.current && allPolygon.length > 0 && backgroundImageRef.current) {
//       allPolygon.forEach((polygon, index) => {
//         createPolygon(polygon.annotation, polygon.box, index);
//       });
//       // If there are polygons, ensure they are visible
//       fabricCanvasRef.current.getObjects().forEach((obj) => {
//         if (obj.type === "polygon") {
//           obj.set({ visible: true });
//         }
//       });
//       fabricCanvasRef.current.renderAll();
//     } else if (fabricCanvasRef.current&&allPolygon.length === 0) {
//       // remove existing polygon if annotation is empty
//       const existingPolygon = fabricCanvasRef.current.getObjects().find(
//         (obj) => obj.type === "polygon"
//       );
//       if (existingPolygon) {
//         fabricCanvasRef.current.remove(existingPolygon);
//         fabricCanvasRef.current.renderAll();
//       }
//     }
//   }, [fabricCanvasRef, allPolygon, dispatch, backgroundImageRef]);


//   const createPolygon =(annotation:number[],box:number[],index:number)=>{
//  const canvas = fabricCanvasRef.current;
//  const bgImg = backgroundImageRef.current;
// const scaleX = bgImg?.scaleX ?? 1;
// const scaleY = bgImg?.scaleY ?? 1;
// const left = bgImg?.left ?? 0;
// const top = bgImg?.top ?? 0;

//  if (!canvas) return;
//       const point: PointModel[] = [];
//       for (let i = 0; i < annotation.length; i += 2) {
//         const x = annotation[i]  + left;
//         const y = annotation[i + 1]  + top;
//         point.push({ x, y });
//       }

//       const polygon = new fabric.Polygon(point, {
//         fill: "green",
//         originX: box[0] + left,
//         originY: box[1] + top,
//         hasBorders: false,
//         hasControls: false,
//         stroke: "red",
//         strokeWidth: 2,
//         opacity: 0.4,
//         visible: true,
//         lockMovementX: true,
//         lockMovementY: true,
//       });
//       (polygon as NamedFabricObject).name = `segment-Test-${index}`;
//       canvas.add(polygon);
//       canvas.renderAll();
//   }
//   return (
//     <>
//       <TooltipProvider>
//         <div className={cn("flex flex-col space-y-4", className)}>
//           {/* Canvas Container */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.3 }}
//             className="relative px-4"
//           >
//             <Card className="overflow-hidden">
//               <CardContent className="p-0">
//                 <div className="relative bg-gray-50 flex items-center justify-center min-h-[600px] min-w-[800px]">
//                   <canvas
//                     ref={canvasRef}
//                     className="border- border-red-500 block mx-auto"
//                     style={{ maxWidth: "100%", height: "auto" }}
//                   />

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

// export default LayerCanvas;
