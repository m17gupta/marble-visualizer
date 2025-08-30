import * as fabric from "fabric";

export interface PointModel {
  x: number;
  y: number;
}

// Type for fabric objects with custom properties
type NamedFabricObject = fabric.Object & {
  name?: string;
  groupName?: string;
  subGroupName?: string;
  isActived?: boolean;
};

export const collectPoints = (
  annotation: number[],
  segName: string,
  coordinates: number[],
  segType: string,
  groupName: string,
  color: string,
  canvasRef: React.RefObject<any>,
  isFillPolygon: boolean,
  canvasHeight: number,
  canvasWidth: number,
  aiTrainImageWidth: number,
  aiTrainImageHeight: number
  // subGroupName?: string
) => {
  if (!canvasRef.current.getFabricCanvas()) {
    console.warn(
      `[collectPoints] Canvas not available for segment: ${segName}`
    );
    return;
  }

  if (!annotation || annotation.length === 0) {
    console.warn(
      `[collectPoints] No annotation points for segment: ${segName}`
    );
    return;
  }

  const point: PointModel[] = [];
  const polyName = segName;

  const ratioWidth = canvasWidth / aiTrainImageWidth;
  const ratioHeight = canvasHeight / aiTrainImageHeight;
  for (let i = 0; i < annotation.length; i += 2) {
    const x = annotation[i] * ratioWidth;
    const y = annotation[i + 1] * ratioHeight;
    point.push({ x, y });
  }

  if (point && point.length > 0 && coordinates && polyName) {
    makePolygon(
      point,
      coordinates,
      polyName,
      groupName,
      segType,
      color,
      canvasRef,
      isFillPolygon,
      ratioWidth,
      ratioHeight
      // subGroupName
    );
  } else {
    console.warn(
      `[collectPoints] No valid points generated for segment: ${segName}`
    );
  }
};

export const makePolygon = (
  point: PointModel[],
  coordinate: number[],
  polyName: string,
  groupName: string,
  subGroupName: string,
  color: string,
  canvasRef: React.RefObject<any>,
  isFillPolygon: boolean,
  ratioWidth: number,
  ratioHeight: number,
  overlaySubGroupName?: string
) => {
  if (
    point &&
    point.length > 0 &&
    coordinate &&
    polyName &&
    canvasRef.current
  ) {
    const fabricCanvas = canvasRef.current?.getFabricCanvas();
    if (!fabricCanvas) {
      console.warn(
        `[makePolygon] Fabric canvas not available for polygon: ${polyName}`
      );
      return;
    }

    // Helper to create a group with a specific groupName
    const createGroup = (groupName: string) => {
      const text = new fabric.Text(polyName, {
        left: coordinate[0] * ratioWidth,
        top: coordinate[1] * ratioHeight,
        fontFamily: "Arial",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        fontSize: 18,
        fill: "#fff",
        selectable: true,
        visible: isFillPolygon,
      });
      (text as NamedFabricObject).name = polyName;

      const polygon = new fabric.Polygon(point, {
        fill: color,
        originX: coordinate[0],
        originY: coordinate[1],
        hasBorders: false,
        hasControls: false,
        stroke: color,
        strokeWidth: 2,
        opacity: 0.4,
        visible: isFillPolygon,
        lockMovementX: true,
        lockMovementY: true,
       
      });
      (polygon as NamedFabricObject).name = polyName;
      (polygon as NamedFabricObject).subGroupName = groupName;

      const group = new fabric.Group([polygon, text], {
        selectable: true,
        lockMovementX: true,
        lockMovementY: true,
        hasBorders: false,
        hasControls: false,
        subTargetCheck: true,
      });
      (group as NamedFabricObject).groupName = groupName;
      (group as NamedFabricObject).subGroupName = subGroupName;
      (group as NamedFabricObject).isActived = true;
      (group as NamedFabricObject).name = polyName;
      return group;
    };

    // Create and add each group
    const hoverGroup = createGroup("hover");
    const outlineGroup = createGroup("outline");
    const maskGroup = createGroup("mask");

    fabricCanvas.add(hoverGroup);
    fabricCanvas.add(outlineGroup);
    fabricCanvas.add(maskGroup);
    fabricCanvas.setActiveObject(maskGroup); // Optionally set one as active
    fabricCanvas.requestRenderAll();
  }
};
