import { AppDispatch, RootState } from "@/redux/store";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import * as fabric from "fabric";
import {
  LoadImageWithCORS,
  LoadImageWithFetch,
  setBackgroundImage,
} from "../canvasUtil/canvasImageUtils";
import { toast } from "sonner";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { collectPoints } from "../canvasUtil/CreatePolygon";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import {
  setCanvasReady,
  setIsResetZoom,
  setZoom,
} from "@/redux/slices/canvasSlice";
import {
  handlePolygonVisibilityOnMouseMove,
  handlePolygonVisibilityTest,
  HideAllSegments,
} from "../canvasUtil/HoverSegment";
import { SelectedAnimation } from "../canvasUtil/SelectedAnimation";
import { ZoomCanvasMouse } from "../canvasUtil/ZoomCanvas";
import { all } from "axios";
import { getContainedPolygonNamesByBoundingBox } from "../canvasUtil/DetectPolygonUnderTarget";
import { getCutOutArea } from "../canvasUtil/CutOutArea";

type NamedFabricObject = fabric.Object & { name?: string };

interface CanvasHoverLayerProps {
  imageUrl?: string;
  width: number;
  height: number;
  className?: string;
  onImageLoad?: () => void;
}
const PolygonOverlay = ({
  imageUrl,
  width,
  height,
  className,
  onImageLoad,
}: CanvasHoverLayerProps) => {
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

  // upate all segmnet Array
  useEffect(() => {
    if (allSegmentArray && allSegmentArray.length > 0) {
      setAllSegArray(allSegmentArray);
    } else {
      setAllSegArray([]);
    }
  }, [allSegmentArray]);

  const resizeCanvas = useMemo(
    () => (fabricCanvas: fabric.Canvas) => {
      const container = containerRef.current;

      if (container && canvasRef.current) {
        const canvas = canvasRef.current;
        // const dpr = window.devicePixelRatio || 1;
        // const wrap = canvas.parentElement ?? document.body;
        // const rect = wrap.getBoundingClientRect();
        // console.log("rect", rect);
        // console.log("dpr", dpr);
        // console.log("container", container);
        const { offsetWidth, offsetHeight } = container;

        // Set the canvas element size
        canvasRef.current.width = offsetWidth;
        canvasRef.current.height = offsetHeight;

        // Set the Fabric canvas size
        fabricCanvas.setWidth(offsetWidth);
        fabricCanvas.setHeight(offsetHeight);

        // Scale background image proportionally (optional)
        const backgroundImage = fabricCanvas.backgroundImage as fabric.Image;
        if (backgroundImage) {
          const scale = Math.min(
            offsetWidth / backgroundImage.width!,
            offsetHeight / backgroundImage.height!
          );
          backgroundImage.scale(scale);
          fabricCanvas.requestRenderAll();
        } else {
          fabricCanvas.renderAll();
        }
      }
    },
    []
  );

  useEffect(() => {
    const handleResize = () => {
      if (fabricCanvasRef.current) {
        //  resizeCanvas(fabricCanvasRef.current);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resizeCanvas]);

  // Update selected segment
  useEffect(() => {
    if (selectedSegment) {
      setUpdateSelectedSegment(selectedSegment);
    } else {
      setUpdateSelectedSegment(null);
    }
  }, [selectedSegment]);

  const handleMouseMove = useCallback((event: fabric.TEvent) => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
   //  console.log("canvas", canvas.getObjects());
    const fabricEvent = event as unknown as { target?: NamedFabricObject };
    const target = fabricEvent.target;
       const pointer = fabricCanvasRef.current?.getPointer(event.e);
    if (target !== undefined) {
      const targetName = target.name;
     // console.log(" targetName", targetName);
      if (targetName) {
         const fabricPoint = new fabric.Point(pointer.x, pointer.y);
        
       // handlePolygonVisibilityOnMouseMove(fabricCanvasRef, targetName);
        handlePolygonVisibilityTest(fabricCanvasRef, targetName, fabricPoint);
      }
    } else {
      HideAllSegments(fabricCanvasRef);
    }
  }, []);

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

    canvas.on("mouse:wheel", (event) => {
      handleMouseWheel(event);
      dispatch(setZoom(canvas.getZoom()));
    });

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

  const handleMouseWheel = (event: fabric.TEvent) => {
    // Cast the event to WheelEvent to access deltaY
    const deltaE = event.e as WheelEvent;
    const pointer = fabricCanvasRef.current?.getPointer(event.e);

    // Make sure we have all required objects
    if (deltaE && fabricCanvasRef.current && pointer) {
      // Prevent default browser behavior
      event.e.stopPropagation();
      event.e.preventDefault();

      const delta = deltaE.deltaY;
      let zoom = fabricCanvasRef.current.getZoom();

      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20; // Set maximum zoom level
      if (zoom < 1) zoom = 1; // Set minimum zoom level

      // Optional: Draw reference lines for better visual feedback
      //drawLines(pointer.x, pointer.y, fabricCanvasRef, zoom);

      // Always zoom towards mouse position, regardless of zoom boundaries or mode
      ZoomCanvasMouse(fabricCanvasRef, zoom, {
        x: Math.round(pointer.x),
        y: Math.round(pointer.y),
      });
      event.e.stopPropagation();
      event.e.preventDefault();

      // Update the zoom state
      dispatch(setZoom(zoom));
    }
  };

  // Load background image with comprehensive CORS and fallback handling
  useEffect(() => {
    if (!fabricCanvasRef.current || !isCanvasReady || !imageUrl) {
      return;
    }

    const canvas = fabricCanvasRef.current;

    //Remove existing background image (ensure full cleanup)
    if (backgroundImageRef.current) {
      canvas.remove(backgroundImageRef.current);
      backgroundImageRef.current = null;
      canvas.discardActiveObject();
      canvas.renderAll();
    }

    const tryLoadImage = async () => {
      setIsImageLoading(true); // Start loading indicator

      // Strategy 1: Try different CORS modes
      const corsOptions: (string | null)[] = ["anonymous", "use-credentials"];
      for (const corsMode of corsOptions) {
        try {
          const imgElement = await LoadImageWithCORS(imageUrl, corsMode);
          // setImageWidth(imgElement.width);
          // setImageHeight(imgElement.height);
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
          const imgElement = await LoadImageWithFetch(imageUrl, fetchMode);
          setImageWidth(imgElement.width);
          setImageHeight(imgElement.height);
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
  }, [imageUrl, isCanvasReady, width, height, onImageLoad]);


  const isPolygonUpdate = useRef(false);
  useEffect(() => {
    const canvas = fabricCanvasRef.current;

    if (
      allSegArray &&
      allSegArray.length > 0 &&
      segments &&
      segments.length > 0 &&
      height &&
      width &&
      canvas
    ) {
      allSegArray.forEach((seg, idx) => {
        const {
          segment_type,
          group_label_system,
          short_title,
          annotation_points_float,
          segment_bb_float,
        } = seg;
        const segColor =
          segments.find(
            (s: { name: string; color_code: string }) => s.name === segment_type
          )?.color_code || "#FF1493";
        const isFill = false;
        if (!annotation_points_float || annotation_points_float.length === 0) {
          console.warn(
            `[PolygonOverlay] Segment ${idx} missing annotation_points_float`,
            seg
          );
          return;
        }
        if (!segment_bb_float || segment_bb_float.length === 0) {
          console.warn(
            `[PolygonOverlay] Segment ${idx} missing segment_bb_float`,
            seg
          );
          return;
        }
        if (!group_label_system) {
          console.warn(
            `[PolygonOverlay] Segment ${idx} missing group_label_system`,
            seg
          );
          return;
        }
        if (!short_title) {
          console.warn(
            `[PolygonOverlay] Segment ${idx} missing short_title`,
            seg
          );
          return;
        }
        if (!segment_type) {
          console.warn(
            `[PolygonOverlay] Segment ${idx} missing segment_type`,
            seg
          );
          return;
        }
        if (!segColor) {
          console.warn(`[PolygonOverlay] Segment ${idx} missing segColor`, seg);
          return;
        }
        if (!fabricCanvasRef.current) {
          console.warn(
            `[PolygonOverlay] fabricCanvasRef.current missing at segment ${idx}`
          );
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
          height,
          width,
          aiTrainImageWidth,
          aiTrainImageHeight
        );
          if(idx==allSegArray.length-1  ){
            console.log("All segments added to canvas");
            isPolygonUpdate.current = true;
      }

      });

      canvas.renderAll();
     
    }
  }, [
    allSegArray,
    segments,
    fabricCanvasRef,
    height,
    width,
    aiTrainImageWidth,
    aiTrainImageHeight,
  ]);


  // hover on group segment
  const { hoverGroup } = useSelector((state: RootState) => state.canvas);
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    if (hoverGroup == null) {
      HideAllSegments(fabricCanvasRef);
    } else if (hoverGroup.length > 0) {
      hoverGroup.forEach((groupName) => {
        handlePolygonVisibilityOnMouseMove(fabricCanvasRef, groupName);
      });
    }
  }, [hoverGroup, fabricCanvasRef]);

  // update Animation on selected segment
  useEffect(() => {
    if (!fabricCanvasRef.current || !updateSelectedSegment) return;

    const canvas = fabricCanvasRef.current;
    const segName = updateSelectedSegment.short_title;
    const annotatonPoints = updateSelectedSegment.annotation_points_float;
    const color =
      segments.find(
        (s: { name: string; color_code: string }) =>
          s.name === updateSelectedSegment.segment_type
      )?.color_code || "#FE0056";
    if (!annotatonPoints || annotatonPoints.length === 0 || !segName || !color)
      return;
    // Remove existing selected animation
    const allObjects = canvas.getObjects();
    allObjects.forEach((item) => {
      const namedItem = item as NamedFabricObject;
      if (
        item instanceof fabric.Polygon &&
        namedItem.name === `SelectedPolygon`
      ) {
        canvas.remove(item);
      }
    });

    // Add new selected animation
    SelectedAnimation(fabricCanvasRef, annotatonPoints, segName, color);
  }, [updateSelectedSegment, segments, fabricCanvasRef]);

  useEffect(() => {
    if (isResetZoom) {
      dispatch(setIsResetZoom(false));
      handleResetCanvas();
    }
  }, [isResetZoom]);

  const handleResetCanvas = () => {
    if (fabricCanvasRef.current && originalViewportTransform.current) {
      // Reset to original viewport transform
      fabricCanvasRef.current.setViewportTransform(
        originalViewportTransform.current
      );
      fabricCanvasRef.current.setZoom(1);
      fabricCanvasRef.current.requestRenderAll();
      dispatch(setZoom(1));
      toast.success("Canvas reset to original state");
    }
  };

  // cut out section
 
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects();
    const scalex = canvas.width / aiTrainImageWidth;
    const scaley = canvas.height / aiTrainImageHeight;
    if (isPolygonUpdate.current && allSegArray && allSegArray.length > 0) {
      const getWallSegment = allSegArray.filter((seg) => seg.segment_type === "Wall");
      if (getWallSegment.length > 0) {
        // Do something with wall segments
        getWallSegment.map(item => {
                const getAllPolyName=getContainedPolygonNamesByBoundingBox(fabricCanvasRef,item?.short_title??"");
                console.log("getAllPolyName",getAllPolyName);
                if(getAllPolyName.length>0){
                  const allTrimPoly = getAllPolyName.filter(
                (polyName) => polyName.startsWith("WI") || polyName.startsWith("TR")
              );

                  if(allTrimPoly.length>0){
                    getCutOutArea(
                      fabricCanvasRef,
                      item.annotation_points_float || [],
                      item.short_title || "",
                      item.short_title || "",
                      item.segment_type || "",
                      item.group_label_system || "",
                      item.segment_bb_float || [],
                      "red",
                      scalex,
                      scaley,
                      allTrimPoly,
                      allSegArray

                    )
                  }
                }
              })
             }
      }
  }, [allSegArray,isPolygonUpdate]);

  return (
    <>
      <TooltipProvider>
        <div className={cn("flex flex-col space-y-4 mt-4", className)}>
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
  );
};

export default PolygonOverlay;
