import * as fabric from "fabric";
import { isPointInPolygon } from "./ISPointInsidePolygon";

// Custom type for objects with a data property containing a name
type NamedFabricObject = fabric.Object & { name?: string };


export const handlePolygonVisibilityTest = (
  canvas: React.RefObject<fabric.Canvas>,
  name: string,
  pointer: fabric.Point
) => {
  HideAllSegments(canvas);
  // console.log("handlePolygonVisibilityTest name", name);
  if (name) {
    if (!canvas.current) return; // Ensure canvas is defined

    const allObjects = canvas.current.getObjects();
    allObjects.forEach((obj) => {
      if (
        obj.type === "group" &&
        typeof (obj as fabric.Group).getObjects === "function"
      ) {
        const allGroupObjects = (obj as fabric.Group).getObjects();
        // console.log(" allGroupObjects", allGroupObjects[0]);
        allGroupObjects.forEach((groupObj) => {
          const namedGroupObj = groupObj as NamedFabricObject;
          const currentPoly = groupObj as fabric.Polygon;
          const currentPath = groupObj as fabric.Path;

          if (currentPoly instanceof fabric.Polygon) {
            const vertices = currentPoly.get("points");
            const checkvalue = isPointInPolygon(pointer, vertices || []);
            if (checkvalue) {
            
              const polyName = (currentPoly as NamedFabricObject).name;
         
              namedGroupObj.set({ visible: true });
            }
          }else if (currentPath instanceof fabric.Path) {
            const pathData = currentPath.get("path");
              const pathPoints = getPathPoints(pathData);
            const checkvalue = isPointInPolygon(pointer, pathPoints || []);
        
            if (checkvalue) {
              const polyName = (currentPath as NamedFabricObject).name;
              console.log(" polyName", polyName);
              namedGroupObj.set({ visible: true });
            }
          }
        });
      }
    });
    canvas.current.renderAll();
  }
};

export const HideAllSegments = (canvas: React.RefObject<fabric.Canvas>) => {
  if (!canvas.current) return;

  const allObjects = canvas.current.getObjects();
  allObjects.forEach((obj) => {
    if (
      obj.type === "group" &&
      typeof (obj as fabric.Group).getObjects === "function"
    ) {
      const allGroupObjects = (obj as fabric.Group).getObjects();
      allGroupObjects.forEach((groupObj) => {
        const namedGroupObj = groupObj as NamedFabricObject;
        namedGroupObj.set({ visible: false });
      });
    }
  });
  canvas.current.renderAll();
};
function getPathPoints(path: any[]): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  path.forEach(cmd => {
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
  HideAllSegments(canvas);
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
          const currentPoly = groupObj as fabric.Polygon;

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