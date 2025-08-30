import * as fabric from "fabric";
import { isPointInPolygon } from "./ISPointInsidePolygon";
import { getPathPoints } from "./test/HoverSegmentTest";

type NamedFabricObject = fabric.Object & {
  name?: string;
  groupName?: string;
  subGroupName?: string;
  isActived?: boolean;
};
export const OnCanvasClick = (
      canvas: React.RefObject<fabric.Canvas>,

      pointer: fabric.Point
): string | null => {
  const fabricCanvas = canvas.current;
  if (!fabricCanvas) return null;
  //console.log("Canvas clicked at:", pointer.x, pointer.y);
  const allObjects = fabricCanvas.getObjects();
  for (const obj of allObjects as NamedFabricObject[]) {
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
      for (const groupObj of allGroupObjects) {
        if (groupObj instanceof fabric.Polygon) {
          polygonObj = groupObj as fabric.Polygon;
          namedObj = groupObj as NamedFabricObject;
        } else if (groupObj instanceof fabric.Path) {
          pathObj = groupObj as fabric.Path;
          namedObj = groupObj as NamedFabricObject;
        } else if (groupObj instanceof fabric.Text) {
          textObj = groupObj as fabric.Text;
        }
      }

      if (polygonObj) {
        const vertices = (polygonObj as fabric.Polygon).points;
        const checkvalue = isPointInPolygon(pointer, vertices || []);
       // console.log("checkvalue", checkvalue, pointer);
        if (checkvalue) {
          const namedGroupObj = polygonObj as NamedFabricObject;
         // console.log("Polygon clicked:", namedGroupObj?.name);
          return namedGroupObj?.name ?? null;
        }
      }
      // Check path
      else if (pathObj) {
        const pathData = (pathObj as fabric.Path).path;
        const pathPoints = getPathPoints(pathData);
        const checkvalue = isPointInPolygon(pointer, pathPoints || []);
        if (checkvalue) {
          const namedGroupObj = pathObj as NamedFabricObject;
         // console.log("Path clicked:", namedGroupObj?.name);
          return namedGroupObj?.name ?? null;
        }
      } else {
        console.log("No polygon or path found in group:", obj);
      }
    }
  }
  return null;
};
