import * as fabric from "fabric";
import { isPointInPolygon } from "../ISPointInsidePolygon";

// Custom type for objects with a data property containing a name
type NamedFabricObject = fabric.Object & {
  name?: string;
  groupName?: string;
  subGroupName?: string;
  isActived?: boolean;
};

export const handlePolygonVisibilityTest = (
  canvas: React.RefObject<fabric.Canvas>,
  // name: string,
  pointer: fabric.Point,
  isShowSegmentName: boolean
) => {
  HideAllSegments(canvas);

  if (!canvas.current) return; // Ensure canvas is defined

  const allObjects = canvas.current.getObjects();
  // console.log("allObjects", allObjects);
  allObjects.forEach((obj: NamedFabricObject) => {
    if (
      obj.type === "group" &&
      obj.groupName === "hover" &&
      typeof (obj as fabric.Group).getObjects === "function"
    ) {
      const allGroupObjects = (obj as fabric.Group).getObjects();
      // Find polygon/path and text objects in the group
      let polygonObj: fabric.Polygon | undefined = undefined;
      let pathObj: fabric.Path | undefined = undefined;
      let textObj: fabric.Text | undefined = undefined;
      let namedObj: NamedFabricObject | undefined = undefined;
      allGroupObjects.forEach((groupObj) => {
        if (groupObj instanceof fabric.Polygon) {
          polygonObj = groupObj as fabric.Polygon;
          namedObj = groupObj as NamedFabricObject;
        } else if (groupObj instanceof fabric.Path) {
          pathObj = groupObj as fabric.Path;
          namedObj = groupObj as NamedFabricObject;
        } else if (groupObj instanceof fabric.Text) {
          textObj = groupObj as fabric.Text;
        }
      });

      if (polygonObj) {
        const vertices = (polygonObj as fabric.Polygon).points;
        const checkvalue = isPointInPolygon(pointer, vertices || []);
        // console.log("checkvalue", checkvalue, pointer);
        if (checkvalue) {
          if (namedObj)
            (namedObj as fabric.Object).set({
              visible: true,
              opacity: 0.4,
            });
          if (textObj && isShowSegmentName) (textObj as fabric.Object).set({ visible: true });
        }
      }
      // Check path
      else if (pathObj) {
        const pathData = (pathObj as fabric.Path).path;
        const pathPoints = getPathPoints(pathData);
        const checkvalue = isPointInPolygon(pointer, pathPoints || []);
        if (checkvalue) {
          if (namedObj)
            (namedObj as fabric.Object).set({
              visible: true,
              opacity: 0.4,
            });
          if (textObj) (textObj as fabric.Object).set({ visible: true });
        }
      } else {
       // console.log("No polygon or path found in group:", obj);
        HideAllSegments(canvas);
      }
    }
  });
  canvas.current.renderAll();
  // }
};

export const HideAllSegments = (canvas: React.RefObject<fabric.Canvas>) => {
  if (!canvas.current) return;
  console.log("HideAllSegments called");
  const allObjects = canvas.current.getObjects();
  allObjects.forEach((obj:NamedFabricObject) => {
    if (
      obj.type === "group" &&
      obj.groupName === "hover" &&
      typeof (obj as fabric.Group).getObjects === "function"
    ) {
      const allGroupObjects = (obj as fabric.Group).getObjects();
      allGroupObjects.forEach((groupObj) => {
        const namedGroupObj = groupObj as NamedFabricObject;
        (namedGroupObj as fabric.Object).set({ visible: false });
      });
    }
  });
  canvas.current.renderAll();
};

export function getPathPoints(path: any[]): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  path.forEach((cmd) => {
    if ((cmd[0] === "M" || cmd[0] === "L") && cmd.length >= 3) {
      points.push({ x: cmd[1], y: cmd[2] });
    }
  });
  return points;
}

