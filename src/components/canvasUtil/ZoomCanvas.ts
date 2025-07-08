import * as fabric from 'fabric';

export const ZoomCanvas=(
    canvasRef: React.MutableRefObject<fabric.Canvas | null>,
    zoom:number,
 )=>{
 // console.log("zoom-->",zoom)
    if(canvasRef.current){
        const center = canvasRef.current.getCenter();
        canvasRef.current.zoomToPoint(
            new fabric.Point(center.left, center.top),
            zoom
          );
    }
    
    
    
 }



 export const ZoomCanvasMouse = (
  canvasRef: React.MutableRefObject<fabric.Canvas | null>,
   zoom: number,
   mousePosition: { x: number, y: number }
) => {
  
   if (canvasRef.current) {
       canvasRef.current.zoomToPoint(
           new fabric.Point(mousePosition.x, mousePosition.y),
           zoom
       );
   }
   
  
}
 
