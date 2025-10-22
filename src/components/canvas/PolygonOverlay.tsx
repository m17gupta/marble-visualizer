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

import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import { collectPoints } from "@/components/canvasUtil/test/CreatePolygonTest";
import {
  HideAll,
  ShowIcon,
  ShowOutline,
} from "@/components/canvasUtil/HoverSegment";
import { getContainedPolygonNamesByBoundingBox } from "@/components/canvasUtil/test/DetectPolygonUnderTargetTest";
import { getCutOutArea } from "@/components/canvasUtil/test/CutOutAreaTest";
import { HideAllSegments } from "@/components/canvasUtil/test/HoverSegmentTest";
// import UpdateIconOnCanvas from "./updateCentriod/UpdateIconOnCanvas";

type NamedFabricObject = fabric.Object & {
  name?: string;
  groupName?: string;
  subGroupName?: string;
  isActived?: boolean;
};

interface CanvasHoverLayerProps {
  canvas: React.RefObject<any>;
  className?: string;
  width?: number;
  height?: number;
}
const PolygonOverlay = ({
  canvas,
  width,
  height,
  className,
}: CanvasHoverLayerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const isUpdatePoly = useRef<boolean>(true);
  const { allSegments: allSegmentArray } = useSelector(
    (state: RootState) => state.segments
  );
  // Remove unused refs: containerRef, backgroundImageRef, fabricCanvasRef
  const [allSegArray, setAllSegArray] = useState<SegmentModal[]>([]);
  const originalViewportTransform = React.useRef<fabric.TMat2D | null>(null);
  const { segments } = useSelector(
    (state: RootState) => state.materialSegments
  );
  const { hoverGroup } = useSelector((state: RootState) => state.canvas);

  const { aiTrainImageWidth, aiTrainImageHeight } = useSelector(
    (state: RootState) => state.canvas
  );

  const [updateSelectedSegment, setUpdateSelectedSegment] =
    useState<SegmentModal | null>(null);

  const { selectedSegment } = useSelector(
    (state: RootState) => state.masterArray
  );
  const { isResetZoom } = useSelector((state: RootState) => state.canvas);

  const { canvasType, isSwitchCanvas } = useSelector(
    (state: RootState) => state.canvas
  );
  const activeCanvas = useSelector(
    (state: RootState) => state.canvas.activeCanvas
  );

  const [canvasMode, setCanvasMode] = useState<string>("hover");
  const isPolygonUpdate = useRef<boolean>(false);

useEffect(() => {
  isUpdatePoly.current = true;
}, []);
  // update canvas Mode
  useEffect(() => {
    setCanvasMode(canvasType);
  }, [canvasType]);

  // upate all segmnet Array
  useEffect(() => {
    if (allSegmentArray && allSegmentArray.length > 0) {
      setAllSegArray(allSegmentArray);
    } else {
      setAllSegArray([]);
    }
  }, [allSegmentArray]);


  // Update selected segment
  useEffect(() => {
    if (selectedSegment) {
      setUpdateSelectedSegment(selectedSegment);
    } else {
      setUpdateSelectedSegment(null);
    }
  }, [selectedSegment]);

  useEffect(() => {
    // Get the fabric canvas from CanavasImage
    const fabricCanvas = canvas.current?.getFabricCanvas();
    if (!fabricCanvas) return;

    // Remove only overlays created by this component
    // const overlays = fabricCanvas
    //   .getObjects()
    //   .filter((obj: any) => obj.subGroupName === "hover-overlay");
    // overlays.forEach((obj: any) => fabricCanvas.remove(obj));

    if (
      allSegArray &&
      allSegArray.length > 0 &&
      segments &&
      segments.length > 0 &&
      height &&
      width &&
      canvas &&
      isUpdatePoly.current
    ) {
    //  console.log("allSegArray calling ");
      allSegArray.forEach((seg, idx) => {
        const {
          id,
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
        if (!annotation_points_float || annotation_points_float.length === 0)
          return;
        if (!segment_bb_float || segment_bb_float.length === 0) return;
        if (!group_label_system) return;
        if (!short_title) return;
        if (!segment_type) return;
        if (!segColor) return;
        if (!canvas.current) return;
        if(!id) return;
        isUpdatePoly.current = false;
        // Pass a unique subGroupName for overlays
        const isDemoCanvas= false
        collectPoints(
          id,
          annotation_points_float,
          short_title,
          segment_bb_float,
          segment_type,
          group_label_system,
          segColor,
          canvas,
          isFill,
          height,
          width,
          aiTrainImageWidth,
          aiTrainImageHeight,
          isDemoCanvas
          //'hover-overlay' // extra arg for subGroupName
        );
      });
      fabricCanvas.renderAll();
      isPolygonUpdate.current = true;
    }

  }, [
    allSegArray,
    segments,
    height,
    width,
    aiTrainImageWidth,
    aiTrainImageHeight,
    canvas,
    isUpdatePoly.current,
  ]);

  // hover on group segment

  // when canvas switch to outLine
  useEffect(() => {
    // Get the fabric canvas from CanavasImage
    const fabricCanvas = canvas.current?.getFabricCanvas();
    if (!fabricCanvas) return;
    if (canvasType === "hover" && activeCanvas === "outline") {
      HideAllSegments(fabricCanvas);
      // make visible all segments
      ShowOutline(canvas, "outline");
    } else if (canvasType === "hover" && activeCanvas === "mask") {
      ShowOutline(canvas, "mask");
    } else if (canvasType === "hover" && activeCanvas === "showSegments") {
      // show Icon
      //console.log(" show icon called");
      ShowIcon(canvas);
    } else {
      //hide all segments
      HideAll(canvas);
    }
  }, [canvasType, activeCanvas, canvas]);

  // cut out section
  useEffect(() => {
    const fabricCanvas = canvas.current?.getFabricCanvas();
    if (!fabricCanvas) return;

    const objects = fabricCanvas.getObjects();
    const scalex = fabricCanvas.width / aiTrainImageWidth;
    const scaley = fabricCanvas.height / aiTrainImageHeight;
    if (isPolygonUpdate.current && allSegArray && allSegArray.length > 0) {
      const getWallSegment = allSegArray.filter(
        (seg) => seg.segment_type === "Wall"
      );
      if (getWallSegment.length > 0) {
        // Do something with wall segments
        getWallSegment.map((item) => {
          const getAllPolyName = getContainedPolygonNamesByBoundingBox(
            canvas,
            item?.short_title ?? ""
          );

          if (getAllPolyName.length > 0) {
            const allTrimPoly = getAllPolyName.filter(
              (polyName) =>
                polyName.startsWith("WI") || polyName.startsWith("TR")
            );
            const color =
              segments.find(
                (s: { name: string; color_code: string }) =>
                  s.name === item.segment_type
              )?.color_code || "#FE0056";
            if (allTrimPoly.length > 0) {
              getCutOutArea(
                canvas,
                item.annotation_points_float || [],
                item.short_title || "",
                item.short_title || "",
                item.segment_type || "",
                item.group_label_system || "",
                item.segment_bb_float || [],
                color,
                scalex,
                scaley,
                allTrimPoly,
                allSegArray
              );
            }
          }
        });
      }
    }
  }, [allSegArray, isPolygonUpdate, canvas]);

  return <>
    {/* <UpdateIconOnCanvas
      canvas={canvas}
    /> */}
  </>;
};


export default PolygonOverlay;