export const handlePolygonVisibilityOnMouseMove = (
  canvas: React.RefObject<fabric.Canvas>,
  name: string
) => {
  // HideAllSegments(canvas);
  if (name) {
    if (!canvas.current) return; // Ensure canvas is defined

    const targetName = name;

    const allObjects = canvas.current.getObjects();
    allObjects.forEach((obj) => {
      if (
        obj.type === "group" &&
        typeof (obj as fabric.Group).getObjects === "function"
      ) {
        const allGroupObjects = (obj as fabric.Group).getObjects();
        allGroupObjects.forEach((groupObj) => {
          const namedGroupObj = groupObj as NamedFabricObject;
          const polyName = namedGroupObj.name;

          if (polyName === targetName) {
            namedGroupObj.set({ visible: true });
          }
        });
      }
    });
    canvas.current.renderAll();
  }
};

export const ShowOutline = (
  canvasRef: React.RefObject<any>,
  activeType: string,
  isDemo: boolean
) => {
  // Get the fabric canvas from CanavasImage
  const fabricCanvas = isDemo?canvasRef.current:canvasRef.current?.getFabricCanvas();
  if (!fabricCanvas) return;
  HideAll(canvasRef, isDemo);
  const allObjects = fabricCanvas.getObjects();
  allObjects.forEach((obj: NamedFabricObject) => {
    if (
      obj.type === "group" &&
      obj.groupName === activeType &&
      typeof (obj as fabric.Group).getObjects === "function"
    ) {
      const allGroupObjects = (obj as fabric.Group).getObjects();
      allGroupObjects.forEach((groupObj) => {
        if (
          groupObj instanceof fabric.Polygon ||
          groupObj instanceof fabric.Path
        ) {
          const namedObj = groupObj as NamedFabricObject;
          const originalStroke =
            (namedObj as any).originalStroke || namedObj.stroke || "#FF1493";

          (namedObj as fabric.Object).set({
            visible: true,
            fill: activeType === "outline" ? "transparent" : originalStroke,
            opacity: 0.9,
          });
        } else if (
          groupObj instanceof fabric.Text &&
          activeType === "outline"
        ) {
          (groupObj as fabric.Object).set({ visible: true });
        }
      });
    }
  });
  fabricCanvas.renderAll();
};

export const HideAll = (canvasRef: React.RefObject<any>, isDemo: boolean) => {
  const fabricCanvas = isDemo ? canvasRef.current : canvasRef.current?.getFabricCanvas();
  if (!fabricCanvas) return;
  const allObjects = fabricCanvas.getObjects();
  allObjects.forEach((obj: any) => {
    if (
      obj.type === "group" &&
      typeof (obj as fabric.Group).getObjects === "function"
    ) {
      const allGroupObjects = (obj as fabric.Group).getObjects();
      allGroupObjects.forEach((groupObj) => {
        if (groupObj instanceof fabric.Object) {
          groupObj.set({ visible: false });
        }
      });
    }
  });
  fabricCanvas.renderAll();
};

export const hideMaskSegment = (
  canvas: React.RefObject<fabric.Canvas>,
  pointer: fabric.Point
): boolean => {
  if (!canvas.current) return false;

  const allObjects = canvas.current.getObjects();
  let returnValue: boolean = false;
  allObjects.forEach((obj: NamedFabricObject) => {
    if (
      obj.type === "group" &&
      obj.groupName === "mask" &&
      typeof (obj as fabric.Group).getObjects === "function"
    ) {
      const allGroupObjects = (obj as fabric.Group).getObjects();
      let polygonObj: fabric.Polygon | undefined = undefined;
      let pathObj: fabric.Path | undefined = undefined;

      let namedObj: NamedFabricObject | undefined = undefined;
      allGroupObjects.forEach((groupObj) => {
        if (groupObj instanceof fabric.Polygon) {
          polygonObj = groupObj as fabric.Polygon;
          namedObj = groupObj as NamedFabricObject;
        } else if (groupObj instanceof fabric.Path) {
          pathObj = groupObj as fabric.Path;
          namedObj = groupObj as NamedFabricObject;
        }
      });

      if (polygonObj) {
        const vertices = (polygonObj as fabric.Polygon).points;
        const checkvalue = isPointInPolygon(pointer, vertices || []);
        // console.log("checkvalue", checkvalue, pointer);
        if (checkvalue) {
          if (namedObj)
            (namedObj as fabric.Object).set({
              visible: false,
            });

          returnValue = true;
        }
      }
      // Check path
      else if (pathObj) {
        const pathData = (pathObj as fabric.Path).path;
        const pathPoints = getPathPoints(pathData);
        const checkvalue = isPointInPolygon(pointer, pathPoints || []);
        if (checkvalue) {
          if (namedObj)
            (namedObj as fabric.Object).set({
              visible: false,
            });

          returnValue = true;
        }
      }
    }
  });
  canvas.current.renderAll();
  return returnValue;
};

