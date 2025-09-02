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

export const collectPoints = async (
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
    await  makePolygon(
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

export const makePolygon =async (
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
        selectable: false,
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
        selectable: false,
        visible: isFillPolygon,
        lockMovementX: true,
        lockMovementY: true,
      });
      (polygon as NamedFabricObject).name = polyName;
      (polygon as NamedFabricObject).subGroupName = groupName;

      const group = new fabric.Group([polygon, text], {
        selectable: false,
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
        // Use await to get the icon group after the SVG has been loaded and parsed
  
    // Create and add each group
    const hoverGroup = createGroup("hover");
    const outlineGroup = createGroup("outline");
    const maskGroup = createGroup("mask");
  // const iconGroup = await getIconGroup(canvasRef, coordinate, polyName);
    fabricCanvas.add(hoverGroup);
    fabricCanvas.add(outlineGroup);
    fabricCanvas.add(maskGroup);
    // if (iconGroup) {
    //   fabricCanvas.add(iconGroup);
    // }
    fabricCanvas.setActiveObject(maskGroup); // Optionally set one as active
    fabricCanvas.requestRenderAll();
  }
};



const getIconGroup = (
  canvasRef: React.RefObject<any>,
  coordinate: number[],
  polyName: string
): Promise<fabric.Object | null> => {
  return new Promise((resolve) => {
    const fabricCanvas = canvasRef.current?.getFabricCanvas();
    if (!fabricCanvas) {
      resolve(null);
      return;
    }
   const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="10" fill="red"/></svg>`;
    fabric.loadSVGFromString(svgString, (objects, options) => {
  console.log('SVG load result:', objects);
  const objArray = (Array.isArray(objects) ? objects : [objects]) as fabric.Object[];
      if (!objArray || objArray.length === 0) {
        resolve(null);
        return;
      }
      let iconGroup: fabric.Object;
      if (objArray.length === 1) {
        iconGroup = objArray[0];
      } else {
        iconGroup = new fabric.Group(objArray, options);
      }
      if (typeof (iconGroup as any).set === 'function') {
        iconGroup.set({
          left: coordinate[0] + 10,
          top: coordinate[1] + 10,
          selectable: false,
          evented: false,
          name: `${polyName}-icon`,
          visible:false
        });
        resolve(iconGroup);
      } else {
        console.warn('iconGroup is not a Fabric object:', iconGroup);
        resolve(null);
      }
    });
  });
};