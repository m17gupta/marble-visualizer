import { AppDispatch, RootState } from "@/redux/store";
import React, { useEffect, useRef, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as fabric from "fabric";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import { collectPoints } from "@/components/canvasUtil/test/CreatePolygonTest";
import { resetEditSegmentsOnCanvas } from "@/redux/slices/canvasSlice";
type NamedFabricObject = fabric.Object & {
  name?: string;
  groupName?: string;
  subGroupName?: string;
  isActived?: boolean;
};

interface UpdateSegmentsOnCanvasProps {
  canvasRef: React.RefObject<any>;
}

const UpdateSegmentsOnCanvas = ({ canvasRef }: UpdateSegmentsOnCanvasProps) => {
  const { aiTrainImageWidth, aiTrainImageHeight } = useSelector(
    (state: RootState) => state.canvas
  );
  const { segments } = useSelector(
    (state: RootState) => state.materialSegments
  );
  const { editSegments, changeSegType } = useSelector(
    (state: RootState) => state.canvas
  );
  const hasProcessed = useRef<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Early return if required data is not available
    if (!canvasRef.current?.getFabricCanvas || !aiTrainImageWidth || !aiTrainImageHeight || hasProcessed.current) {
      return;
    }

    const fabricCanvas = canvasRef.current.getFabricCanvas();
    if (!fabricCanvas) return;

    // Process edit segments if available
    if (editSegments && editSegments.length > 0) {
      hasProcessed.current = true;
      
      try {
        console.log("UpdateSegmentsOnCanvas - Processing editSegments:", editSegments);
        
        // If changeSegType exists, handle segment type change
        if (changeSegType && changeSegType.length > 0) {
          handleSegmentTypeChange(editSegments, changeSegType, fabricCanvas);
        } else {
          // Handle regular segment update
          handleSegmentUpdate(editSegments, fabricCanvas);
        }
        
        dispatch(resetEditSegmentsOnCanvas());
      } catch (error) {
        console.error("Error processing canvas segments:", error);
      } finally {
        hasProcessed.current = false;
      }
    }
  }, [
    editSegments,
    changeSegType,
    canvasRef,
    aiTrainImageWidth,
    aiTrainImageHeight,
    dispatch,
  ]);

  // Handle regular segment updates
  const handleSegmentUpdate = (editSegArray: SegmentModal[], fabricCanvas: fabric.Canvas) => {
    if (!editSegArray.length) return;
    
    console.log("UpdateSegmentsOnCanvas - Processing segment update:", editSegArray);
    
    const width = fabricCanvas.getWidth();
    const height = fabricCanvas.getHeight();
    const allObjects = fabricCanvas.getObjects();

    editSegArray.forEach((seg) => {
      const segName = seg.short_title ?? "";
      
      // Remove old group with the same name
      removeObjectsByName(allObjects, segName, fabricCanvas);
      
      // Create new group
      createNewGroup(seg, width ?? 0, height ?? 0);
    });

    fabricCanvas.renderAll();
  };

  // Handle segment type changes
  const handleSegmentTypeChange = (
    newEditSegments: SegmentModal[], 
    oldSegTitles: string[], 
    fabricCanvas: fabric.Canvas
  ) => {
    if (!newEditSegments.length || !oldSegTitles.length) return;
    
    console.log("UpdateSegmentsOnCanvas - Processing segment type change:", { newEditSegments, oldSegTitles });
    
    const width = fabricCanvas.getWidth();
    const height = fabricCanvas.getHeight();

    // Remove old segments by their titles
    const allObjects = fabricCanvas.getObjects();
    oldSegTitles.forEach((title) => {
      removeObjectsByName(allObjects, title, fabricCanvas);
    });

    // Create new segments
    newEditSegments.forEach((seg) => {
      createNewGroup(seg, width ?? 0, height ?? 0);
    });

    fabricCanvas.renderAll();
  };

  // Utility function to remove objects by name
  const removeObjectsByName = (allObjects: fabric.Object[], name: string, fabricCanvas: fabric.Canvas) => {
    allObjects.forEach((obj: NamedFabricObject) => {
      if (
        obj.type === "group" &&
        obj.name === name &&
        typeof (obj as fabric.Group).getObjects === "function"
      ) {
        console.log("Removing object:", obj);
        fabricCanvas.remove(obj);
      }
    });
  };

  // Create new group after edit
  const createNewGroup = (segment: SegmentModal, width: number, height: number) => {
    const {
      id,
      segment_type,
      group_label_system,
      short_title,
      annotation_points_float,
      segment_bb_float,
    } = segment;

    // Validate required fields
    const requiredFields = {
      id,
      segment_type,
      group_label_system,
      short_title,
      annotation_points_float: annotation_points_float && annotation_points_float.length > 0,
      segment_bb_float: segment_bb_float && segment_bb_float.length > 0,
      canvasRef: canvasRef.current,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.warn(`Missing required fields for segment creation: ${missingFields.join(", ")}`);
      return;
    }

    try {
      const segColor = segments.find(
        (s: { name: string; color_code: string }) => s.name === segment_type
      )?.color_code || "#FF1493";

      const isFill = false;
      collectPoints(
        id!,
        annotation_points_float!,
        short_title!,
        segment_bb_float!,
        segment_type!,
        group_label_system!,
        segColor,
        canvasRef,
        isFill,
        height,
        width,
        aiTrainImageWidth,
        aiTrainImageHeight
      );
    } catch (error) {
      console.error("Error creating new group:", error);
    }
  };

  return null;
};

export default memo(UpdateSegmentsOnCanvas);