export const hoverOutline = (
  canvas: React.RefObject<fabric.Canvas>,
  pointer: fabric.Point
) => {
  if (!canvas.current) return;
  hideFillOutline(canvas);
  const allObjects = canvas.current.getObjects();
  allObjects.forEach((obj: NamedFabricObject) => {
    if (
      obj.type === "group" &&
      obj.groupName === "outline" &&
      typeof (obj as fabric.Group).getObjects === "function"
    ) {
      const allGroupObjects = (obj as fabric.Group).getObjects();
      let polygonObj: fabric.Polygon | undefined = undefined;
      let pathObj: fabric.Path | undefined = undefined;

      let namedObj: NamedFabricObject | undefined = undefined;
      allGroupObjects.forEach((groupObj) => {
        if (groupObj instanceof fabric.Polygon) {
          polygonObj = groupObj as fabric.Polygon;
          namedObj = groupObj as NamedFabricObject;
        } else if (groupObj instanceof fabric.Path) {
          pathObj = groupObj as fabric.Path;
          namedObj = groupObj as NamedFabricObject;
        }
      });

      if (polygonObj) {
        const vertices = (polygonObj as fabric.Polygon).points;

        const checkvalue = isPointInPolygon(pointer, vertices || []);
        // console.log("checkvalue", checkvalue, pointer);
        if (checkvalue) {
          if (namedObj) {
            const objName = polygonObj as NamedFabricObject;

            const segName = objName.name;
            const originalStroke =
              (objName as any).originalStroke || objName.stroke || "#FF1493";

            (namedObj as fabric.Object).set({
              visible: true,
              fill: originalStroke,
            });
          }
        }
      }
      // Check path
      else if (pathObj) {
        const pathData = (pathObj as fabric.Path).path;

        const pathPoints = getPathPoints(pathData);
        const checkvalue = isPointInPolygon(pointer, pathPoints || []);
        if (checkvalue) {
          if (namedObj) {
            const objName = pathObj as NamedFabricObject;
            const segName = objName.name;

            const originalStroke =
              (objName as any).originalStroke || objName.stroke || "#FF1493";
            (namedObj as fabric.Object).set({
              visible: true,
              fill: originalStroke,
            });
          }
        }
      }
    }
  });
  canvas.current.renderAll();
};

export const hideFillOutline=(
  canvas: React.RefObject<fabric.Canvas>,
) => {
  if (!canvas.current) return;

  const allObjects = canvas.current.getObjects();
  allObjects.forEach((obj: NamedFabricObject) => {
    if (
      obj.type === "group" &&
      obj.groupName === "outline" &&
      typeof (obj as fabric.Group).getObjects === "function"
    ) {
      const allGroupObjects = (obj as fabric.Group).getObjects();
      allGroupObjects.forEach((groupObj) => {
        if (groupObj instanceof fabric.Path) {
          (groupObj as fabric.Path).set({
            fill: "transparent",
          });
        }
        if (groupObj instanceof fabric.Polygon) {
          (groupObj as fabric.Polygon).set({
            fill: "transparent",
          });
        }
      });
    }
  });
  canvas.current.renderAll();
};

/**
 * Helper function to find all matching polygon/path objects that contain the given pointer
 * @param allObjects - Array of all fabric objects on the canvas
 * @param pointer - The point to check against polygons/paths
 * @returns Array of matching NamedFabricObject instances
 */
