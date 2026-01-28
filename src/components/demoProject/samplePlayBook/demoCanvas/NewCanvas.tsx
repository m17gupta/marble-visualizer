

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as fabric from "fabric";
import { Canvas as FabricCanvas, Image as FabricImage, Point as FabricPoint } from "fabric";

import _throttle from "lodash/throttle";
import _debounce from "lodash/debounce";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setIsResetCanvas } from "@/redux/slices/demoProjectSlice/DemoCanvasSlice";
import { getPathPoints, handlePolygonfind, handlePolygonVisibilityTest, HideAll, hoverOutline, ResetCanvas, ShowOutline } from "@/components/canvasUtil/test/HoverSegmentTest";

import { setSelectedDemoMasterItem } from "@/redux/slices/demoProjectSlice/DemoMasterArraySlice";
import ShowSelectedSegment from "./ShowSelectedSegment";

import { setCanvasReady, setZoom } from "@/redux/slices/canvasSlice";
import { LoadImageWithCORS, LoadImageWithFetch, setBackgroundImage } from "@/components/canvasUtil/canvasImageUtils";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { OnCanvasClick } from "@/components/canvasUtil/OnCanvasClickEvent";
import { ZoomCanvasMouse } from "@/components/canvasUtil/ZoomCanvas";
import { NamedFabricObject } from "@/components/canvas/CanavasImage";


type Props = {
  backgroundImage: string;
  className?: string;
  canvasWidth: number;
  canvasHeight: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onImageLoad?: () => void;
};


