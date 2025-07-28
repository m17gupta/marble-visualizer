import { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as fabric from "fabric";
import { motion, AnimatePresence } from "framer-motion";
import { AppDispatch, RootState } from "@/redux/store";
import {
  startDrawing,
  undo,
  redo,
  updateSegmentDrawn,
} from "@/redux/slices/segmentsSlice";
import {
  setZoom,
  setCanvasReady,
  setMousePosition,
  updateMasks,
} from "@/redux/slices/canvasSlice";
import { Card, CardContent } from "@/components/ui/card";

import {
  TooltipProvider,
  // Tooltip, TooltipContent, TooltipTrigger
} from "@/components/ui/tooltip";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { animatePolygonCompletion, PointModel } from "@/utils/canvasAnimations";
import { drawLines } from "../canvasUtil/DrawMouseLine";
import CanvasToolbar from "./CanvasToolbar";
import {
  handleCanvasAutoPan,
  cleanupAutoPan,
} from "@/components/canvasUtil/canvasAutoPan";
import {  ZoomCanvasMouse } from "../canvasUtil/ZoomCanvas";
import { CanvasModel } from "@/models/canvasModel/CanvasModel";
import { collectPoints } from "../canvasUtil/CreatePolygon";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";

export type DrawingTool = "select" | "polygon";

interface CanvasEditorProps {
  imageUrl?: string;
  width?: number;
  height?: number;
  className?: string;
  onImageLoad?: () => void;
}

/**
 * Handle mouse wheel events for zooming the canvas
 * @param event - Fabric.js event object containing wheel event data
 */

export function CanvasEditor({
  imageUrl,
  width = 800,
  height = 600,
  className,
  onImageLoad,
}: CanvasEditorProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { activeSegment, segmentDrawn, canvasHistory, historyIndex } =
    useSelector((state: RootState) => state.segments);
 
  const {
    deleteMaskId,
    zoomMode,
    isCanvasReady,
    mousePosition,
    canavasActiveTool,
  } = useSelector((state: RootState) => state.canvas);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const backgroundImageRef = useRef<fabric.Image | null>(null);

  // Auto-panning state
  const autoPanIntervalRef = useRef<number | null>(null);
  const setIsAutoPanning = useState(false)[1];

  const currentMousePositionRef = useRef<{ x: number; y: number } | null>(null);

  const activeTool = useRef<DrawingTool>("polygon");
  const updatedZoomMode = useRef<string>("mouse");

  // Store original viewport transform
  const originalViewportTransform = useRef<fabric.TMat2D | null>(null);

  const isPolygonMode = useRef(false);
  const tempPoints = useRef<fabric.Point[]>([]);
  const tempLines = useRef<fabric.Line[]>([]);
  const tempPointCircles = useRef<fabric.Circle[]>([]);

  const allSegments = useRef<{ [key: string]: fabric.Point[] }>({});
  const allSegmentsCount = useRef<number>(0);

  const { canvasType } = useSelector((state: RootState) => state.canvas);
  const {allSegments:allSegmentArray}= useSelector((state: RootState) => state.segments);
 

const [allSegArray, setAllSegArray] = useState<SegmentModal[]>([]);
  const {selectedMasterArray}= useSelector((state: RootState) => state.masterArray);

  // const [hoveredSegmentId] = useState<string | null>(null);
// upate all segmnet Array
useEffect(() => {
  if( allSegmentArray && allSegmentArray.length > 0) {
  setAllSegArray(allSegmentArray);
  }else{
    setAllSegArray([]);
  }
}, [allSegmentArray]);

  // update the canavasActiveTool
  useEffect(() => {
    if (canavasActiveTool != "") {
      activeTool.current = canavasActiveTool as DrawingTool;
    }
  }, [canavasActiveTool]);

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    // Check if we're in polygon drawing mode
    if (isPolygonMode.current && tempPoints.current.length > 0) {
      // Remove last point from tempPoints
      tempPoints.current.pop();
      const lastLine = tempLines.current.pop();
      if (lastLine && fabricCanvasRef.current) {
        fabricCanvasRef.current.remove(lastLine);
      }
      const lastCircle = tempPointCircles.current.pop();
      if (lastCircle && fabricCanvasRef.current) {
        fabricCanvasRef.current.remove(lastCircle);
      }

      // If there's a Redux action for removing the last point, use it
      // If not, we're handling it with the local state

      // Render changes
      fabricCanvasRef.current?.renderAll();

      // If we've removed all points, reset polygon mode to allow starting a new polygon
      if (tempPoints.current.length === 0) {
        isPolygonMode.current = false;

        toast.info("All points removed. Click to start a new polygon.");
      }

      return;
    } else if (isPolygonMode.current && tempPoints.current.length === 0) {
      isPolygonMode.current = false; // Reset polygon mode to allow starting a new polygon
    }

    // Handle regular history undo if not in polygon mode or no points to undo
    if (historyIndex > 0 && fabricCanvasRef.current) {
      dispatch(undo());
      const prevState = canvasHistory[historyIndex - 1];
      if (prevState) {
        fabricCanvasRef.current.loadFromJSON(prevState, () => {
          fabricCanvasRef.current!.renderAll();
        });
      }
    }
  }, [historyIndex, canvasHistory, dispatch]);

  const handleRedo = useCallback(() => {
    if (historyIndex < canvasHistory.length - 1) {
      dispatch(redo());
      const nextState = canvasHistory[historyIndex + 1];
      if (nextState && fabricCanvasRef.current) {
        fabricCanvasRef.current.loadFromJSON(nextState, () => {
          fabricCanvasRef.current!.renderAll();
        });
      }
    }
  }, [historyIndex, canvasHistory, dispatch]);

  // Delete selected segment
  const handleDeleteSelected = useCallback(() => {

  }, []);

  const handleCancelDrawing = useCallback(() => {
    if (fabricCanvasRef.current && isPolygonMode.current) {
      const canvas = fabricCanvasRef.current;

      // Remove all temporary objects (lines, preview line, and point circles)
      const tempObjects = canvas
        .getObjects()
        .filter(
          (obj) =>
            (obj as fabric.Object & { data?: { type?: string } }).data?.type ===
              "temp-line" ||
            (obj as fabric.Object & { data?: { type?: string } }).data?.type ===
              "preview-line" ||
            (obj as fabric.Object & { data?: { type?: string } }).data?.type ===
              "temp-point"
        );
      tempObjects.forEach((obj) => canvas.remove(obj));
      canvas.renderAll();
    }

    // Reset polygon state to allow starting a new polygon
    isPolygonMode.current = false;
    tempPoints.current = [];
    tempLines.current = [];
    tempPointCircles.current = [];

    // dispatch(cancelDrawing());

    toast.info("Polygon drawing cancelled");
  }, []);

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

    // Canvas event handlers
    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", (event) => {
      handleMouseMove(event);
    });
    canvas.on("mouse:dblclick", handleDoubleClick);
    // canvas.on('selection:created', handleSelection);
    // canvas.on('selection:updated', handleSelection);
    canvas.on("selection:cleared", () => {
      // dispatch(selectSegment(null));
    });

    canvas.on("mouse:wheel", (event) => {
      handleMouseWheel(event);
      dispatch(setZoom(canvas.getZoom()));
    });
    // canvas.on('object:modified', handleObjectModified);
    // canvas.on('mouse:over', handleMouseOver);
    // canvas.on('mouse:out', handleMouseOut);

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (
          e.key.toLowerCase() // Use toLowerCase to handle both uppercase and lowercase keys
        ) {
          case "c":
            e.preventDefault();
            if (activeSegment) {
              // dispatch(copySegment(activeSegmentId));
              // toast.success('Segment copied');
            }
            break;
          case "v":
            e.preventDefault();
            // if (copiedSegment) {
            //   // dispatch(pasteSegment());
            //   // toast.success('Segment pasted');
            // }
            break;
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
        }
      } else {
        switch (e.key) {
          case "Delete":
          case "Backspace":
            if (activeSegment) {
              handleDeleteSelected();
            }
            break;
          case "Escape":
            if (isPolygonMode.current) {
              // Fixed: Use isPolygonMode.current instead of isPolygonMode
              handleCancelDrawing();
            }
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    dispatch(setCanvasReady(true));

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // Clean up auto-panning
      cleanupAutoPan(autoPanIntervalRef, setIsAutoPanning);

      canvas.dispose();
      fabricCanvasRef.current = null;
      backgroundImageRef.current = null;
      dispatch(setCanvasReady(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, activeSegment, dispatch]);

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
      // Deselect any active object and force render
      canvas.discardActiveObject();
      canvas.renderAll();
    }

    // Helper function to create and add fabric image to canvas
    const addImageToCanvas = (imgElement: HTMLImageElement) => {
      const fabricImage = new fabric.Image(imgElement, {
        selectable: false,
        evented: false,
        excludeFromExport: false,
      });

      // Calculate scaling to fit canvas
      const canvasAspect = width / height;
      const imgAspect = imgElement.width / imgElement.height;

      let scale;
      if (imgAspect > canvasAspect) {
        scale = width / imgElement.width;
      } else {
        scale = height / imgElement.height;
      }

      fabricImage.scale(scale);
      fabricImage.set({
        left: (width - imgElement.width * scale) / 2,
        top: (height - imgElement.height * scale) / 2,
      });

      // Store reference and add to canvas
      backgroundImageRef.current = fabricImage;
      canvas.add(fabricImage);
      canvas.sendObjectToBack(fabricImage);
      canvas.renderAll();

      // console.log(`Background image loaded successfully via ${loadMethod}`);
      // toast.success('Background image loaded successfully');

      // Call the onImageLoad callback if provided
      if (onImageLoad) {
        onImageLoad();
      }
    };

    // Strategy 1: Try with different CORS modes
    const loadImageWithCORS = (corsMode: string | null = "anonymous") => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const imgElement = new Image();

        if (corsMode) {
          imgElement.crossOrigin = corsMode;
        }

        imgElement.onload = () => {
          resolve(imgElement);
        };

        imgElement.onerror = (error) => {
          reject(error);
        };

        imgElement.src = imageUrl;
      });
    };

    // Strategy 2: Try with fetch and different CORS modes
    const loadImageWithFetch = async (fetchMode: RequestMode) => {
      try {
        const response = await fetch(imageUrl, {
          mode: fetchMode,
          credentials: "omit",
          cache: "no-cache",
          headers: {
            Accept: "image/*",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        return new Promise<HTMLImageElement>((resolve, reject) => {
          const imgElement = new Image();

          imgElement.onload = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(imgElement);
          };

          imgElement.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Failed to load image from blob"));
          };

          imgElement.src = objectUrl;
        });
      } catch (error) {
        throw new Error(`Fetch failed with mode ${fetchMode}: ${error}`);
      }
    };

    // Try all loading strategies in sequence
    const tryLoadImage = async () => {
      // Strategy 1: Try different CORS modes
      const corsOptions = ["anonymous", null, "use-credentials"];

      for (const corsMode of corsOptions) {
        try {
          const imgElement = await loadImageWithCORS(corsMode);

          addImageToCanvas(imgElement);
          return; // Success, exit
        } catch (error) {
          console.warn(
            `Failed to load with CORS mode: ${corsMode || "none"}`,
            error
          );
        }
      }

      // Strategy 2: Try different fetch modes
      const fetchModes: RequestMode[] = ["cors", "no-cors", "same-origin"];

      for (const fetchMode of fetchModes) {
        try {
          const imgElement = await loadImageWithFetch(fetchMode);

          addImageToCanvas(imgElement);
          return; // Success, exit
        } catch (error) {
          console.warn(`Failed to load with fetch mode: ${fetchMode}`, error);
        }
      }

      // All strategies failed
      console.error("All image loading strategies failed for URL:", imageUrl);

      // Provide detailed error message with suggestions
      const errorMessage = imageUrl.includes("s3.")
        ? "Failed to load S3 image due to CORS restrictions. Please configure your S3 bucket CORS policy to allow requests from your domain."
        : "Failed to load background image. The image server may not allow cross-origin requests.";

      toast.error(errorMessage, {
        duration: 6000,
        description: "Check browser console for detailed error information.",
      });

      // Call the onImageLoad callback even on error to clear loading state
      if (onImageLoad) {
        onImageLoad();
      }
    };

    tryLoadImage();
  }, [imageUrl, isCanvasReady, width, height, onImageLoad]);

  // Update tool behavior
  useEffect(() => {
    if (!fabricCanvasRef.current || !isCanvasReady) return;

    const canvas = fabricCanvasRef.current;

    // Update canvas selection mode
    canvas.selection = activeTool.current === "select";

    // Reset auto-panning when tool changes
    cleanupAutoPan(autoPanIntervalRef, setIsAutoPanning);

    canvas.renderAll();
  }, [activeTool, isCanvasReady, setIsAutoPanning]);

  // Control whether zoom is centered on mouse position or canvas center
  // const getIsCenterZooms = useRef(zoomMode === "center");

  // Update zoom mode ref when zoomMode changes
  // useEffect(() => {
  //   getIsCenterZooms.current = zoomMode === "center";
  // }, [zoomMode]);

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


      // Calculate new zoom level based on wheel direction
      // Using 0.999^delta for smoother zooming
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20; // Set maximum zoom level
      if (zoom < 1) zoom = 1;   // Set minimum zoom level

      // Optional: Draw reference lines for better visual feedback
      drawLines(pointer.x, pointer.y, fabricCanvasRef, zoom);

      // Always zoom towards mouse position, regardless of zoom boundaries or mode
      ZoomCanvasMouse(fabricCanvasRef, zoom, { x: Math.round(pointer.x), y: Math.round(pointer.y) });
      event.e.stopPropagation();
      event.e.preventDefault();

      // Update the zoom state
      dispatch(setZoom(zoom));
    }
  };

  // Helper function to create a point circle
  const createPointCircle = useCallback(
    (x: number, y: number, isFirst: boolean = false) => {
      // Get current zoom level to adjust the circle size
      const currentZoom = fabricCanvasRef.current?.getZoom() || 1;

      // Base size values that will be adjusted by zoom
      const baseRadius = 4;
      const baseStrokeWidth = 2;

      // Adjust size inversely proportional to zoom
      const adjustedRadius = baseRadius / currentZoom;
      const adjustedStrokeWidth = baseStrokeWidth / currentZoom;

      return new fabric.Circle({
        left: x - adjustedRadius,
        top: y - adjustedRadius,
        radius: adjustedRadius,
        fill: isFirst ? "#FF1493" : "#007bff", // Pink for first point, blue for others
        stroke: "#ffffff",
        strokeWidth: adjustedStrokeWidth,
        selectable: false,
        evented: false,
        data: {
          type: "temp-point",
          isFirst: isFirst,
        },
      });
    },
    []
  );

  // Helper function to calculate distance between two points
  const calculateDistance = useCallback(
    (point1: fabric.Point, point2: { x: number; y: number }) => {
      const dx = point1.x - point2.x;
      const dy = point1.y - point2.y;
      return Math.sqrt(dx * dx + dy * dy);
    },
    []
  );

  // Helper function to finish and display the polygon
  const finishPolygon = useCallback(() => {
    if (!fabricCanvasRef.current || tempPoints.current.length < 3) return;

    const canvas = fabricCanvasRef.current;
    const currentZoom = canvas.getZoom();

    // Remove all temporary objects (lines, preview line, and point circles)
    const tempObjects = canvas
      .getObjects()
      .filter(
        (obj) =>
          (obj as fabric.Object & { data?: { type?: string } }).data?.type ===
            "temp-line" ||
          (obj as fabric.Object & { data?: { type?: string } }).data?.type ===
            "preview-line" ||
          (obj as fabric.Object & { data?: { type?: string } }).data?.type ===
            "temp-point"
      );
    tempObjects.forEach((obj) => canvas.remove(obj));

    // Create the actual polygon
    const polygonPoints = tempPoints.current.map(
      (p) => new fabric.Point(p.x, p.y)
    );

    const polygonNumberArray = polygonPoints.flatMap(point => [point.x, point.y]);
    // Base stroke width value
    const baseStrokeWidth = 2;
    // Adjust stroke width inversely proportional to zoom
    const adjustedStrokeWidth = baseStrokeWidth / currentZoom;
    allSegmentsCount.current += 1;
    const segmentId = `poly-${allSegmentsCount.current}`;
    allSegments.current[segmentId] = tempPoints.current;

    const polygon = new fabric.Polygon(polygonPoints, {
      fill: "rgba(255, 132, 0, 0.3)", // Semi-transparent orange fill
      stroke: "#FF1493",
      strokeWidth: adjustedStrokeWidth,
      selectable: true,
      evented: true,
    });

    // Add custom data to the polygon for identification
    (
      polygon as fabric.Object & {
        data?: { type?: string; segmentId?: string; name?: string };
      }
    ).data = {
      type: "segment",
      segmentId: `segment-${Date.now()}`, // Temporary ID, will be replaced by Redux
      name: segmentId,
    };

    canvas.add(polygon);
    canvas.renderAll();

    const updatedSegments = { ...allSegments.current };
    //const numberArray = convertPointsToNumbers(tempPoints.current);
    // Dispatch updated segments to Redux store
    if (canvasType === "mask" && polygonNumberArray.length > 0) {
      const data: CanvasModel = {
        id: allSegmentsCount.current,
        name: `area-${allSegmentsCount.current}`,
        annotations: polygonNumberArray,
      };

      dispatch(updateMasks(data));
    } else if (canvasType === "draw") {

      dispatch(updateSegmentDrawn(polygonNumberArray));
      // dispatch(updateSegmentDrawn(updatedSegments));
    }

    // Clean up temporary state
    isPolygonMode.current = false;
    tempPoints.current = [];
    tempLines.current = [];
    tempPointCircles.current = [];
    // reset the canvas
    if (fabricCanvasRef.current && originalViewportTransform.current) {
      fabricCanvasRef.current.setViewportTransform(
        originalViewportTransform.current
      );
      fabricCanvasRef.current.setZoom(1);
      fabricCanvasRef.current.requestRenderAll();
      dispatch(setZoom(1));
    }
    toast.success("Polygon created successfully! Ready to draw another.");
  }, [dispatch, canvasType]);

  // Handle mouse down events
  const handleMouseDown = useCallback(
    (e: fabric.TEvent) => {

      //  if(selectedMasterArray ===null){
      //   alert("Please select a segment to draw");
      //   return;
      //  }

      if (!fabricCanvasRef.current || activeTool.current !== "polygon") {
        return;
      }

      const canvas = fabricCanvasRef.current;
      const pointer = canvas.getPointer(e.e);
      const currentZoom = canvas.getZoom();

      if (!isPolygonMode.current) {
        isPolygonMode.current = true;
        tempPoints.current = [new fabric.Point(pointer.x, pointer.y)];
        tempLines.current = [];
        tempPointCircles.current = [];

        // Create and add the first point circle (pink color)
        const firstPointCircle = createPointCircle(pointer.x, pointer.y, true);
        canvas.add(firstPointCircle);
        tempPointCircles.current.push(firstPointCircle);

        dispatch(startDrawing());

        // When starting a new polygon, make sure we preserve existing segments in Redux
        if (
          Object.keys(segmentDrawn).length > 0 &&
          Object.keys(allSegments.current).length === 0
        ) {
          const convertedSegments: { [key: string]: fabric.Point[] } = {};

          // Object.entries(segmentDrawn).forEach(([key, points]) => {
          //   // Convert each point to a fabric.Point
          //   convertedSegments[key] = points.map(
          //     (p) => new fabric.Point(p.x, p.y)
          //   );
          // });

          allSegments.current = convertedSegments;
        }
      } else {
        // Check if we have at least 3 points and clicked near the first point
        if (tempPoints.current.length >= 3) {
          const firstPoint = tempPoints.current[0];
          const distance = calculateDistance(firstPoint, pointer);
          const snapDistance = 15 / currentZoom; // Adjust snap distance based on zoom

          if (distance <= snapDistance) {
            finishPolygon();
            return;
          }
        }

        // Add point to current polygon
        const newPoint = new fabric.Point(pointer.x, pointer.y);
        const lastPoint = tempPoints.current[tempPoints.current.length - 1];

        // Base stroke width
        const baseStrokeWidth = 2;
        // Adjust stroke width inversely proportional to zoom
        const adjustedStrokeWidth = baseStrokeWidth / currentZoom;

        // Create line from last point to new point with zoom-adjusted stroke width
        const line = new fabric.Line(
          [lastPoint.x, lastPoint.y, pointer.x, pointer.y],
          {
            stroke: "#FF1493",
            strokeWidth: adjustedStrokeWidth,
            selectable: false,
            evented: false,
            data: { type: "temp-line" },
          }
        );

        // Create point circle for the new point (blue color)
        const pointCircle = createPointCircle(pointer.x, pointer.y, false);

        canvas.add(line);
        canvas.add(pointCircle);
        tempPoints.current.push(newPoint);
        tempLines.current.push(line);
        tempPointCircles.current.push(pointCircle);
      }
    },
    [
      activeTool,
      dispatch,
      createPointCircle,
      calculateDistance,
      finishPolygon,
      segmentDrawn,
      selectedMasterArray
    ]
  );

  // Handle mouse move for preview line
  const handleMouseMove = useCallback(
    (e: fabric.TEvent) => {
      if (!fabricCanvasRef.current) return;

      const canvas = fabricCanvasRef.current;
      console.log("Mouse move event:", canvas);
      const pointer = canvas.getPointer(e.e);
      const currentZoom = canvas.getZoom();

      // Handle auto-panning if enabled
      handleCanvasAutoPan(e, fabricCanvasRef);

      // Update mouse position in Redux and in our ref for auto-panning
      dispatch(
        setMousePosition({ x: Math.round(pointer.x), y: Math.round(pointer.y) })
      );
      currentMousePositionRef.current = { x: pointer.x, y: pointer.y };

      // update the cursor line
      drawLines(pointer.x, pointer.y, fabricCanvasRef, currentZoom);

      if (
        !fabricCanvasRef.current ||
        !isPolygonMode.current ||
        tempPoints.current.length === 0
      )
        return;

      const lastPoint = tempPoints.current[tempPoints.current.length - 1];

      // Remove existing preview line
      const previewLine = canvas
        .getObjects()
        .find(
          (obj) =>
            (obj as fabric.Object & { data?: { type?: string } }).data?.type ===
            "preview-line"
        );
      if (previewLine) {
        canvas.remove(previewLine);
      }

      // Base values
      const baseStrokeWidth = 1;
      const baseDashArray = [5, 5];

      // Adjust stroke width and dash array inversely proportional to zoom
      const adjustedStrokeWidth = baseStrokeWidth / currentZoom;
      const adjustedDashArray = baseDashArray.map(
        (value) => value / currentZoom
      );

      // Add new preview line with zoom-adjusted properties
      const line = new fabric.Line(
        [lastPoint.x, lastPoint.y, pointer.x, pointer.y],
        {
          stroke: "#007bff",
          strokeWidth: adjustedStrokeWidth,
          strokeDashArray: adjustedDashArray,
          selectable: false,
          evented: false,
          data: { type: "preview-line" },
        }
      );

      canvas.add(line);

      // Add hover animation for polygon completion (when hovering near first point)
      if (tempPoints.current.length >= 3) {
        const firstPoint = tempPoints.current[0];
        const mousePoint: PointModel = { x: pointer.x, y: pointer.y };

        // Adjust snap distance based on zoom level
        const snapDistance = 15 / currentZoom;

        // Check if mouse is near first point and animate it
        animatePolygonCompletion(mousePoint, canvas, firstPoint, snapDistance);
      }

      canvas.renderAll();
    },
    [dispatch]
  );

  // Handle double click to finish polygon
  const handleDoubleClick = useCallback(() => {
    if (
      !fabricCanvasRef.current ||
      !isPolygonMode.current ||
      tempPoints.current.length < 3
    )
      return;

    finishPolygon();
  }, [finishPolygon]);

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

  const handleZoomIn = () => {
    if (fabricCanvasRef.current) {
      const zoom = fabricCanvasRef.current.getZoom() * 1.1;
      const limitedZoom = Math.min(20, zoom);
      const center = { x: mousePosition.x, y: mousePosition.y };
      fabricCanvasRef.current.zoomToPoint(
        new fabric.Point(center.x, center.y),
        limitedZoom
      );
      dispatch(setZoom(limitedZoom));
    }
  };

  const handleZoomOut = () => {
    if (fabricCanvasRef.current) {
      const zoom = fabricCanvasRef.current.getZoom() * 0.9;
      const limitedZoom = Math.max(1, zoom);
      const center = { x: mousePosition.x, y: mousePosition.y };
      fabricCanvasRef.current.zoomToPoint(
        new fabric.Point(center.x, center.y),
        limitedZoom
      );
      dispatch(setZoom(limitedZoom));
    }
  };

  // delete mask id from canvas
  useEffect(() => {
    if (!deleteMaskId || !fabricCanvasRef.current) return;

  
    const deletePolyId = `poly-${deleteMaskId}`;
    delete allSegments.current[deletePolyId];
    //delete the polygon from fabric canvas
    const canvas = fabricCanvasRef.current;
    const polygonToDelete = canvas
      .getObjects()
      .find(
        (obj) =>
          (obj as fabric.Object & { data?: { name?: string } }).data?.name ===
          deletePolyId
      );
    if (polygonToDelete) {
      canvas.remove(polygonToDelete);
      canvas.requestRenderAll();
    }
  }, [deleteMaskId, fabricCanvasRef, dispatch]);

  const {segments} = useSelector((state: RootState) => state.materialSegments); 
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if(!canvas || allSegArray.length === 0) return;

    allSegArray.map(seg => {
      const { segment_type, group_label_system, short_title, annotation_points_float, segment_bb_float } = seg;
      const segColor = (segments.find((s: { name: string; color_code: string }) => s.name === segment_type)?.color_code) || "#FF1493";
      const isFill = true;
      if (
        !annotation_points_float || annotation_points_float.length === 0 ||
        !segment_bb_float || segment_bb_float.length === 0 ||
        !group_label_system || !short_title || !segment_type || !segColor || !fabricCanvasRef.current
      ) return;
      
      collectPoints(
        annotation_points_float,
        short_title,
        segment_bb_float,
        segment_type,
        group_label_system,
        segColor,
        fabricCanvasRef, // Pass the actual Canvas instance, not the ref
        isFill
      );
    });
  }, [allSegArray, segments,fabricCanvasRef])
  return (
    <>
    <TooltipProvider>
      <div className={cn("flex flex-col space-y-4", className)}>
        {/* Toolbar */}
        <CanvasToolbar
          fabricCanvasRef={fabricCanvasRef}
          cancelDrawing={handleCancelDrawing}
          resetCanvas={handleResetCanvas}
          zoomIn={handleZoomIn}
          zoomOut={handleZoomOut}
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

              <div className="relative bg-gray-50 flex items-center justify-center min-h-[600px] min-w-[800px]">
                <canvas
                  ref={canvasRef}
                  className="border-0 block"
                  style={{ maxWidth: "100%", height: "auto" }}
                />

                {/* Drawing Instructions */}
                {/* { activeTool.current === 'polygon' && !isPolygonMode.current && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm">
                    Click to start drawing a polygon
                  </div>
                )} */}

                {/* {isPolygonMode.current && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm">
                    Click to add points • Click near first point or double-click to finish • Esc to cancel
                  </div>
                )} */}

                {/* Auto-panning indicator */}
                {/* {_isAutoPanning && (
                  <div className="absolute top-20 left-4 bg-amber-500 text-white px-3 py-2 rounded-lg text-sm animate-pulse">
                    Auto-panning active
                  </div>
                )} */}

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
                  {/* {hoveredSegment?.material && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <Palette className="h-3 w-3" />
                      
                      </div>
                    </motion.div>
                  )} */}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Material Picker Dialog */}
        {/* <MaterialPickerDialog
          open={materialPickerOpen}
          onOpenChange={setMaterialPickerOpen}
          onSelect={handleMaterialSelect}
          selectedMaterialId={activeSegment?.material?.materialId}
        /> */}
      </div>
    </TooltipProvider>


  
    </>
  );
}

