import { AppDispatch, RootState } from '@/redux/store';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as fabric from "fabric";
import { setCanvasReady } from '@/redux/slices/canvasSlice';
import { toast } from 'sonner';
import { AddImageToCanvas, LoadImageWithCORS, LoadImageWithFetch } from '@/components/canvasUtil/canvasImageUtils';
import { collectPoints } from '@/components/canvasUtil/CreatePolygon';
import { SegmentModal } from '@/models/jobSegmentsModal/JobSegmentModal';
import { handlePolygonVisibilityOnMouseMove, HideAllSegments } from '@/components/canvasUtil/HoverSegment';

import {
    TooltipProvider,
    //    Tooltip, TooltipContent, TooltipTrigger
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import CommonToolBar from '../CommonToolBar';
import CommentHome from '@/components/comments/CommentHome';
import { unknown } from 'zod';


type NamedFabricObject = fabric.Object & { name?: string };

interface CanvasHoverLayerProps {
    imageUrl?: string;
    width?: number;
    height?: number;
    className?: string;
    onImageLoad?: () => void;
}
const CommentCanvas = ({ imageUrl, width = 800, height = 600, className, onImageLoad }: CanvasHoverLayerProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [allSegArray, setAllSegArray] = useState<SegmentModal[]>([]);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const backgroundImageRef = useRef<fabric.Image | null>(null)
    const originalViewportTransform = useRef<fabric.TMat2D | null>(null);
    const [imageWidth, setImageWidth] = useState<number>(0);
    const [imageHeight, setImageHeight] = useState<number>(0);
    const [mousePositionX, setMousePositionX] = useState<number>(0);
    const [mousePositionY, setMousePositionY] = useState<number>(0);
    const { segments } = useSelector((state: RootState) => state.materialSegments);
    const {
        isCanvasReady
    } = useSelector((state: RootState) => state.canvas);
    const { allSegments: allSegmentArray } = useSelector((state: RootState) => state.segments);



    // upate all segmnet Array
    useEffect(() => {
        if (allSegmentArray && allSegmentArray.length > 0) {
            setAllSegArray(allSegmentArray);
        } else {
            setAllSegArray([]);
        }
    }, [allSegmentArray]);

    // Initialize Fabric.js canvas
    useEffect(() => {
        if (!canvasRef.current || fabricCanvasRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width,
            height,
            backgroundColor: "#f8f9fa",
            selection: true,
            preserveObjectStacking: true,
        });

        fabricCanvasRef.current = canvas;

        // Store the original viewport transform
        originalViewportTransform.current = canvas.viewportTransform
            ? ([...canvas.viewportTransform] as fabric.TMat2D)
            : null;

        dispatch(setCanvasReady(true));

        return () => {
            // document.removeEventListener("keydown", handleKeyDown);

            // Clean up auto-panning
            // cleanupAutoPan(autoPanIntervalRef, setIsAutoPanning);

            canvas.dispose();
            fabricCanvasRef.current = null;
            backgroundImageRef.current = null;
            // dispatch(setCanvasReady(false));
        };

    }, [width, height, dispatch]);

    // Load background image with comprehensive CORS and fallback handling
    useEffect(() => {
        if (!fabricCanvasRef.current || !isCanvasReady || !imageUrl) {
            return;
        }

        const canvas = fabricCanvasRef.current;

        // Remove existing background image (ensure full cleanup)
        if (backgroundImageRef.current) {
            canvas.remove(backgroundImageRef.current);
            backgroundImageRef.current = null;
            canvas.discardActiveObject();
            canvas.renderAll();
        }

        const tryLoadImage = async () => {
            // Strategy 1: Try different CORS modes
            const corsOptions: (string | null)[] = ["anonymous", "use-credentials"];
            for (const corsMode of corsOptions) {
                try {
                    const imgElement = await LoadImageWithCORS(imageUrl, corsMode);
                    setImageWidth(imgElement.width);
                    setImageHeight(imgElement.height);
                    AddImageToCanvas(imgElement, fabricCanvasRef, width, height, backgroundImageRef, onImageLoad);
                    return;
                } catch (error) {
                    console.warn(`Failed to load with CORS mode: ${corsMode}`, error);
                }
            }


            // Strategy 2: Try different fetch modes
            const fetchModes: RequestMode[] = ["cors", "no-cors", "same-origin"];
            for (const fetchMode of fetchModes) {
                try {
                    const imgElement = await LoadImageWithFetch(imageUrl, fetchMode);
                    setImageWidth(imgElement.width);
                    setImageHeight(imgElement.height);
                    AddImageToCanvas(imgElement, fabricCanvasRef, width, height, backgroundImageRef, onImageLoad);
                    return;
                } catch (error) {
                    console.warn(`Failed to load with fetch mode: ${fetchMode}`, error);
                }
            }

            // All strategies failed
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
    }, [imageUrl, isCanvasReady, width, height, onImageLoad]);

    useEffect(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas || !allSegArray || allSegArray.length === 0) return;

        // Remove previous polygons (but not the background image)
        const objectsToRemove = canvas.getObjects().filter(obj => obj.type === 'polygon');
        objectsToRemove.forEach(obj => canvas.remove(obj));

        allSegArray.forEach((seg, idx) => {
            const { segment_type, group_label_system, short_title, annotation_points_float, segment_bb_float } = seg;
            const segColor = (segments.find((s: { name: string; color_code: string }) => s.name === segment_type)?.color_code) || "#FF1493";
            const isFill = true;
            if (!annotation_points_float || annotation_points_float.length === 0 || !segment_bb_float || segment_bb_float.length === 0 || !group_label_system || !short_title || !segment_type || !segColor || !fabricCanvasRef.current) {
                console.warn(`[PolygonOverlay] Missing properties for segment ${idx}`, seg);
                return;
            }

            collectPoints(
                annotation_points_float,
                short_title,
                segment_bb_float,
                segment_type,
                group_label_system,
                segColor,
                fabricCanvasRef, // Pass the actual Canvas instance, not the ref
                isFill,
                imageHeight,
                imageWidth
            );
        });
    }, [allSegArray, segments, fabricCanvasRef, imageHeight, imageWidth])


    const handleMouseMove = useCallback(
        (event: fabric.TEvent) => {
            if (!fabricCanvasRef.current) return;
            // const canvas = fabricCanvasRef.current;

            const fabricEvent = event as unknown as { target?: NamedFabricObject };
            const target = fabricEvent.target;

            if (target !== undefined) {
                const targetName = target.name;
                if (targetName) {
                    handlePolygonVisibilityOnMouseMove(fabricCanvasRef, targetName);
                }
            } else {
                HideAllSegments(fabricCanvasRef);
            }
        },
        []
    );
    const [segName, setSegName] = useState<string | null>(null);

    // hover on group segment
    const { hoverGroup } = useSelector((state: RootState) => state.canvas);
    useEffect(() => {
        if (!fabricCanvasRef.current) return;
        if (hoverGroup == null) {
            HideAllSegments(fabricCanvasRef);
        } else if (hoverGroup.length > 0) {
            hoverGroup.forEach((groupName) => {
                handlePolygonVisibilityOnMouseMove(fabricCanvasRef, groupName);
            })
        }
    }, [hoverGroup, fabricCanvasRef]);


    const handleMouseDown = useCallback(
        (e: fabric.TEvent) => {
            if (!fabricCanvasRef.current || !canvasRef.current) {
                return;
            }

            const canvas = fabricCanvasRef.current;
            const canvasElement = canvasRef.current;
            
            // Get the mouse event
            const mouseEvent = e.e as MouseEvent;
            
            // Get canvas bounding rect to calculate offset
            const canvasRect = canvasElement.getBoundingClientRect();
            const containerElement = canvasElement.parentElement;
            
            if (!containerElement) return;
            
            const containerRect = containerElement.getBoundingClientRect();
            
            const canvasOffsetX = canvasRect.left - containerRect.left;
            const canvasOffsetY = canvasRect.top - containerRect.top;
            const pointer = canvas.getPointer(e.e);
            const canvasRelativeX = canvasOffsetX + pointer.x;
            const canvasRelativeY = canvasOffsetY + pointer.y;
            
            const activeObject = canvas.getActiveObject() as NamedFabricObject;
             console.log("Active object on mouse down:", activeObject);
            // Only show avatar if we clicked on a segment (active object with a name)
            const segName = activeObject?.name || "unknown";
            if (segName) {
                console.log("Setting avatar position for segment:", segName);
                // Use Method 2 (mouse event coordinates) as it's more reliable
                setMousePositionX(canvasRelativeX+200);
                setMousePositionY(canvasRelativeY+70)
                setSegName(segName);
            } else {
                // Clear avatar if clicking on empty area
                console.log("Clicked on empty area, clearing avatar");
                setMousePositionX(0);
                setMousePositionY(0);
                setSegName(null);
            }
        },
        [fabricCanvasRef]
    );

    // Attach event handlers when canvas is ready and handlers are defined
    useEffect(() => {
        if (!fabricCanvasRef.current || !isCanvasReady) return;

        const canvas = fabricCanvasRef.current;

        // Canvas event handlers
        canvas.on("mouse:down", handleMouseDown);
        canvas.on("mouse:move", handleMouseMove);

        return () => {
            canvas.off("mouse:down", handleMouseDown);
            canvas.off("mouse:move", handleMouseMove);
        };
    }, [isCanvasReady, handleMouseDown, handleMouseMove]);

    return (
        <>
            <TooltipProvider>
                <div className={cn("flex flex-col space-y-4", className)}>

                    <CommonToolBar
                        title="Comment Canvas"
                        onSaveAnnotation={() => {
                            // Handle save annotation logic here
                            // toast.success("Annotation saved successfully!");
                        }}
                    />
                    {/* Canvas Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative px-4"
                    >
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                {/* min-h-[600px] min-w-[800px]" */}
                                <div className="relative bg-gray-50 flex items-center justify-center min-h-[800px] min-w-[1000px]">
                                    <canvas
                                        ref={canvasRef}
                                        className="border-0 block"
                                        style={{ maxWidth: "100%", height: "auto" }}
                                    />

                                    {/* Show avatar only when we have valid mouse position and segment name */}
                                    {
                                        <CommentHome
                                         x={mousePositionX} 
                                            y={mousePositionY} 
                                            segmentName={segName??""}
                                        />  
                                      
                                    
                                    }

                                  
                                 
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

                                    {/* Hover Material Info */}
                                    <AnimatePresence>

                                    </AnimatePresence>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>


                </div>
            </TooltipProvider>

            {/* <CommentHomeExample/> */}
        </>
    )
}

export default CommentCanvas