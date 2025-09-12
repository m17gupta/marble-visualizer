import { resetEditSegmentsOnCanvas, updateIsDelete } from '@/redux/slices/canvasSlice';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
type NamedFabricObject = fabric.Object & {
  name?: string;
  groupName?: string;
  subGroupName?: string;
  isActived?: boolean;
};
type props = {
     canvasRef: React.RefObject<any>,
}
const UpdateCanvasAfterDelete = ({ canvasRef }: props) => {
    const {editSegments,isDelete} = useSelector((state: RootState) => state.canvas);
     const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fabricCanvas = canvasRef.current?.getFabricCanvas();
        if(!fabricCanvas || !editSegments || editSegments.length === 0 || !isDelete) return;
               console.log("UpdateCanvasAfterDelete - editSegments:");
        // remove old group
        const allObjects = fabricCanvas.getObjects();
      editSegments.map((seg) => {
          const segName = seg.short_title ??"";
          const segType = seg.segment_type ?? "";

            // console.log("allObjects", allObjects);
            allObjects.forEach((obj: NamedFabricObject) => {
              if (
                obj.type === "group" &&
                obj.name === segName &&
                typeof (obj as fabric.Group).getObjects === "function"
              ) {
        
                 console.log("allGroupObjects  need to delete", obj);
                 // remove the old one
                 fabricCanvas?.remove(obj);
        
              }
            });

            // delete the edit segment
             // clear edit group
            
                fabricCanvas.getObjects().forEach((obj: fabric.Object) => {
                  if ((obj as NamedFabricObject).name?.startsWith("edit-")) {
                    fabricCanvas.remove(obj);
                  }
                });
      });
      
        fabricCanvas?.renderAll();
        dispatch(resetEditSegmentsOnCanvas())
        dispatch(updateIsDelete(false))
    },[editSegments,canvasRef])

  return (
   null
  )
}

export default UpdateCanvasAfterDelete