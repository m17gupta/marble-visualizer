import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import { AppDispatch, RootState } from "@/redux/store";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import * as fabric from "fabric";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { collectPoints } from "../canvasUtil/CreatePolygon";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import {
  setCanvasReady,
  setIsResetZoom,
  setMousePosition,
  setZoom,
  
} from "@/redux/slices/canvasSlice";
import {
  LoadImageWithCORS,
  LoadImageWithFetch,
  setBackgroundImage,
} from "../canvasUtil/canvasImageUtils";
import { toast } from "sonner";
import {
  handlePolygonVisibilityOnMouseMove,
  HideAll,
  HideAllSegments,
  hideMaskSegment,
  ShowOutline,
} from "../canvasUtil/HoverSegment";
import {
  handlePolygonVisibilityTest,
  hoverOutline,
} from "../canvasUtil/test/HoverSegmentTest";
import { ZoomCanvasMouse } from "../canvasUtil/ZoomCanvas";
import { OnCanvasClick } from "../canvasUtil/OnCanvasClickEvent";
import {
  addSelectedMasterArray,
  addUserSelectedSegment,
  updatedSelectedGroupSegment,
} from "@/redux/slices/MasterArraySlice";
import { MasterGroupModel, MasterModel } from "@/models/jobModel/JobModel";
import { updateActiveTab } from "@/redux/slices/visualizerSlice/workspaceSlice";
import DoubleClickHtml from "./DoubleClickHtml";
type NamedFabricObject = fabric.Object & {
  name?: string;
  groupName?: string;
};

interface CanvasHoverLayerProps {
  imageUrl?: string;
  width: number;
  height: number;
  className?: string;
  onImageLoad?: () => void;
  onMouseMove?: (event: fabric.TEvent) => void;
}

