
import * as fabric from "fabric";
type NamedFabricObject = fabric.Object & {
  name?: string;
  groupName?: string;
  subGroupName?: string;
  isActived?: boolean;
};
export function findPolygon(
  canvasRef: React.RefObject<any>,
  targetPolygonName: string
): fabric.Polygon | undefined {
   const canvas = canvasRef.current.getFabricCanvas();
  const allObjects = canvas.getObjects();
  if (!allObjects) return;

  for (const item of allObjects) {
    if (item.type === "group" && (item as NamedFabricObject).name !== "imageGroup") {
      const group = item as fabric.Group;
      const child = group.getObjects()[0] as NamedFabricObject;
      if (child instanceof fabric.Polygon && (child as NamedFabricObject).name === targetPolygonName) {
        return child as fabric.Polygon;
      }
    }
  }
  return undefined;
}

function allObjectPolygons(
  canvasRef: React.RefObject<any>,
  targetPolygonName: string
): fabric.Polygon[] {
  const canvas = canvasRef.current.getFabricCanvas();
  if (!canvas) return [];

  const polygons: fabric.Polygon[] = [];

  canvas.getObjects().forEach((item:any) => {
    if (item.type === "group") {
      const group = item as fabric.Group;
      const child = group.getObjects()[0] as NamedFabricObject;
      if (child instanceof fabric.Polygon && (child as NamedFabricObject).name !== targetPolygonName) {
        polygons.push(child as fabric.Polygon);
      }
    }
  });

  return polygons;
}

export const isPointInPolygon = (
  point: { x: number; y: number },
  vertices: { x: number; y: number }[]
) => {
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i].x,
      yi = vertices[i].y;
    const xj = vertices[j].x,
      yj = vertices[j].y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};
export function getContainedPolygonNamesByBoundingBox(
  canvasRef: React.RefObject<any>,
  targetPolygonName: string

 
): string[] {
  const canvas = canvasRef.current.getFabricCanvas();
  if (!canvas) return [];

  const targetPolygon = findPolygon(canvasRef, targetPolygonName);
  
  if (!targetPolygon) return [];

//  const targetRect = targetPolygon.getBoundingRect(true);
  const allPolygons = allObjectPolygons(canvasRef, targetPolygonName);
  const contained: string[] = [];
  allPolygons.map((poly) => {
    const polyRect = poly.get("points");
    const vertices = targetPolygon.get("points");
    // console.log("polyRect", polyRect);
    if (!polyRect || !Array.isArray(polyRect) || polyRect.length === 0) return;
    if (polyRect[0]?.x === undefined && polyRect[0]?.y === undefined) return;

    const checkvalue = isPointInPolygon(polyRect[0], vertices || []);

    if (checkvalue) {
  contained.push((poly as NamedFabricObject).name ?? "Unnamed");
    }
  });

  // console.log("Contained polygons by bounding box:", contained);
  return contained;
}