import * as fabric from "fabric";
import { isPointInPolygon } from "./ISPointInsidePolygon";

// Custom type for objects with a data property containing a name
type NamedFabricObject = fabric.Object & { name?: string };

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
          console.log(" NamedFabricObject", namedGroupObj.name);
          const currentPoly = groupObj as fabric.Polygon;
          const currentPath = groupObj as fabric.Path;
            const polyName = (currentPoly as NamedFabricObject).name;
            const polypath = (currentPath as NamedFabricObject).name;
            console.log(" target name", name);
            console.log(" polyName", polyName);
            console.log(" polypath", polypath);
          if (currentPoly instanceof fabric.Polygon) {
            const vertices = currentPoly.get("points");
            const checkvalue = isPointInPolygon(pointer, vertices || []);
            if (checkvalue) {
            
              const polyName = (currentPoly as NamedFabricObject).name;
             // console.log(" polyName", polyName);
              namedGroupObj.set({ visible: true });
            }
          }else if (currentPath instanceof fabric.Path) {
            const vertices = currentPath.get("path");
            const checkvalue = isPointInPolygon(pointer, vertices || []);
            console.log(" checkvalue  pathhh", checkvalue);
          //  const polyName = (currentPath as NamedFabricObject).name;
           // console.log(" polyName", polyName);
            // namedGroupObj.set({ visible: true });
            
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