export interface modelPoint {
  x: number;
  y: number;
}
const CanavasImage = forwardRef(
  (
    {
      imageUrl,
      width,
      height,
      className,
      onImageLoad,
      onMouseMove,
    }: CanvasHoverLayerProps,
    ref
  ) => {
    const dispatch = useDispatch<AppDispatch>();

    const { isCanvasReady } = useSelector((state: RootState) => state.canvas);

    const containerRef = useRef<HTMLDivElement>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const backgroundImageRef = useRef<fabric.Image | null>(null);
    const originalViewportTransform = useRef<fabric.TMat2D | null>(null);
    const { segments } = useSelector(
      (state: RootState) => state.materialSegments
    );

    const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
    const { selectedSegment } = useSelector(
      (state: RootState) => state.masterArray
    );
    const { isResetZoom } = useSelector((state: RootState) => state.canvas);
    const { canvasType } = useSelector((state: RootState) => state.canvas);

    const [canvasMode, setCanvasMode] = useState<string>("hover");

    const canvasActiveRef = useRef<string>("");
    const activeOptionRef = useRef<string>("");
    const { allSegments, activeOption } = useSelector((state: RootState) => state.segments);
    const { masterArray } = useSelector(
      (state: RootState) => state.masterArray
    );
    // update canvas Mode

    const { activeCanvas } = useSelector((state: RootState) => state.canvas);
    useEffect(() => {
      if (activeCanvas) {
        canvasActiveRef.current = activeCanvas;
      } else {
        canvasActiveRef.current = "hideSegments";
      }
    }, [activeCanvas]);

    // Update activeOption ref when Redux state changes
    useEffect(() => {
      activeOptionRef.current = activeOption || "";
    }, [activeOption]);


    const handleMouseMove = useCallback(
      (event: fabric.TEvent) => {
        const currentCanvasActive = canvasActiveRef.current;
        const currentActiveOption = activeOptionRef.current;
        const fabricCanvas = fabricCanvasRef.current;
        console.log("mouse move event", fabricCanvas?.getObjects());
        if (!fabricCanvas) return;
        const fabricRef = { current: fabricCanvas };
        const pointer = fabricCanvas.getPointer(event.e);

        if (!pointer) return; // Early return if pointer is null/undefined

        const fabricPoint = new fabric.Point(pointer.x, pointer.y);


        if (
          canvasMode === "hover" &&
          currentCanvasActive === "hideSegments" &&
          currentActiveOption !== "edit-segment"
        ) {
         
          dispatch(
            setMousePosition({
              x: Math.round(fabricPoint.x),
              y: Math.round(fabricPoint.y),
            })
          );
          handlePolygonVisibilityTest(fabricRef, fabricPoint);

          //  }
        } else if (
          canvasMode === "hover" &&
          currentCanvasActive === "mask"
        ) {
           
          const showOutlineRef = {
            current: {
              getFabricCanvas: () => fabricCanvasRef.current,
            },
          };

          dispatch(
            setMousePosition({
              x: Math.round(fabricPoint.x),
              y: Math.round(fabricPoint.y),
            })
          );
          const isHideMask = hideMaskSegment(fabricRef, fabricPoint);
          if (!isHideMask) {
            ShowOutline(showOutlineRef, "mask");
          }
        } else if (
          canvasMode === "hover" &&
          currentCanvasActive === "outline"
        ) {
         
          hoverOutline(fabricRef, fabricPoint);
        }
      },
      [canvasMode, fabricCanvasRef, dispatch]
    );

    const handleMouseWheel = (event: fabric.TEvent) => {
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
    };

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

      // resizeCanvas(canvas);
      // Canvas event handlers
      canvas.on("mouse:down", (event) => handleCanvasClick(event));
      canvas.on("mouse:move", (event) => {
        handleMouseMove(event);
      });

      canvas.on("mouse:dblclick", (event) => handleDoubleClick(event));

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

        // Remove canvas click event
        canvas.off("mouse:down", handleCanvasClick);

        canvas.dispose();
        fabricCanvasRef.current = null;
        backgroundImageRef.current = null;
        dispatch(setCanvasReady(false));
      };
    }, [width, height, dispatch]);

    // Only update background image if imageUrl or canvasType changes
    useEffect(() => {
      // Add canvasType to the dependency array
      if (!fabricCanvasRef.current || !isCanvasReady || !imageUrl) {
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
    }, [imageUrl, isCanvasReady, onImageLoad]); // Added canvasType to dependencies

    useImperativeHandle(ref, () => ({
      getFabricCanvas: () => fabricCanvasRef.current,
    }));

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

    const handleCanvasClick = (event: fabric.TEvent) => {
      const fabricCanvas = fabricCanvasRef.current;
     
      if (!fabricCanvas) return;
      const pointer = fabricCanvas.getPointer(event.e);
      if (pointer) {
        const fabricPoint = new fabric.Point(pointer.x, pointer.y);
        const segName = OnCanvasClick(fabricCanvasRef, fabricPoint);
        if (segName) {
          if (
            allSegments &&
            allSegments.length > 0 &&
            masterArray &&
            masterArray.length > 0
          ) {
            const foundSegment = allSegments.find(
              (seg) => seg.short_title === segName
            );
            if (
              foundSegment &&
              foundSegment.segment_type &&
              foundSegment.group_label_system
            ) {
              dispatch(addUserSelectedSegment([foundSegment])); // update user selected segment
              const masterSegment = masterArray.find(
                (seg: MasterModel) => seg.name === foundSegment.segment_type
              );
              
              if (masterSegment) {
                dispatch(addSelectedMasterArray(masterSegment));
                const allSeg = masterSegment.allSegments;
                const groupSeg = allSeg.find(
                  (seg: MasterGroupModel) =>
                    seg.groupName === foundSegment.group_label_system
                );
                
                if (groupSeg) {
                  dispatch(updatedSelectedGroupSegment(groupSeg));
                  dispatch(updateActiveTab("design-hub"));
                }
              }
            }
          }
        }
      }
    };

      const [doubleClickPoint, setDoubleClickPoint] = useState<modelPoint | null>(null);
       // Double click event handler
      const handleDoubleClick = (event: fabric.TEvent) => {
        const fabricCanvas = fabricCanvasRef.current;
        if (!fabricCanvas) return;
        const pointer = fabricCanvas.getPointer(event.e);
        if (pointer) {
          setDoubleClickPoint({ x: pointer.x, y: pointer.y });
        }
      };

      //   // hover on group segment
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


    return (
      <>
        {" "}
        <TooltipProvider>
          <div className={cn("flex flex-col space-y-4 mt-4 px-4 mb-3", className)}>
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
                  {doubleClickPoint && (
                    <DoubleClickHtml
                      doubleClickPoint={doubleClickPoint}
                      
                     onClose={() => setDoubleClickPoint(null)}
                    />
                  )}

                  
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TooltipProvider>


      </>
    );
  }
);

export default CanavasImage;