const findMatchingPolygonObjects = (
  allObjects: fabric.Object[],
  pointer: fabric.Point
): NamedFabricObject[] => {
  const matchingObjects: NamedFabricObject[] = [];

  allObjects.forEach((obj: NamedFabricObject) => {
    if (
      obj.type === "group" &&
      obj.groupName === "hover" &&
      typeof (obj as fabric.Group).getObjects === "function"
    ) {
      const allGroupObjects = (obj as fabric.Group).getObjects();

      let polygonObj: fabric.Polygon | undefined = undefined;
      let pathObj: fabric.Path | undefined = undefined;
      let namedObj: NamedFabricObject | undefined = undefined;

      allGroupObjects.forEach((groupObj) => {
        if (groupObj instanceof fabric.Polygon) {
          polygonObj = groupObj as fabric.Polygon;
          namedObj = groupObj as NamedFabricObject;
        } else if (groupObj instanceof fabric.Path) {
          pathObj = groupObj as fabric.Path;
          namedObj = groupObj as NamedFabricObject;
        }
      });

      // Check polygon
      if (polygonObj) {
        const vertices = (polygonObj as fabric.Polygon).points;
        const checkvalue = isPointInPolygon(pointer, vertices || []);
        if (checkvalue && namedObj) {
          matchingObjects.push(namedObj);
        }
      }
      // Check path
      else if (pathObj) {
        const pathData = (pathObj as fabric.Path).path;
        const pathPoints = getPathPoints(pathData);
        const checkvalue = isPointInPolygon(pointer, pathPoints || []);
        if (checkvalue && namedObj) {
          matchingObjects.push(namedObj);
        }
      }
    }
  });

  return matchingObjects;
};

export const handlePolygonfind = (
  canvas: React.RefObject<fabric.Canvas> | React.RefObject<any>,
  pointer: fabric.Point,

) => {
  if (!canvas.current) return; // Ensure canvas is defined

  const allObjects = canvas.current.getObjects();
  const matchingObjects = findMatchingPolygonObjects(allObjects, pointer);

  // If we have multiple matches, return the one with the smallest area (most specific)
  if (matchingObjects.length > 0) {

    const smallestObject = matchingObjects.reduce((smallest, current) => {
      const smallestArea = getPolygonArea(smallest);
      const currentArea = getPolygonArea(current);
      return currentArea < smallestArea ? current : smallest;
    });


    canvas.current.renderAll();
    return smallestObject;
  }

  canvas.current.renderAll();
  return undefined;
};

export const handlePolygonlieInPolygon = (
  canvas: React.RefObject<fabric.Canvas> | React.RefObject<any>,
  pointer: fabric.Point,

) => {
  if (!canvas.current) return; // Ensure canvas is defined

  const allObjects = canvas.current.getObjects();
  const matchingObjects = findMatchingPolygonObjects(allObjects, pointer);
  console.log("matchingObjects", matchingObjects)
  // If we have multiple matches, return the one with the smallest area (most specific)
  if (matchingObjects.length > 1) {


    return true
  }

  return false;
};
;

// Helper function to calculate polygon area
export const getPolygonArea = (obj: NamedFabricObject): number => {
  if (obj instanceof fabric.Polygon) {
    const polygon = obj as fabric.Polygon;
    const points = polygon.points;
    if (points) {
      let area = 0;
      for (let i = 0; i < points.length; i++) {
        const j = (i + 1) % points.length;
        area += points[i].x * points[j].y;
        area -= points[j].x * points[i].y;
      }
      return Math.abs(area / 2);
    }
  } else if (obj instanceof fabric.Path) {
    // For paths, use bounding box area as approximation
    const path = obj as fabric.Path;
    const bounds = path.getBoundingRect();
    return bounds.width * bounds.height;
  }
  return Infinity; // Default to largest if we can't calculate
}

/**
 * Reset canvas zoom to 1 and restore original viewport transform
 * @param canvasRef - Reference to the fabric canvas
 * @param isDemo - Whether this is a demo canvas
 */
export const ResetCanvas = (
  canvasRef: React.RefObject<any>,
  isDemo: boolean
) => {
  const fabricCanvas = isDemo ? canvasRef.current : canvasRef.current?.getFabricCanvas();
  if (!fabricCanvas) return;

  // Reset zoom to 1
  fabricCanvas.setZoom(1);

  // Reset viewport transform to identity matrix (no pan/zoom)
  fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

  // Render the canvas to apply changes
  fabricCanvas.requestRenderAll();
}