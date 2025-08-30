// Overlap detection for polygons on Fabric.js canvas
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import * as fabric from "fabric";
;
import * as martinez from "martinez-polygon-clipping";
import { DeletePolygonFromCanvas } from "./DeletePolygonFromCanvasTest";

type NamedFabricObject = fabric.Object & {
  name?: string;
  groupName?: string;
  subGroupName?: string;
  isActived?: boolean;
};


/**
 * Converts a flat array [x1, y1, x2, y2, ...] to [[x1, y1], [x2, y2], ...]
 */
const flatToPointPairs = (
  points: number[], scaleX: number,
  scaleY: number,): number[][] => {
  const pairs: number[][] = [];
  for (let i = 0; i < points.length; i += 2) {
    pairs.push([points[i] * scaleX, points[i + 1] * scaleY]);
  }
  return pairs;
};

const convertPointsToMartinez = (points: number[][]): number[][][] => {
  if (!Array.isArray(points) || !Array.isArray(points[0])) {
    throw new Error("Invalid input to convertPointsToMartinez: expected number[][]");
  }
  return [[...points, points[0]]];
};

//  * Draw result on canvas



function polygonsToSvgPath(multiPoly: number[][][][]): string {
  return multiPoly.map(polygon => {
    return polygon.map(ring => {
      const [startX, startY] = ring[0];
      const commands = [`M ${startX} ${startY}`];
      for (let i = 1; i < ring.length; i++) {
        const [x, y] = ring[i];
        commands.push(`L ${x} ${y}`);
      }
      commands.push('Z');
      return commands.join(' ');
    }).join(' ');
  }).join(' ');
}

const closePolygon = (points: number[]) => {
  if (points.length < 2) return points;
  // If not closed, add first point to end
  if (points[0] !== points[points.length - 2] || points[1] !== points[points.length - 1]) {
    return [...points, points[0], points[1]];
  }
  return points;
};


export function pointObjectsToNumberArray(points: { x: number; y: number }[]): number[] {
  return points.reduce((arr, pt) => {
    arr.push(pt.x, pt.y);
    return arr;
  }, [] as number[]);
}
export const getCutOutArea = (
  canvasRef: React.RefObject<any>,
  targetPoly: number[],
  segName: string,
  segShortName: string,
  groupName: string,
  subGroupName: string,
  coordinate: number[],
  segColor: string,
  scaleX: number,
  scaleY: number,
  subtractionPloyName: string[],
  allSegregatedSegments?: SegmentModal[]
): number | null => {


  const canvas = canvasRef.current.getFabricCanvas();
  if (!canvas) return null;

  // Convert flat points to [x,y] format
  const targetPolygon = closePolygon(targetPoly);
  const redPoints = flatToPointPairs(targetPolygon, scaleX, scaleY);

  // Gather all polygons to subtract
  let subtractPolygons: number[][][] = [];
  for (const segNameToSubtract of subtractionPloyName) {
    const annotation = getAnnnotationBySegName(allSegregatedSegments || [], segNameToSubtract);
    if (annotation && annotation.length > 0) {
      const closed = closePolygon(annotation);
      const points = flatToPointPairs(closed, scaleX, scaleY);
      subtractPolygons.push(points);
    }
  }
  if (subtractPolygons.length === 0) return null;

  // Union all polygons to subtract into one
  let combinedSubtraction: any = [subtractPolygons[0]];
  for (let i = 1; i < subtractPolygons.length; i++) {
    combinedSubtraction = martinez.union(combinedSubtraction, [subtractPolygons[i]]);
  }

  if (redPoints.length === 0) return 0;

  // Convert red polygon to martinez format
  let targetMartinez: number[][][] = convertPointsToMartinez(redPoints); // number[][][]

  // Use combinedSubtraction (Geometry type) directly for subtraction
  if (!targetMartinez || targetMartinez.length === 0 || targetMartinez[0].length === 0 || !combinedSubtraction || (Array.isArray(combinedSubtraction) && combinedSubtraction.length === 0)) return 0;

  const rawResult = martinez.diff(targetMartinez, combinedSubtraction);
  if (!rawResult || !Array.isArray(rawResult)) return 0;

  const result = rawResult as number[][][][];
  if (!result || result.length === 0 || result[0].length === 0) return 0;

  // Draw result on canvas
  const svgPath = polygonsToSvgPath(result);

  // Helper to create a group with a specific groupName
  const createGroup = (groupName: string) => {
    const text = new fabric.Text(segShortName, {
      left: coordinate[0] * scaleX,
      top: coordinate[1] * scaleY,
      fontFamily: "Arial",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      fontSize: 18,
      fill: "#fff",
      selectable: true,
      visible: false,
      name: "text",
    });
    const cutoutPath = new fabric.Path(svgPath, {
      fill: segColor,
      stroke: segColor,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      fillRule: 'evenodd',
      name: segName,
      visible: false,
      opacity: 0.4
    });
    const group = new fabric.Group([cutoutPath, text], {
      selectable: true,
      lockMovementX: true,
      lockMovementY: true,
      hasBorders: false,
      hasControls: false,
      subTargetCheck: true,
    });
    (group as NamedFabricObject).groupName = groupName;
    (group as NamedFabricObject).subGroupName = groupName;
    (group as NamedFabricObject).isActived = true;
    (group as NamedFabricObject).name = segName;
    return group;
  };

  // Create and add each group
  const hoverGroup = createGroup("hover");
  const outlineGroup = createGroup("outline");
  const maskGroup = createGroup("mask");

  canvas?.add(hoverGroup);
  canvas?.add(outlineGroup);
  canvas?.add(maskGroup);
  canvas?.setActiveObject(maskGroup);
  canvas?.renderAll();
  DeletePolygonFromCanvas(canvasRef, segName);
  // Calculate total area of all resulting rings
  let totalArea = 0;

  return totalArea;
}




/**
 * Get annotation by segment name from all job segments
 * @param allJObs - Array of job segments
 * @param segName - Segment name to search for
 * @returns Annotation if found, otherwise undefined
 */

const getAnnnotationBySegName = (allJObs: SegmentModal[], segName: string): number[] | null => {


    const annotation=allJObs.find(job=>job.short_title===segName)?.annotation_points_float||[];
  return annotation || null;
}





