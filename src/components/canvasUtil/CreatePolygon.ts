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
  canvasRef: React.RefObject<fabric.Canvas>,
  isFillPolygon: boolean,
  canvasHeight: number,
  canvasWidth: number,
  aiTrainImageWidth: number,
  aiTrainImageHeight: number

) => {
  if (!canvasRef.current) {
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
    const x = annotation[i] * ratioWidth ;
    const y = annotation[i + 1] * ratioHeight ;
    point.push({ x, y });
  }



  if (point && point.length > 0 && coordinates && polyName) {
    makePolygon(
      point,
      coordinates,
      polyName,
      segType,
      groupName,
      color,
      canvasRef,
      isFillPolygon,
      ratioWidth,
      ratioHeight
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
  canvasRef: React.RefObject<fabric.Canvas>,
  isFillPolygon: boolean,
  ratioWidth: number,
  ratioHeight: number
) => {
  if (
    point &&
    point.length > 0 &&
    coordinate &&
    polyName &&
    canvasRef.current
  ) {
    const allObjects = canvasRef.current?.getObjects();
    // Remove existing object with the same name (if any)
    const currentObject = allObjects.find(
      (item) => (item as NamedFabricObject).name === polyName
    );
    if (currentObject) {
      canvasRef.current.remove(currentObject);
    }

    const text = new fabric.Text(polyName, {
      left: coordinate[0] * ratioWidth,
      top: coordinate[1] * ratioHeight,
      fontFamily: "Arial",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      fontSize: 18,
      fill: "#fff",
      selectable: true,
      visible: false,
    });

    // Attach custom property after creation
    (text as NamedFabricObject).name = polyName;

    const polygon = new fabric.Polygon(point, {
      fill: color,
      originX: coordinate[0] ,
      originY: coordinate[1] ,
      hasBorders: false,
      hasControls: false,
      stroke: color,
      strokeWidth: 2,
      opacity: 0.4,
      visible: false,
      lockMovementX: true,
      lockMovementY: true,
    });
    (polygon as NamedFabricObject).name = polyName;

    // Only pass valid Fabric.Group options
    const group = new fabric.Group([polygon, text], {
      selectable: true,
      lockMovementX: true,
      lockMovementY: true,
      hasBorders: false,
      hasControls: false,
      subTargetCheck: true,
      //  name: polyName,
    });

    // Attach custom properties after creation
    (group as NamedFabricObject).groupName = groupName;
    (group as NamedFabricObject).subGroupName = subGroupName;
    (group as NamedFabricObject).isActived = true;
    (group as NamedFabricObject).name = polyName;

    console.log(
      `[makePolygon] Created polygon group: ${polyName}, visible: ${group.visible}`
    );

    canvasRef.current?.setActiveObject(group);
    canvasRef.current?.add(group);
    canvasRef.current?.requestRenderAll();
  }
};
