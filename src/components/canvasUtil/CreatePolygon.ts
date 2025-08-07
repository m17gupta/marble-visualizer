import * as fabric from "fabric";

export interface PointModel {
    x: number;
    y: number;
}


export const collectPoints = (
    annotation: number[],
    segName: string,
    coordinates: number[],
    segType: string,
    groupName: string,
    color: string,
    canvasRef: React.RefObject<fabric.Canvas>,
    isFillPolygon: boolean,
    imageHeight: number,
    imageWidth: number

) => {

    if (!canvasRef.current) return;

    if (annotation) {
        const point: PointModel[] = [];
        const polyName = segName;
        for (let i = 0; i < annotation.length; i += 2) {
            const x = annotation[i];
            const y = annotation[i + 1];
            point.push({ x, y });
        }

        if (point && point.length > 0) {
            makePolygon(
                point,
                coordinates,
                polyName,
                 segType,
                groupName,
                color,
                canvasRef,
                isFillPolygon,


            );
        }
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
        const currentObject = allObjects.find((item) => (item as any).name === polyName);
        if (currentObject) {
            canvasRef.current.remove(currentObject);
        }

        const text = new fabric.Text(polyName, {
            left: coordinate[0],
            top: coordinate[1],
            fontFamily: "Arial",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            fontSize: 18,
            fill: "#fff",
            selectable: true,
            visible: false,
        });

        // Attach custom property after creation
        (text as any).name = polyName;

        const polygon = new fabric.Polygon(point, {
            fill: color,
            originX: "left",
            originY: "top",
            hasBorders: false,
            hasControls: false,
            stroke: color,
            strokeWidth: 2,
            opacity: 0.4,
            visible: false,
            lockMovementX: true,
            lockMovementY: true,
        });
        (polygon as any).name = polyName;

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
        (group as any).groupName = groupName;
        (group as any).subGroupName = subGroupName;
        (group as any).isActived = true;
        (group as any).name = polyName;

        canvasRef.current?.setActiveObject(group);
        canvasRef.current?.add(group);
        canvasRef.current?.requestRenderAll();
    }
};