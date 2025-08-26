import * as fabric from "fabric";
type NamedFabricObject = fabric.Object & {
  name?: string;
  groupName?: string;
  subGroupName?: string;
  isActived?: boolean;
};

export const DeletePolygonFromCanvas = (
  canvasRef: React.RefObject<fabric.Canvas>,
  polygonName: string
) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

 const allObjects = canvasRef.current?.getObjects();
   if (!allObjects) return;
   allObjects.forEach((item) => {
     if (item.type === "group") {
       const group = item as fabric.Group;
       const child = group.getObjects()[0] as NamedFabricObject;
       if (child instanceof fabric.Polygon && (child as NamedFabricObject).name == polygonName) {
            canvas.remove(group);
            canvas.requestRenderAll();
            canvas.fire("object:modified");
            return;
       }
     }
   });
   
};