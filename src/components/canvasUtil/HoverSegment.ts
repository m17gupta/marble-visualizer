import * as fabric from "fabric";
import { isPointInPolygon } from "./ISPointInsidePolygon";

// Custom type for objects with a data property containing a name
type NamedFabricObject = fabric.Object & { 
  name?: string;
   groupName?: string;
  subGroupName?: string;
  isActived?: boolean;
 };


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
        // Check polygon
        if (polygonObj) {
          const vertices = (polygonObj as fabric.Polygon).points;
          const checkvalue = isPointInPolygon(pointer, vertices || []);
          if (checkvalue) {
            if (namedObj) (namedObj as fabric.Object).set({ visible: true });
            if (textObj) (textObj as fabric.Object).set({ visible: true });
          }
        }
        // Check path
        if (pathObj) {
          const pathData = (pathObj as fabric.Path).path;
          const pathPoints = getPathPoints(pathData);
          const checkvalue = isPointInPolygon(pointer, pathPoints || []);
          if (checkvalue) {
            if (namedObj) (namedObj as fabric.Object).set({ visible: true });
            if (textObj) (textObj as fabric.Object).set({ visible: true });
          }
        }
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
        (namedGroupObj as fabric.Object).set({ visible: false });
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
        
          // const currentPoly = groupObj as fabric.Polygon;
          // const currentText = groupObj as fabric.Text;
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