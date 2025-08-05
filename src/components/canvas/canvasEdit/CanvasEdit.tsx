import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as fabric from "fabric";
import { toast } from 'sonner';
import { AddImageToCanvas, LoadImageWithCORS, LoadImageWithFetch } from '@/components/canvasUtil/canvasImageUtils';
import { setCanvasReady, setCanvasType } from '@/redux/slices/canvasSlice';
import { SegmentModal } from '@/models/jobSegmentsModal/JobSegmentModal';
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import AddSegLists from '../canvasAddNewSegment/AddSegLists';
import { getMinMaxBBPoint } from '@/components/canvasUtil/GetMInMaxBBPoint';
import { addSegment, changeGroupSegment, updateAddSegMessage, updateSegmentById } from '@/redux/slices/segmentsSlice';
import { addNewSegmentToMasterArray, changeGroupSelectedSegment, deletedChangeGroupSegment } from '@/redux/slices/MasterArraySlice';
import { set } from 'date-fns';
import CommonToolBar from '../CommonToolBar';

export interface PointModel {
  x: number;
  y: number;
}

interface CanvasEditProps {
  imageUrl?: string;
  width?: number;
  height?: number;
  className?: string;
  onImageLoad?: () => void;
}

const CanvasEdit: React.FC<CanvasEditProps> = ({
  imageUrl,
  width,
  height,
  className,
  onImageLoad,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isCanvasReady } = useSelector((state: RootState) => state.canvas);
  const { selectedSegment } = useSelector((state: RootState) => state.masterArray);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const backgroundImageRef = useRef<fabric.Image | null>(null)
  const originalViewportTransform = useRef<fabric.TMat2D | null>(null);

  // For dragging a polygon point
  const [dragInfo, setDragInfo] = useState<{ poly?: fabric.Polygon, pointIdx?: number } | null>(null);


  // -- Place these BEFORE your component declaration --

  function getObjectSizeWithStroke(object: fabric.Object): fabric.Point {
    const scaleX = object.scaleX || 1;
    const scaleY = object.scaleY || 1;
    const strokeWidth = object.strokeWidth || 0;
    const stroke = new fabric.Point(
      object.strokeUniform ? strokeWidth / scaleX : strokeWidth,
      object.strokeUniform ? strokeWidth / scaleY : strokeWidth
    );
    return new fabric.Point(
      (object.width || 0) * scaleX + stroke.x,
      (object.height || 0) * scaleY + stroke.y
    );
  }

  const polygonPositionHandler = function (
    this: { pointIndex: number },
    dim: fabric.Point,
    finalMatrix: fabric.TMat2D,
    fabricObject: fabric.Polygon,
    _currentControl: fabric.Control
  ): fabric.Point {
    const point = fabricObject.points?.[this.pointIndex];
    if (!point) return new fabric.Point(0, 0);
    const x = point.x - (fabricObject.pathOffset?.x ?? 0);
    const y = point.y - (fabricObject.pathOffset?.y ?? 0);
    return fabric.util.transformPoint(
      new fabric.Point(x, y),
      fabric.util.multiplyTransformMatrices(
        fabricObject.canvas?.viewportTransform ?? [1, 0, 0, 1, 0, 0],
        fabricObject.calcTransformMatrix()
      )
    );
  };

  const anchorWrapper = function (
    anchorIndex: number,
    fn: (
      eventData: fabric.TPointerEvent,
      transform: fabric.Transform,
      x: number,
      y: number
    ) => boolean,
    canvas: fabric.Canvas
  ) {
    return function (
      eventData: fabric.TPointerEvent,
      transform: fabric.Transform,
      x: number,
      y: number
    ) {
      const fabricObject = transform.target as fabric.Polygon;
      if (fabricObject && fabricObject.points && fabricObject.points[anchorIndex]) {
        // Convert global (x, y) to local polygon coordinates
        const mouseLocalPosition = fabric.util.transformPoint(
          new fabric.Point(x, y),
          fabric.util.invertTransform(fabricObject.calcTransformMatrix())
        );
        const polygonBaseSize = getObjectSizeWithStroke(fabricObject);
        const size = fabricObject._getTransformedDimensions();
        const finalPointPosition = new fabric.Point(
          (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
          (fabricObject.pathOffset?.x ?? 0),
          (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
          (fabricObject.pathOffset?.y ?? 0)
        );
        fabricObject.points[anchorIndex] = finalPointPosition;
        fabricObject.setCoords();
        canvas.requestRenderAll();
        // Optional: fix jumpy behavior
        fabricObject.left = fabricObject.left ?? 0;
        fabricObject.top = fabricObject.top ?? 0;
        return fn(eventData, transform, x, y);
      }
      return false;
    };
  };

  const actionHandlers = function (
    eventData: fabric.TPointerEvent,
    transform: fabric.Transform,
    x: number,
    y: number
  ): boolean {
    return true; // You can set more conditions here if needed
  };

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
    originalViewportTransform.current =
      (canvas.viewportTransform && [...canvas.viewportTransform].length === 6)
        ? ([...canvas.viewportTransform] as fabric.TMat2D)
        : [1, 0, 0, 1, 0, 0];

    // --- Mouse events for dragging annotation points ---
    const handleMouseDown = (opt: any) => {
      const pointer = opt.pointer;
      const polygons = canvas.getObjects('polygon') as fabric.Polygon[];
      for (const poly of polygons) {
        if (!poly.visible) continue;
        if (!poly.points) continue;
        // Check proximity to points
        for (let i = 0; i < poly.points.length; i++) {
          const pt = poly.points[i];
          const polyX = poly.left! + pt.x * (poly.scaleX || 1);
          const polyY = poly.top! + pt.y * (poly.scaleY || 1);
          if (Math.abs(pointer.x - polyX) < 10 && Math.abs(pointer.y - polyY) < 10) {
            setDragInfo({ poly, pointIdx: i });
            return;
          }
        }
      }
      setDragInfo(null);
    };

    const handleMouseMove = (opt: any) => {
      if (!dragInfo?.poly || dragInfo.pointIdx == null) return;
      const pointer = opt.pointer;
      const poly = dragInfo.poly;
      const px = (pointer.x - poly.left!) / (poly.scaleX || 1);
      const py = (pointer.y - poly.top!) / (poly.scaleY || 1);
      poly.points![dragInfo.pointIdx] = new fabric.Point(px, py);
      poly.setCoords();
      canvas.requestRenderAll();

      const pol = canvas.getActiveObject() as fabric.Polygon | null;
      if (pol && pol.points) {
        const updatedPoints = pol.points.map(pt => ({ x: pt.x, y: pt.y }));
        console.log("Updated annotation points:", updatedPoints);
      }
    };
    const handleMouseUp = () => setDragInfo(null);

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);

    dispatch(setCanvasReady(true));
    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
      canvas.dispose();
      fabricCanvasRef.current = null;
      backgroundImageRef.current = null;
    };
  }, [width, height, dispatch, dragInfo]);

  // Load background image
  useEffect(() => {
    if (!fabricCanvasRef.current || !isCanvasReady || !imageUrl) {
      return;
    }
    const canvas = fabricCanvasRef.current;
    if (backgroundImageRef.current) {
      canvas.remove(backgroundImageRef.current);
      backgroundImageRef.current = null;
      canvas.discardActiveObject();
      canvas.renderAll();
    }
    const tryLoadImage = async () => {
      const corsOptions: (string | null)[] = ["anonymous", "use-credentials"];
      for (const corsMode of corsOptions) {
        try {
          const imgElement = await LoadImageWithCORS(imageUrl, corsMode);
          AddImageToCanvas(imgElement, fabricCanvasRef, width ?? 0, height ?? 0, backgroundImageRef, onImageLoad);
          return;
        } catch {
          console.warn(`Failed to load image with CORS mode: ${corsMode}`);
        }
      }
      const fetchModes: RequestMode[] = ["cors", "no-cors", "same-origin"];
      for (const fetchMode of fetchModes) {
        try {
          const imgElement = await LoadImageWithFetch(imageUrl, fetchMode);
          AddImageToCanvas(imgElement, fabricCanvasRef, width ?? 0, height ?? 0, backgroundImageRef, onImageLoad);
          return;
        } catch {
          console.warn(`Failed to load image with fetch mode: ${fetchMode}`);
        }
      }
      toast.error("Failed to load background image.");
      if (onImageLoad) onImageLoad();
    };
    tryLoadImage();
  }, [imageUrl, isCanvasReady, width, height, onImageLoad]);

  // Create the polygon with annotation points
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    canvas.getObjects('polygon').forEach(obj => canvas.remove(obj));

    if (
      selectedSegment &&
      selectedSegment.annotation_points_float &&
      selectedSegment.annotation_points_float.length > 0 &&
      selectedSegment.segment_bb_float &&
      selectedSegment.segment_bb_float.length > 0 &&
      selectedSegment.short_title
    ) {
      const points: PointModel[] = [];
      for (let i = 0; i < selectedSegment.annotation_points_float.length; i += 2) {
        points.push({
          x: selectedSegment.annotation_points_float[i],
          y: selectedSegment.annotation_points_float[i + 1]
        });
      }

      // Make editable polygon
      const polygon = new fabric.Polygon(points, {
        left: selectedSegment.segment_bb_float[0],
        top: selectedSegment.segment_bb_float[1],
        fill: "transparent",
        strokeWidth: 2,
        stroke: "rgb(7 239 253)",
        scaleX: 1,
        scaleY: 1,
        objectCaching: false,
        transparentCorners: false,
        selectable: false,
        hasControls: true,
        hasBorders: false,
        cornerStyle: "circle",
        cornerColor: "rgb(255 1 154)",
        cornerSize: 7,
        cornerStrokeColor: "rgb(7 239 253)"
      }) as fabric.Polygon;

      // Attach per-point controls
      polygon.controls = {
        ...polygon.points?.reduce((acc, _point, index) => {
          const controlKey = `p${index}`;
          acc[controlKey] = new fabric.Control({
            cursorStyle: "pointer",
            positionHandler: polygonPositionHandler.bind({ pointIndex: index }),
            actionHandler: anchorWrapper(index, actionHandlers, canvas).bind({ pointIndex: index }),
            actionName: "modifyPolygon"
          });
          return acc;
        }, {} as { [key: string]: fabric.Control })
      };

      canvas.add(polygon);
      canvas.setActiveObject(polygon);
      canvas.requestRenderAll();
    }
  }, [selectedSegment]);

  const handleResetCanvas = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.clear();
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
  };

  const handleSaveAnnotation = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      const poly = canvas.getActiveObject() as fabric.Polygon | null;
      if (poly && poly.points) {
        const updatedPoints = poly.points.map(pt => ({ x: pt.x, y: pt.y }));
        const polygonNumberArray = updatedPoints.flatMap(point => [
          Number(point.x.toFixed(2)),
          Number(point.y.toFixed(2))
        ]);
        const getMinMax = getMinMaxBBPoint(polygonNumberArray);

        const data: SegmentModal = {
          id: selectedSegment?.id || 0,
          job_id: selectedSegment?.job_id || 0,
          title: selectedSegment?.title || "",
          short_title: selectedSegment?.short_title || "",
          group_name_user: selectedSegment?.group_name_user || "",
          group_desc: selectedSegment?.group_desc || "",
          segment_type: selectedSegment?.segment_type || "",
          annotation_points_float: polygonNumberArray,
          segment_bb_float: getMinMax,
          annotation_type: selectedSegment?.annotation_type || "",
          seg_perimeter: selectedSegment?.seg_perimeter || 0,
          seg_area_sqmt: selectedSegment?.seg_area_sqmt || 0,
          seg_skewx: selectedSegment?.seg_skewx || 0,
          seg_skewy: selectedSegment?.seg_skewy || 0,
          created_at: selectedSegment?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          group_label_system: selectedSegment?.group_label_system || "",


        };
        updateSegment(data);
      }
    }
  }


  const updateSegment = async (segData: SegmentModal) => {
    try {
      const response = await dispatch(updateSegmentById(segData)).unwrap();
      dispatch(updateAddSegMessage(" Updating segment details..."));
      if (response && response.success) {

        // update into master Array
        dispatch(updateAddSegMessage(null));
        (handleResetCanvas())
        // update all Segments Array
        dispatch(changeGroupSegment(segData));
        // update master array
        dispatch(addNewSegmentToMasterArray(segData));
        dispatch(updateAddSegMessage(null));
        dispatch(setCanvasType("hover"));
      }
    } catch (error) {
      console.error("Error updating segment:", error);
      toast.error("Failed to update segment.");
    }
  }
  return (
    <TooltipProvider>
      <div className={cn("flex flex-col space-y-4", className)}>

        <CommonToolBar
        title={"Edit Annotation"}
        onSaveAnnotation={handleSaveAnnotation}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative px-4"
        >
          <Card className="overflow-hidden">
         
            <CardContent className="p-0">
              <div className="relative bg-gray-50 flex items-center justify-center min-h-[800px] min-w-[1000px]">

                <canvas
                  ref={canvasRef}
                  className="border-0 block"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
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
                <AnimatePresence></AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </TooltipProvider>
  );
};

export default CanvasEdit;
