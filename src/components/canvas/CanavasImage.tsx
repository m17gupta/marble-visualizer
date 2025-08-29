import { SegmentModal } from '@/models/jobSegmentsModal/JobSegmentModal';
import { AppDispatch, RootState } from '@/redux/store';
import React, { forwardRef, useCallback, useEffect, useRef, useState,useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as fabric from "fabric";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { collectPoints } from "../canvasUtil/CreatePolygon";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { setCanvasReady, setMousePosition } from '@/redux/slices/canvasSlice';
import { LoadImageWithCORS, LoadImageWithFetch, setBackgroundImage } from '../canvasUtil/canvasImageUtils';
import { toast } from 'sonner';
import { handlePolygonVisibilityTest, HideAllSegments } from '../canvasUtil/HoverSegment';
type NamedFabricObject = fabric.Object & { name?: string };

interface CanvasHoverLayerProps {
  imageUrl?: string;
  width: number;
  height: number;
  className?: string;
  onImageLoad?: () => void;
  onMouseMove?: (event: fabric.TEvent) => void;
}
const CanavasImage = forwardRef(({ imageUrl, width, height, className, onImageLoad, onMouseMove }: CanvasHoverLayerProps, ref) => {

      const dispatch = useDispatch<AppDispatch>();
    
      const { isCanvasReady } = useSelector((state: RootState) => state.canvas);
      const { allSegments: allSegmentArray } = useSelector(
        (state: RootState) => state.segments
      );
      const containerRef = useRef<HTMLDivElement>(null);
      const [allSegArray, setAllSegArray] = useState<SegmentModal[]>([]);
      const canvasRef = useRef<HTMLCanvasElement>(null);
      const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
      const backgroundImageRef = useRef<fabric.Image | null>(null);
      const originalViewportTransform = useRef<fabric.TMat2D | null>(null);
      const { segments } = useSelector(
        (state: RootState) => state.materialSegments
      );
        const { hoverGroup } = useSelector((state: RootState) => state.canvas);
    
      const { aiTrainImageWidth, aiTrainImageHeight } = useSelector(
        (state: RootState) => state.canvas
      );
    
      const [imageWidth, setImageWidth] = useState<number>(0);
      const [imageHeight, setImageHeight] = useState<number>(0);
      const [updateSelectedSegment, setUpdateSelectedSegment] =
        useState<SegmentModal | null>(null);
      const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
      const { selectedSegment } = useSelector(
        (state: RootState) => state.masterArray
      );
      const { isResetZoom } = useSelector((state: RootState) => state.canvas);
       const {canvasType} = useSelector((state: RootState) => state.canvas);


       const [canvasMode, setCanvasMode] = useState<string>('hover');

       // update canvas Mode
       useEffect(() => {
         setCanvasMode(canvasType);
       }, [canvasType]);


      const handleMouseMove = useCallback((event: fabric.TEvent) => {
       
          if (canvasMode === 'hover') {
            const fabricCanvas = fabricCanvasRef.current;
             if (!fabricCanvas) return;
             const fabricRef = { current: fabricCanvas };
             const fabricEvent = event as unknown as { target?: NamedFabricObject };
             const target = fabricEvent.target;
             const pointer = fabricCanvas.getPointer(event.e);
             if (target !== undefined) {
               const targetName = target.name;
               if (targetName) {
                 const fabricPoint = new fabric.Point(pointer.x, pointer.y);
                 dispatch(setMousePosition({
                   x: Math.round(fabricPoint.x),
                   y: Math.round(fabricPoint.y),
                 }));
                 handlePolygonVisibilityTest(fabricRef, targetName, fabricPoint);
               }
             }
            }
       }, [canvasMode]);

        // Initialize Fabric.js canvas
        useEffect(() => {
          if (!canvasRef.current || fabricCanvasRef.current) return;
      
          const canvas = new fabric.Canvas(canvasRef.current, {
            width,
            height,
            selection: true,
            preserveObjectStacking: true,
            backgroundColor: "#282828",
          });
      
          fabricCanvasRef.current = canvas;
      
          // Store the original viewport transform
          originalViewportTransform.current = canvas.viewportTransform
            ? ([...canvas.viewportTransform] as fabric.TMat2D)
            : null;
      
          // resizeCanvas(canvas);
          // Canvas event handlers
          // canvas.on("mouse:down", handleMouseDown);
          canvas.on("mouse:move", (event) => {
            handleMouseMove(event);
          });
          // canvas.on("mouse:dblclick", handleDoubleClick);
      
          // canvas.on("selection:cleared", () => {
      
          // });
      
        //   canvas.on("mouse:wheel", (event) => {
        //     handleMouseWheel(event);
        //     dispatch(setZoom(canvas.getZoom()));
        //   });
      
          // Keyboard shortcuts
          // const handleKeyDown = (e: KeyboardEvent) => {
          //     if (e.ctrlKey || e.metaKey) {
          //         switch (
          //         e.key.toLowerCase() // Use toLowerCase to handle both uppercase and lowercase keys
          //         ) {
          //             case "c":
          //                 e.preventDefault();
          //                 if (activeSegment) {
          //                    // dispatch(copySegment(activeSegmentId));
          //                    // toast.success('Segment copied');
          //                 }
          //                 break;
          //             case "v":
          //                 e.preventDefault();
          //                 // if (copiedSegment) {
          //                 //   // dispatch(pasteSegment());
          //                 //   // toast.success('Segment pasted');
          //                 // }
          //                 break;
          //             case "z":
          //                 e.preventDefault();
          //                 if (e.shiftKey) {
          //                     handleRedo();
          //                 } else {
          //                     handleUndo();
          //                 }
          //                 break;
          //         }
          //     } else {
          //         switch (e.key) {
          //             case "Delete":
          //             case "Backspace":
          //                 if (activeSegment) {
          //                     handleDeleteSelected();
          //                 }
          //                 break;
          //             case "Escape":
          //                 if (isPolygonMode.current) {
          //                     // Fixed: Use isPolygonMode.current instead of isPolygonMode
          //                     handleCancelDrawing();
          //                 }
          //                 break;
          //         }
          //     }
          // };
      
          //document.addEventListener("keydown", handleKeyDown);
      
          dispatch(setCanvasReady(true));
      
          return () => {
            // document.removeEventListener("keydown", handleKeyDown);
      
            // Clean up auto-panning
            // cleanupAutoPan(autoPanIntervalRef, setIsAutoPanning);
      
            canvas.dispose();
            fabricCanvasRef.current = null;
            backgroundImageRef.current = null;
            dispatch(setCanvasReady(false));
          };
        }, [width, height, dispatch, handleMouseMove]);
      

         // Only update background image if imageUrl or canvasType changes
         useEffect(() => {
           // Add canvasType to the dependency array
           if (!fabricCanvasRef.current || !isCanvasReady || !imageUrl) {
             return;
           }

           const canvas = fabricCanvasRef.current;

           // Remove existing background image (ensure full cleanup)
          //  if (backgroundImageRef.current) {
          //    canvas.backgroundImage = undefined;
          //    backgroundImageRef.current = null;
          //    canvas.renderAll();
          //  }

           const tryLoadImage = async () => {
             setIsImageLoading(true); // Start loading indicator

             // Strategy 1: Try different CORS modes
             const corsOptions: (string | null)[] = ["anonymous", "use-credentials"];
             for (const corsMode of corsOptions) {
               try {
                 await LoadImageWithCORS(imageUrl, corsMode);
                 setBackgroundImage(
                   fabricCanvasRef,
                   imageUrl,
                   backgroundImageRef,
                   (loading: boolean) => {
                     setIsImageLoading(loading);
                     if (!loading && onImageLoad) {
                       onImageLoad();
                     }
                   }
                 );
                 return;
               } catch (error) {
                 console.warn(`Failed to load with CORS mode: ${corsMode}`, error);
               }
             }

             // Strategy 2: Try different fetch modes
             const fetchModes: RequestMode[] = ["cors", "no-cors", "same-origin"];
             for (const fetchMode of fetchModes) {
               try {
                 await LoadImageWithFetch(imageUrl, fetchMode);
                 setBackgroundImage(
                   fabricCanvasRef,
                   imageUrl,
                   backgroundImageRef,
                   (loading: boolean) => {
                     setIsImageLoading(loading);
                     if (!loading && onImageLoad) {
                       onImageLoad();
                     }
                   }
                 );
                 return;
               } catch (error) {
                 console.warn(`Failed to load with fetch mode: ${fetchMode}`, error);
               }
             }

             // All strategies failed
             setIsImageLoading(false); // Stop loading indicator on failure
             console.error("All image loading strategies failed for URL:", imageUrl);
             const errorMessage = imageUrl.includes("s3.")
               ? "Failed to load S3 image due to CORS restrictions. Please configure your S3 bucket CORS policy to allow requests from your domain."
               : "Failed to load background image. The image server may not allow cross-origin requests.";

             toast.error(errorMessage, {
               duration: 6000,
               description: "Check browser console for detailed error information.",
             });

             if (onImageLoad) {
               onImageLoad();
             }
           };

           tryLoadImage();
         }, [imageUrl, isCanvasReady, onImageLoad, canvasType]); // Added canvasType to dependencies


   useImperativeHandle(ref, () => ({
    getFabricCanvas: () => fabricCanvasRef.current
  }));

  return (
    <>  <TooltipProvider>
        <div className={cn("flex flex-col space-y-4 mt-4 px-4", className)}>
          {/* Canvas Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
            ref={containerRef}
          >
            <Card className="overflow-hidden border rounded-md shadow-sm bg-white">
              <CardContent className="p-0 mx-auto flex items-center justify-center">
                {/* <div className="relative flex items-center justify-center">                */}
                <canvas
                  ref={canvasRef}
                  className="border-0 block mx-auto w-full h-full"
                  style={{ width: "100%", height: "100%", display: "block" }}
                />

                {/* Image Loading Overlay */}
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">
                        Loading background image...
                      </p>
                    </div>
                  </div>
                )}

                {/* Canvas Status */}
                {!isCanvasReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">
                        Initializing canvas...
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </TooltipProvider>
    </>
  )
})

export default CanavasImage
