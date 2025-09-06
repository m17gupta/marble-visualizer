import { AppDispatch, RootState } from "@/redux/store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as fabric from "fabric";
import { toast } from "sonner";

import { setCanvasReady, setCanvasType } from "@/redux/slices/canvasSlice";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";

import {
  changeGroupSegment,
  updateAddSegMessage,
  updateClearEditCanvas,
  updateEditSelectedSegment,
  updateSegmentById,
} from "@/redux/slices/segmentsSlice";
import { addNewSegmentToMasterArray } from "@/redux/slices/MasterArraySlice";

type NamedFabricObject = fabric.Object & {
  name?: string;
  groupName?: string;
};

export interface PointModel {
  x: number;
  y: number;
}

interface CanvasEditProps {
  fabricCanvasRef: React.RefObject<any>;
  className?: string;
  width?: number;
  height?: number;
}

const CanvasEdit: React.FC<CanvasEditProps> = ({
  fabricCanvasRef,
  width,
  height,
  className,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { aiTrainImageWidth, aiTrainImageHeight } = useSelector(
    (state: RootState) => state.canvas
  );

  const { selectedSegments,clearUpdateCanvas } = useSelector(
    (state: RootState) => state.segments
  );

  // For dragging points in multiple polygons
  const [dragInfo, setDragInfo] = useState<Array<{ poly: fabric.Polygon; pointIdx: number }> | null>(null);
  
  // For hover effect on control points
  const [hoverPoint, setHoverPoint] = useState<{ poly: fabric.Polygon; pointIdx: number } | null>(null);
  
  // For tracking acquired targets and keeping canvas active when mouse is nearby
  const [acquiredTargets, setAcquiredTargets] = useState<Array<{ poly: fabric.Polygon; pointIdx: number; x: number; y: number }>>([]);
  const [isCanvasActiveNearTarget, setIsCanvasActiveNearTarget] = useState<boolean>(false);
  
  // Track which segments have been modified during the current drag operation
  const [modifiedSegments, setModifiedSegments] = useState<Set<string>>(new Set());
  
  // Distance threshold for "nearby" detection (in pixels)
  const NEARBY_THRESHOLD = 40;

  // Utility function to get current segment modification status
  const getSegmentModificationStatus = () => {
    return {
      modifiedSegments: Array.from(modifiedSegments),
      isDragging: dragInfo !== null,
      dragTargetsCount: dragInfo?.length || 0,
      acquiredTargetsCount: acquiredTargets.length,
      selectedSegmentsCount: selectedSegments?.length || 0
    };
  };

  // Log segment modification status (useful for debugging)
  useEffect(() => {
    const status = getSegmentModificationStatus();
    if (status.modifiedSegments.length > 0 || status.isDragging) {
      console.log('Segment Modification Status:', status);
    }
  }, [modifiedSegments, dragInfo, acquiredTargets, selectedSegments]);

 
  // -- Place these BEFORE your component declaration --

  // Helper function to create hover circle
  const createHoverCircle = (x: number, y: number, isNearbyTarget: boolean = false): fabric.Circle => {
    return new fabric.Circle({
      left: x - 8,
      top: y - 8,
      radius: 8,
      fill: isNearbyTarget ? 'rgba(255, 165, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      stroke: isNearbyTarget ? 'rgb(255, 140, 0)' : 'rgb(7, 239, 253)',
      strokeWidth: isNearbyTarget ? 3 : 2,
      selectable: false,
      evented: false,
      excludeFromExport: true,
    });
  };

  // Helper function to check if mouse is near any acquired targets
  const checkMouseNearAcquiredTargets = (mouseX: number, mouseY: number): boolean => {
    return acquiredTargets.some(target => {
      const distance = Math.sqrt(
        Math.pow(mouseX - target.x, 2) + Math.pow(mouseY - target.y, 2)
      );
      return distance <= NEARBY_THRESHOLD;
    });
  };

  // Helper function to update acquired target positions
  const updateAcquiredTargetPositions = (canvas: fabric.Canvas) => {
    setAcquiredTargets(prev => 
      prev.map(target => {
        const poly = target.poly;
        if (!poly.points || !poly.points[target.pointIdx]) return target;
        
        const pt = poly.points[target.pointIdx];
        const polyX = poly.left! + pt.x * (poly.scaleX || 1);
        const polyY = poly.top! + pt.y * (poly.scaleY || 1);
        
        return {
          ...target,
          x: polyX,
          y: polyY
        };
      })
    );
  };

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

  const anchorWrapper = useCallback(
    (
      anchorIndex: number,
      fn: (
        eventData: fabric.TPointerEvent,
        transform: fabric.Transform,
        x: number,
        y: number
      ) => boolean,
      canvas: fabric.Canvas
    ) => {
      return function (
        eventData: fabric.TPointerEvent,
        transform: fabric.Transform,
        x: number,
        y: number
      ) {
        const fabricObject = transform.target as fabric.Polygon;
        if (
          fabricObject &&
          fabricObject.points &&
          fabricObject.points[anchorIndex]
        ) {
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
    },
    []
  );

  const actionHandlers = function (
    _eventData: fabric.TPointerEvent,
    _transform: fabric.Transform,
    _x: number,
    _y: number
  ): boolean {
    return true; // You can set more conditions here if needed
  };


  // Create the polygon with annotation points
  useEffect(() => {
    const canvas = fabricCanvasRef.current.getFabricCanvas();
    if (!canvas) return;


    // Remove all polygons before adding new ones
//  canvas.getObjects("polygon").forEach((obj: fabric.Object) => canvas.remove(obj));

    if (selectedSegments && selectedSegments.length > 0) {
      selectedSegments.forEach((selectedSegment: SegmentModal, index: number) => {
        if (
          selectedSegment &&
          Array.isArray(selectedSegment.annotation_points_float) &&
          selectedSegment.annotation_points_float.length > 0 &&
          Array.isArray(selectedSegment.segment_bb_float) &&
          selectedSegment.segment_bb_float.length > 0 &&
          selectedSegment.short_title
        ) {
          const { width: canvasWidth, height: canvasHeight } = canvas;
          const ratioWidth = canvasWidth / aiTrainImageWidth;
          const ratioHeight = canvasHeight / aiTrainImageHeight;
          const points: PointModel[] = [];
          for (let i = 0; i < selectedSegment.annotation_points_float.length; i += 2) {
            points.push({
              x: selectedSegment.annotation_points_float[i] * ratioWidth,
              y: selectedSegment.annotation_points_float[i + 1] * ratioHeight,
            });
          }

          // check the polygon with same name exists
          const existingPolygon = canvas.getObjects().find((obj: fabric.Object) => 
            (obj as NamedFabricObject).name === `edit-${selectedSegment.short_title}`
          );
          if(!existingPolygon){

          const polygon = new fabric.Polygon(points, {
            left: selectedSegment.segment_bb_float[0] * ratioWidth,
            top: selectedSegment.segment_bb_float[1] * ratioHeight,
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
            cornerStrokeColor: "rgb(7 239 253)",
          }) as fabric.Polygon;

          // Attach per-point controls
          polygon.controls = polygon.points?.reduce((acc, _point, index) => {
            const controlKey = `p${index}`;
            acc[controlKey] = new fabric.Control({
              cursorStyle: "pointer",
              positionHandler: polygonPositionHandler.bind({ pointIndex: index }),
              actionHandler: anchorWrapper(index, actionHandlers, canvas).bind({ pointIndex: index }),
              actionName: "modifyPolygon",
            });
            return acc;
          }, {} as { [key: string]: fabric.Control }) ?? {};
          (polygon as NamedFabricObject).name = `edit-${selectedSegment.short_title}`;

          canvas.add(polygon);
          canvas.setActiveObject(polygon);
        }
        }
      });
      canvas.requestRenderAll();
    }

    // --- Mouse events for dragging annotation points ---
    // Store all polygons and pointIdxs that are being dragged
    const handleMouseDown = (opt:  fabric.TPointerEventInfo) => {
       console.log("handleMouseDown"); 
       
      // Remove hover circle on mouse down
      const existingHoverCircle = canvas.getObjects().find((obj: fabric.Object) => 
        (obj as any).name === 'hover-circle'
      );
      if (existingHoverCircle) {
        canvas.remove(existingHoverCircle);
      }
       
      const pointer = opt.pointer;
      
      
      const polygons = canvas.getObjects("polygon") as fabric.Polygon[];
// console.log("canvas name", polygons.map(p => (p as NamedFabricObject).name));
//       console.log("polygons", polygons);
      let dragTargets: { poly: fabric.Polygon; pointIdx: number }[] = [];
      
      for (const poly of polygons) {
        if (!poly.visible) continue;
        if (!poly.points) continue;
        for (let i = 0; i < poly.points.length; i++) {
      
          const pt = poly.points[i];
          const polyX = poly.left! + pt.x * (poly.scaleX || 1);
          const polyY = poly.top! + pt.y * (poly.scaleY || 1);
          if (
            Math.abs(pointer.x - polyX) < 10 &&
            Math.abs(pointer.y - polyY) < 10
          ) {
            dragTargets.push({ poly, pointIdx: i });
            
            // Add to acquired targets when a target is successfully grabbed
            const targetExists = acquiredTargets.some(target => 
              target.poly === poly && target.pointIdx === i
            );
            
            if (!targetExists) {
              setAcquiredTargets(prev => [...prev, {
                poly,
                pointIdx: i,
                x: polyX,
                y: polyY
              }]);
            }
            
            // Set active object to the polygon being dragged
            canvas.setActiveObject(poly);
            // Don't break, allow multiple segments to be selected if points overlap
          }
        }
      }
     
      if (dragTargets.length > 0) {
        console.log("Starting drag on targets", dragTargets);
        setDragInfo(dragTargets);
      } else {
        setDragInfo(null);
      }
    };

    // --- Double click event for point deletion and insertion ---
    const handleDoubleClick = (opt: any) => {
      const pointer = opt.pointer;
      const polygons = canvas.getObjects("polygon") as fabric.Polygon[];

      // Track which segments were modified during double-click
      const modifiedInDoubleClick = new Set<string>();

      // Delete/add points for all selected polygons
      for (const poly of polygons) {
        if (!poly.visible || !poly.points) continue;
        
        const polyName = (poly as NamedFabricObject).name;
        let segmentModified = false;
        
        // Check if double-clicking on an existing point (delete point)
        for (let i = 0; i < poly.points.length; i++) {
          const pt = poly.points[i];
          const polyX = poly.left! + pt.x * (poly.scaleX || 1);
          const polyY = poly.top! + pt.y * (poly.scaleY || 1);
          if (
            Math.abs(pointer.x - polyX) < 10 &&
            Math.abs(pointer.y - polyY) < 10
          ) {
            // Delete point if polygon has more than 3 points
            if (poly.points.length > 3) {
              poly.points.splice(i, 1);
              recreatePolygonWithControls(poly, canvas);
              canvas.requestRenderAll();
              segmentModified = true;
             // console.log(`Deleted point ${i} from segment: ${polyName}`);
            }
            // Don't return, apply to all selected polygons
          }
        }
        
        // Check if double-clicking on polygon edge (add point between two existing points)
        if (!segmentModified) {
          for (let i = 0; i < poly.points.length; i++) {
            const currentPt = poly.points[i];
            const nextPt = poly.points[(i + 1) % poly.points.length];
            const currentX = poly.left! + currentPt.x * (poly.scaleX || 1);
            const currentY = poly.top! + currentPt.y * (poly.scaleY || 1);
            const nextX = poly.left! + nextPt.x * (poly.scaleX || 1);
            const nextY = poly.top! + nextPt.y * (poly.scaleY || 1);
            // Calculate distance from pointer to line segment
            const distance = getDistanceToLineSegment(
              pointer.x,
              pointer.y,
              currentX,
              currentY,
              nextX,
              nextY
            );
            if (distance < 8) {
              // 8px tolerance for edge detection
              const localX = (pointer.x - poly.left!) / (poly.scaleX || 1);
              const localY = (pointer.y - poly.top!) / (poly.scaleY || 1);
              poly.points.splice(i + 1, 0, new fabric.Point(localX, localY));
              recreatePolygonWithControls(poly, canvas);
              canvas.requestRenderAll();
              segmentModified = true;
              //console.log(`Added point after index ${i} to segment: ${polyName}`);
              break;
            }
          }
        }
        
        // Track modified segment
        if (segmentModified && polyName) {
          modifiedInDoubleClick.add(polyName);
        }
      }
      
      // Update modified segments in Redux
      if (modifiedInDoubleClick.size > 0) {
       // console.log('Double-click operation completed. Modified segments:', Array.from(modifiedInDoubleClick));
        
        // Update Redux after double-click modifications
        handleUpdatePolygonInRedux(canvas);
      }
    };

    // Helper function to calculate distance from point to line segment
    const getDistanceToLineSegment = (
      px: number,
      py: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ): number => {
      const A = px - x1;
      const B = py - y1;
      const C = x2 - x1;
      const D = y2 - y1;

      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      let param = -1;
      if (lenSq !== 0) {
        param = dot / lenSq;
      }

      let xx, yy;
      if (param < 0) {
        xx = x1;
        yy = y1;
      } else if (param > 1) {
        xx = x2;
        yy = y2;
      } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
      }

      const dx = px - xx;
      const dy = py - yy;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // Helper function to recreate polygon with updated controls
    const recreatePolygonWithControls = (
      oldPoly: fabric.Polygon,
      canvas: fabric.Canvas
    ) => {
      if (!oldPoly.points) return;

      // Create new polygon with updated points
      const newPolygon = new fabric.Polygon(oldPoly.points, {
        left: oldPoly.left,
        top: oldPoly.top,
        fill: oldPoly.fill,
        strokeWidth: oldPoly.strokeWidth,
        stroke: oldPoly.stroke,
        scaleX: oldPoly.scaleX,
        scaleY: oldPoly.scaleY,
        objectCaching: false,
        transparentCorners: false,
        selectable: false,
        hasControls: true,
        hasBorders: false,
        cornerStyle: "circle",
        cornerColor: "rgb(255 1 154)",
        cornerSize: 7,
        cornerStrokeColor: "rgb(7 239 253)",
      }) as fabric.Polygon;

      // Attach per-point controls for the new polygon
      newPolygon.controls = {
        ...newPolygon.points?.reduce((acc, _point, index) => {
          const controlKey = `p${index}`;
          acc[controlKey] = new fabric.Control({
            cursorStyle: "pointer",
            positionHandler: polygonPositionHandler.bind({ pointIndex: index }),
            actionHandler: anchorWrapper(index, actionHandlers, canvas).bind({
              pointIndex: index,
            }),
            actionName: "modifyPolygon",
          });
          return acc;
        }, {} as { [key: string]: fabric.Control }),
      };

      // Remove old polygon and add new one
      canvas.remove(oldPoly);
      canvas.add(newPolygon);
      canvas.setActiveObject(newPolygon);
    };

    const handleMouseMove = (opt:any) => {
      const canvas = fabricCanvasRef.current.getFabricCanvas();
      if (!canvas) return;

      const pointer = opt.pointer;
  
      // Update acquired target positions first
      updateAcquiredTargetPositions(canvas);
      
      // Check if mouse is near any acquired targets
      const isNearAcquiredTarget = checkMouseNearAcquiredTargets(pointer.x, pointer.y);
      setIsCanvasActiveNearTarget(isNearAcquiredTarget);
      
      // If mouse is near an acquired target, keep the canvas active and maintain active object
      if (isNearAcquiredTarget) {
        const nearbyTarget = acquiredTargets.find(target => {
          const distance = Math.sqrt(
            Math.pow(pointer.x - target.x, 2) + Math.pow(pointer.y - target.y, 2)
          );
          return distance <= NEARBY_THRESHOLD;
        });
        
        if (nearbyTarget) {
          canvas.setActiveObject(nearbyTarget.poly);
          
          // Show special indicator for nearby acquired target
          const nearbyIndicator = createHoverCircle(nearbyTarget.x, nearbyTarget.y, true);
          (nearbyIndicator as any).name = 'nearby-target-indicator';
          canvas.add(nearbyIndicator);
          canvas.bringToFront(nearbyIndicator);
          
        }
      } else {
        // Remove nearby target indicator if mouse is not near any acquired targets
        const existingNearbyIndicator = canvas.getObjects().find((obj: fabric.Object) => 
          (obj as any).name === 'nearby-target-indicator'
        );
        if (existingNearbyIndicator) {
          canvas.remove(existingNearbyIndicator);
        }
      }
     
      if(opt.target && !isNearAcquiredTarget){
    
        canvas.setActiveObject(opt.target);
      }
      
      // Remove existing hover circles and indicators
      const existingHoverCircle = canvas.getObjects().find((obj: fabric.Object) => 
        (obj as any).name === 'hover-circle'
      );
      if (existingHoverCircle) {
        canvas.remove(existingHoverCircle);
      }

      // If dragging, continue drag logic
      if (dragInfo && dragInfo.length > 0) {
        (dragInfo as Array<{ poly: fabric.Polygon; pointIdx: number }>).forEach(({ poly, pointIdx }) => {
          const px = (pointer.x - poly.left!) / (poly.scaleX || 1);
          const py = (pointer.y - poly.top!) / (poly.scaleY || 1);
          poly.points![pointIdx] = new fabric.Point(px, py);
          poly.setCoords();
          
          // Track which segment was modified
          const polyName = (poly as NamedFabricObject).name;
          if (polyName) {
            setModifiedSegments(prev => new Set(prev).add(polyName));
            // console.log(`Modified segment: ${polyName}, point index: ${pointIdx}`);
          }
        });
        canvas.requestRenderAll();
        
        // Update acquired target positions after dragging
        updateAcquiredTargetPositions(canvas);
        
        return;
      }

      // Check for hover over polygon points
      const polygons = canvas.getObjects("polygon") as fabric.Polygon[];
      let foundHoverPoint = false;

      for (const poly of polygons) {
        if (!poly.visible || !poly.points) continue;
        
        for (let i = 0; i < poly.points.length; i++) {
          const pt = poly.points[i];
          const polyX = poly.left! + pt.x * (poly.scaleX || 1);
          const polyY = poly.top! + pt.y * (poly.scaleY || 1);
          
          if (
            Math.abs(pointer.x - polyX) < 10 &&
            Math.abs(pointer.y - polyY) < 10
          ) {
            // Create hover circle
            const hoverCircle = createHoverCircle(polyX, polyY);
            (hoverCircle as any).name = 'hover-circle';
            canvas.add(hoverCircle);
            canvas.bringToFront(hoverCircle);
            
            setHoverPoint({ poly, pointIdx: i });
            foundHoverPoint = true;
            break;
          }
        }
        if (foundHoverPoint) break;
      }

      if (!foundHoverPoint) {
        setHoverPoint(null);
      }

      canvas.requestRenderAll();
    };
    
    const handleMouseUp = () => {
      // Remove hover circle on mouse up
       console.log('Drag operation completed. Modified segments:')
      handleUpdatePolygonInRedux(canvas);
   
      // Remove nearby target indicator on mouse up
      const existingNearbyIndicator = canvas.getObjects().find((obj: fabric.Object) => 
        (obj as any).name === 'nearby-target-indicator'
      );
      if (existingNearbyIndicator) {
        canvas.remove(existingNearbyIndicator);
      }
      
      // Process modified segments before clearing drag info
      if (dragInfo ) {
       console.log('Drag operation completed. Modified segments:')
        
        // Update each modified segment in Redux when drag is complete
        handleUpdatePolygonInRedux(canvas);
        
        // Clear modified segments tracking
        setModifiedSegments(new Set());
      }
      
      setDragInfo(null);
      canvas.requestRenderAll();
    };

    const handleMouseLeave = () => {
      // Clean up all indicators when mouse leaves canvas
      const indicatorsToRemove = canvas.getObjects().filter((obj: fabric.Object) => 
        (obj as any).name === 'hover-circle' || (obj as any).name === 'nearby-target-indicator'
      );
      
      indicatorsToRemove.forEach((indicator: fabric.Object) => canvas.remove(indicator));
      
      setIsCanvasActiveNearTarget(false);
      setHoverPoint(null);
      canvas.requestRenderAll();
    };
  // ...existing code...

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);
    canvas.on("mouse:dblclick", handleDoubleClick);
    canvas.on("mouse:out", handleMouseLeave);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
      canvas.off("mouse:dblclick", handleDoubleClick);
      canvas.off("mouse:out", handleMouseLeave);
    };
  }, [fabricCanvasRef, selectedSegments, anchorWrapper, dragInfo, acquiredTargets, modifiedSegments]);

  // handle update polygon point into redux
  const handleUpdatePolygonInRedux = (canvas: fabric.Canvas) => {
    const pol = canvas.getActiveObject() as (fabric.Polygon & NamedFabricObject) | null;
    const canvasWidth = canvas.width || 1;
    const canvasHeight = canvas.height || 1;
    if (pol && pol.points) {
      const ratioWidth = aiTrainImageWidth / canvasWidth;
      const ratioHeight = aiTrainImageHeight / canvasHeight;
      
      // Calculate absolute coordinates of polygon points
      const updatedPoints = pol.points.map((pt) => ({
        x: ((pt.x * ratioWidth)),
        y: ((pt.y * ratioHeight)),
      }));
      
      const polygonNumberArray = updatedPoints.flatMap((point) => [
        Number(point.x.toFixed(2)),
        Number(point.y.toFixed(2)),
      ]);

       const getMinMax = getMinMaxBBPoint(polygonNumberArray);
       const segmentTitle = pol?.name?.replace('edit-', '') || '';
       const segmentId = selectedSegments?.find(seg => seg.short_title === segmentTitle)?.id;
        if (!segmentId) {
      console.warn(`Segment not found for title: ${segmentTitle}`);
      return;
    }
    const data={
      id: segmentId,
      annotation: polygonNumberArray,
      bb: getMinMax
    }
    dispatch(updateEditSelectedSegment(data));
    console.log("Updating segment in Redux with data:", data);

    }

  };

    const getMinMaxBBPoint = (points: number[]): number[] => {
      const xValues = points.filter((_, index) => index % 2 === 0);
      const yValues = points.filter((_, index) => index % 2 === 1);
      return [
        Math.min(...xValues), // min x
        Math.min(...yValues), // min y
        Math.max(...xValues), // max x
        Math.max(...yValues), // max y
      ];
    };

  const handleResetCanvas = () => {
  const canvas = fabricCanvasRef.current.getFabricCanvas();
    if (!canvas) return;

    // Clear acquired targets when canvas is reset
    setAcquiredTargets([]);
    setIsCanvasActiveNearTarget(false);
    
    // Clear modified segments tracking
    setModifiedSegments(new Set());

    // clear edit group
        
            canvas.getObjects().forEach((obj: fabric.Object) => {
              if ((obj as NamedFabricObject).name?.startsWith('edit-')) {
                canvas.remove(obj);
              }
            });
              canvas.requestRenderAll();
          
        }

  // clear the canvas
  useEffect(() => {
    if (clearUpdateCanvas && fabricCanvasRef.current) {
       dispatch(updateClearEditCanvas(false));
      handleResetCanvas();

    }
  }, [clearUpdateCanvas, fabricCanvasRef]);


  // const handleSaveAnnotation = () => {
  //   const canvas = fabricCanvasRef.current;
  //   if (canvas) {
  //         const ratioWidth = aiTrainImageWidth / (canvas.width);
  //   const ratioHeight = aiTrainImageHeight / (canvas.height);
  //     const poly = canvas.getActiveObject() as fabric.Polygon | null;
  //     if (poly && poly.points) {
  //       const updatedPoints = poly.points.map((pt) => ({ x: pt.x*ratioWidth, y: pt.y*ratioHeight }));
  //       const polygonNumberArray = updatedPoints.flatMap((point) => [
  //         Number(point.x.toFixed(2)),
  //         Number(point.y.toFixed(2)),
  //       ]);
  //       const getMinMax = getMinMaxBBPoint(polygonNumberArray);

  //       const data: SegmentModal = {
  //         id: selectedSegment?.id || 0,
  //         job_id: selectedSegment?.job_id || 0,
  //         title: selectedSegment?.title || "",
  //         short_title: selectedSegment?.short_title || "",
  //         group_name_user: selectedSegment?.group_name_user || "",
  //         group_desc: selectedSegment?.group_desc || "",
  //         segment_type: selectedSegment?.segment_type || "",
  //         annotation_points_float: polygonNumberArray,
  //         segment_bb_float: getMinMax,
  //         annotation_type: selectedSegment?.annotation_type || "",
  //         seg_perimeter: selectedSegment?.seg_perimeter || 0,
  //         seg_area_sqmt: selectedSegment?.seg_area_sqmt || 0,
  //         seg_skewx: selectedSegment?.seg_skewx || 0,
  //         seg_skewy: selectedSegment?.seg_skewy || 0,
  //         created_at: selectedSegment?.created_at || new Date().toISOString(),
  //         updated_at: new Date().toISOString(),
  //         group_label_system: selectedSegment?.group_label_system || "",
  //       };
  //       updateSegment(data);
  //     }
  //   }
  // };

  const updateSegment = async (segData: SegmentModal) => {
    try {
      const response = await dispatch(updateSegmentById(segData)).unwrap();
      dispatch(updateAddSegMessage(" Updating segment details..."));
      if (response && response.success) {
        // update into master Array
        dispatch(updateAddSegMessage(null));
        handleResetCanvas();
        // update all Segments Array
        
        // update master array
        dispatch(addNewSegmentToMasterArray(segData));
        dispatch(updateAddSegMessage(null));
        dispatch(setCanvasType("hover"));
      }
    } catch (error) {
      console.error("Error updating segment:", error);
      toast.error("Failed to update segment.");
    }
  };

  const handleCancelAnnotation = () => {
    dispatch(setCanvasType("hover"));
  };
  return null;
  
};

export default CanvasEdit;
