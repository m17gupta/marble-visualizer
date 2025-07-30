
import * as fabric from "fabric";

// Custom type for objects with a data property containing a name
type NamedFabricObject = fabric.Object & {   name?: string  };

export const handlePolygonVisibilityOnMouseMove = (canvas: React.RefObject<fabric.Canvas>, name:string) => {
 
    if (name) {
        if(!canvas.current) return; // Ensure canvas is defined
    
        const targetName = name;

        const allObjects = canvas.current.getObjects();
        allObjects.forEach((obj) => {
            if (obj.type === "group" && typeof (obj as fabric.Group).getObjects === "function") {
                const allGroupObjects = (obj as fabric.Group).getObjects();
                allGroupObjects.forEach((groupObj) => {
                    const namedGroupObj = groupObj as NamedFabricObject;
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

export const HideAllSegments = (canvas: React.RefObject<fabric.Canvas>) => {
    if (!canvas.current) return;

    const allObjects = canvas.current.getObjects();
    allObjects.forEach((obj) => {
        if (obj.type === "group" && typeof (obj as fabric.Group).getObjects === "function") {
            const allGroupObjects = (obj as fabric.Group).getObjects();
            allGroupObjects.forEach((groupObj) => {
                const namedGroupObj = groupObj as NamedFabricObject;
                namedGroupObj.set({ visible: false });
            });
        }
    });
    canvas.current.renderAll();
};