const NewCanvas: React.FC<Props> = ({ onImageLoad, backgroundImage, className, canvasWidth, canvasHeight, onCanvasReady }) => {


  const dispatch = useDispatch<AppDispatch>();

  const containerRef = useRef<HTMLDivElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const backgroundImageRef = useRef<fabric.Image | null>(null);
  const originalViewportTransform = useRef<fabric.TMat2D | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);

  const { isHover, isMask, isShowSegmentName, isOutline, isResetCanvas } = useSelector((state: RootState) => state.demoCanvas);
  const demoMasterArray = useSelector((state: RootState) => state.demoMasterArray.demoMasterArray);
  const demoMasterArrayRef = useRef(demoMasterArray);
  const isShow = useRef<boolean>(isShowSegmentName);


  useEffect(() => {
    if (demoMasterArray) {
      demoMasterArrayRef.current = demoMasterArray;
    }
  }, [demoMasterArray]);

  useEffect(() => {
    isShow.current = isShowSegmentName;
  }, [isShowSegmentName]);

  const handleMouseMove = useCallback((event: fabric.TEvent) => {
    if (isHover) {
      const fc = fabricCanvasRef.current;

      if (!fc) return;
      const pointer = fc.getPointer(event.e);
      if (!pointer) return;
      // Use fabric.Point from imported fabric
      const fabricPoint = new FabricPoint(pointer.x, pointer.y);
      // handlePolygonVisibilityTest expects a RefObject, so wrap fc in a ref-like object if needed
      handlePolygonVisibilityTest({ current: fc }, fabricPoint, isShow.current);
    }
  }, [isHover, isShow]);

  const handleCanvasClick = useCallback((event: fabric.TEvent) => {
    const fc = fabricCanvasRef.current;
    const pointer = fc?.getPointer(event.e);
    if (!fc || !pointer) return;
    const fabricPoint = new fabric.Point(pointer.x, pointer.y);
    const polyName = handlePolygonfind(fabricCanvasRef, fabricPoint)
    const currentDemoMasterArray = demoMasterArrayRef.current;
    if (polyName?.name) {
      const result = polyName?.name.replace(/[0-9]/g, '');
      const seg = currentDemoMasterArray.find(item => item.short_code === result)
      if (seg)
        dispatch(setSelectedDemoMasterItem(seg));
    }
  }, []);

  const handleDoubleClick = useCallback((event: fabric.TEvent) => {
  }, []);

  const handleMouseWheel = useCallback((event: fabric.TEvent) => {
    const deltaE = event.e as WheelEvent;
    const pointer = fabricCanvasRef.current?.getPointer(event.e);

    //     // Make sure we have all required objects
    if (deltaE && fabricCanvasRef.current && pointer) {
      // Prevent default browser behavior
      event.e.stopPropagation();
      event.e.preventDefault();

      const delta = deltaE.deltaY;
      let zoom = fabricCanvasRef.current.getZoom();

      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20; // Set maximum zoom level
      if (zoom < 1) zoom = 1; // Set minimum zoom level

      ZoomCanvasMouse(fabricCanvasRef, zoom, {
        x: Math.round(pointer.x),
        y: Math.round(pointer.y),
      });
      event.e.stopPropagation();
      event.e.preventDefault();

      // Update the zoom state
      dispatch(setZoom(zoom));
    }
  }, []);
  const handleKeyDown = useCallback((event: fabric.TEvent) => {
  }, []);


  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      selection: true,
      preserveObjectStacking: true,
      backgroundColor: "#282828",
    });

    //  add group testPolygon
    const testPolygon = new fabric.Group([], {
      selectable: false,
      hasControls: false,
      hasBorders: false,
    });
    const editPolygon = new fabric.Group([], {
      selectable: false,
      hasControls: false,
      hasBorders: false,
    });
    (testPolygon as NamedFabricObject).groupName = "testPoly";
    (editPolygon as NamedFabricObject).groupName = "EditPoly";
    canvas.add(testPolygon);
    canvas.add(editPolygon);

    fabricCanvasRef.current = canvas;

    // Store the original viewport transform
    originalViewportTransform.current = canvas.viewportTransform
      ? ([...canvas.viewportTransform] as fabric.TMat2D)
      : null;

    onCanvasReady?.(canvas);
    // Canvas event handlers (desktop)
    canvas.on("mouse:down", (event) => handleCanvasClick(event));
    canvas.on("mouse:move", (event) => {
      handleMouseMove(event);
    });
    canvas.on("mouse:dblclick", (event) => handleDoubleClick(event));
    canvas.on("mouse:wheel", (event) => {
      handleMouseWheel(event);
      dispatch(setZoom(canvas.getZoom()));
    });

    // Canvas event handlers (mobile/touch)
    // Fabric.js emits 'touch:gesture', 'touch:drag', 'touch:longpress' events
    // We'll map touch:drag to mouse:move, touch:tap to mouse:down, and touch:longpress to mouse:dblclick
    (canvas.on as any)("touch:drag", (event: any) => {
      // Fabric.js touch events may not have .e, so we create a compatible event
      const pointer =
        event && event.self && event.self.x != null && event.self.y != null
          ? { x: event.self.x, y: event.self.y }
          : null;
      const fakeEvent = {
        ...event,
        e: pointer
          ? { clientX: pointer.x, clientY: pointer.y, ...event.e }
          : event.e || {},
      };
      handleMouseMove(fakeEvent);
    });
    (canvas.on as any)("touch:tap", (event: any) => {
      const pointer =
        event && event.self && event.self.x != null && event.self.y != null
          ? { x: event.self.x, y: event.self.y }
          : null;
      const fakeEvent = {
        ...event,
        e: pointer
          ? { clientX: pointer.x, clientY: pointer.y, ...event.e }
          : event.e || {},
      };
      handleCanvasClick(fakeEvent);
    });
    (canvas.on as any)("touch:longpress", (event: any) => {
      const pointer =
        event && event.self && event.self.x != null && event.self.y != null
          ? { x: event.self.x, y: event.self.y }
          : null;
      const fakeEvent = {
        ...event,
        e: pointer
          ? { clientX: pointer.x, clientY: pointer.y, ...event.e }
          : event.e || {},
      };
      handleDoubleClick(fakeEvent);
    });

    dispatch(setCanvasReady(true));

    return () => {
      // document.removeEventListener("keydown", handleKeyDown);

      // Clean up auto-panning
      // cleanupAutoPan(autoPanIntervalRef, setIsAutoPanning);

      // Remove canvas click event
      canvas.off("mouse:down", handleCanvasClick);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:dblclick", handleDoubleClick);
      canvas.off("mouse:wheel", handleMouseWheel);
      // Remove touch events (bypass TS)
      if (canvas.off as any) {
        (canvas.off as any)("touch:drag");
        (canvas.off as any)("touch:tap");
        (canvas.off as any)("touch:longpress");
      }

      canvas.dispose();
      fabricCanvasRef.current = null;
      backgroundImageRef.current = null;
      dispatch(setCanvasReady(false));
      dispatch(setZoom(1));
    };
  }, [canvasWidth, canvasHeight, dispatch]);

  // Only update background image if imageUrl or canvasType changes
  useEffect(() => {
    // Add canvasType to the dependency array
    if (!fabricCanvasRef.current || !backgroundImage) {
      return;
    }

    const canvas = fabricCanvasRef.current;

    //Remove existing background image (ensure full cleanup)
    if (backgroundImageRef.current) {
      canvas.backgroundImage = undefined;
      backgroundImageRef.current = null;
      canvas.renderAll();
    }

    const tryLoadImage = async () => {
      setIsImageLoading(true); // Start loading indicator

      // Strategy 1: Try different CORS modes
      const corsOptions: (string | null)[] = ["anonymous", "use-credentials"];
      for (const corsMode of corsOptions) {
        try {
          await LoadImageWithCORS(backgroundImage, corsMode);
          setBackgroundImage(
            fabricCanvasRef,
            backgroundImage,
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
          await LoadImageWithFetch(backgroundImage, fetchMode);
          setBackgroundImage(
            fabricCanvasRef,
            backgroundImage,
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
      // console.error("All image loading strategies failed for URL:", imageUrl);
      const errorMessage = backgroundImage.includes("s3.")
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
  }, [backgroundImage, onImageLoad]); // Added canvasType to dependencies



  // handle Mask
  useEffect(() => {
    const fc = fabricCanvasRef.current;
    if (!fc) return;
    if (isMask) {
      ShowOutline({ current: fc }, "mask", true);
    } else if (isOutline) {
      ShowOutline({ current: fc }, "outline", true);
    }
    else if (isResetCanvas) {
      dispatch(setIsResetCanvas(false));
      ResetCanvas({ current: fc }, true);
    }
    else {
      HideAll({ current: fc }, true);
    }
  }, [isMask, isOutline, isResetCanvas]);

  return (
    <>
      <ShowSelectedSegment
        canvas={fabricCanvasRef}
        zoom={100}
      />

      <div
        className={cn(
          "w-full h-full flex flex-col mb-3 transition-all duration-300 ease-in-out p-20",
          className
        )}
      >
        {/* Canvas Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full"
          ref={containerRef}
        >
          {/* <Card className="overflow-hidden bg-white border rounded-md shadow-sm"> */}
          {/* <CardContent className="flex items-center justify-center p-0 mx-auto"> */}
          <div className="w-full h-full flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="block max-w-full max-h-full mx-auto border-0"
              style={{
                width: `${canvasWidth}px`,
                height: `${canvasHeight}px`,
                display: "block",
              }}
            />

            {/* Image Loading Overlay */}
            {isImageLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100/80">
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 border-b-2 rounded-full animate-spin border-primary"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading background image...
                  </p>
                </div>
              </div>
            )}


            {/* {doubleClickPoint && (
                  <DoubleClickHtml
                    doubleClickPoint={doubleClickPoint}
                    onClose={() => setDoubleClickPoint(null)}
                  />
                )} */}
          </div>
          {/* </CardContent>
              </Card> */}
        </motion.div>
      </div>

    </>

  );
};

export default NewCanvas;