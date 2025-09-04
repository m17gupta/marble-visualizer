import * as fabric from "fabric";
import {
  AddImageToCanvas,
  LoadImageWithCORS,
  LoadImageWithFetch,
  setBackgroundImage,
} from "@/components/canvasUtil/canvasImageUtils";
import { setCanvasReady, setZoom } from "@/redux/slices/canvasSlice";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import {
  handlePolygonVisibilityOnMouseMove,
  HideAllSegments,
} from "@/components/canvasUtil/HoverSegment";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { PointModel } from "../canvasEdit/CanvasEdit";

type NamedFabricObject = fabric.Object & {
  name?: string;
  groupName?: string;
};

interface CanvasTestLayerProps {
  canvas: React.RefObject<any>;
  className?: string;
  width?: number;
  height?: number;
}
const LayerCanvas = ({
  canvas,
  width,
  height,
  className,
}: CanvasTestLayerProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { isCanvasReady } = useSelector((state: RootState) => state.canvas);

  const [allSegArray, setAllSegArray] = useState<SegmentModal[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const backgroundImageRef = useRef<fabric.Image | null>(null);
  const originalViewportTransform = useRef<fabric.TMat2D | null>(null);
  const { segments } = useSelector(
    (state: RootState) => state.materialSegments
  );

  const { allPolygon } = useSelector((state: RootState) => state.testCanvas);
  const handleMouseMove = useCallback((event: fabric.TEvent) => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    console.log("canavvsss", canvas);
    console.log("canvas", canvas.getObjects());
    const fabricEvent = event as unknown as { target?: NamedFabricObject };
    const target = fabricEvent.target;
    console.log("target", target?.name);
    if (target !== undefined) {
      const targetName = target.name;
      if (targetName) {
        handlePolygonVisibilityOnMouseMove(fabricCanvasRef, targetName);
      }
    } else {
      HideAllSegments(fabricCanvasRef);
    }
  }, []);

  const [loading, setLoading] = useState(false);

  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);


  useEffect(() => {
       const fabricCanvas = canvas.current?.getFabricCanvas();
        if (!fabricCanvas) return;
        console.log("fabricCanvas", fabricCanvas);
    if (fabricCanvas && allPolygon.length > 0) {
      
  
      allPolygon.forEach((polygon, index) => {
         console.log("polygon calling ",index );
        createPolygon(polygon.annotation, polygon.box, index, canvas);
      });
     
      fabricCanvas.renderAll();
    } else if (fabricCanvas && allPolygon.length === 0) {
 // remove existing polygon if annotation is empty
  
       const allObjects = fabricCanvas?.getObjects() || [];
    const existingTestGroup = allObjects.find(
      (obj:fabric.Group) => (obj as NamedFabricObject).groupName === "testPoly"
    ) as fabric.Group | undefined;
      if (existingTestGroup) {
        console.log("Removing existing polygons from testPoly group",existingTestGroup);
       // only remove the object present in the group
        existingTestGroup.getObjects().forEach((obj) => {
          console.log("Removing object", obj.type);
          if (obj.type === "polygon") {
            existingTestGroup.remove(obj);
          }
        });
      // update the canvas existing polygons
      fabricCanvas.renderAll();
      }
    }
  }, [fabricCanvasRef, allPolygon, dispatch, backgroundImageRef]);

  const createPolygon = (
    annotation: number[],
    box: number[],
    index: number,
    canvasLayer: React.RefObject<any>
  ) => {
    const fabricCanvas = canvasLayer.current?.getFabricCanvas();
    if (!fabricCanvas || !width || !height) return;
    const allObjects = fabricCanvas?.getObjects() || [];
    const existingTestGroup = allObjects.find(
      (obj:fabric.Group) => (obj as NamedFabricObject).groupName === "testPoly"
    ) as fabric.Group | undefined;

    console.log("existingTestGroup", existingTestGroup, width, height);
    // add polygon to existingTestGroup if exists else create new group
    if (existingTestGroup) {
          console.log("polygon function calling ", index);
    const canvas = fabricCanvas.current;
    const bgImg = backgroundImageRef.current;
    const scaleX = bgImg?.scaleX ?? 1;
    const scaleY = bgImg?.scaleY ?? 1;
    const left = bgImg?.left ?? 0;
    const top = bgImg?.top ?? 0;
    const ratioWidth = width / 800;
    const ratioHeight = height / 600;
    
    const point: PointModel[] = [];
    for (let i = 0; i < annotation.length; i += 2) {
      const x = annotation[i] * ratioWidth + left;
      const y = annotation[i + 1] * ratioHeight + top;
      point.push({ x, y });
    }

      console.log("point");
    const polygon = new fabric.Polygon(point, {
      fill: "green",
      originX: box[0] + left,
      originY: box[1] + top,
      hasBorders: false,
      hasControls: false,
      stroke: "red",
      strokeWidth: 2,
      opacity: 0.4,
      visible: true,
      lockMovementX: true,
      lockMovementY: true,
    });
    (polygon as NamedFabricObject).name = `segment-Test-${index}`;

    existingTestGroup.add(polygon);
   fabricCanvas.renderAll();
    
    } else {
      console.log("Creating new testPoly group");
    }
  

    
  };
  return (
    <>
      
    </>
  );
};

export default LayerCanvas;
