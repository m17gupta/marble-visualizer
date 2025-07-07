 export const ZoomCanvas=(
    canvasRef: React.RefObject<fabric.Canvas>,
    zoom:number,
    canvasZoom:(data:number)=>void
 )=>{
 // console.log("zoom-->",zoom)
    if(canvasRef.current){
        const center = canvasRef.current.getCenter();
        canvasRef.current.zoomToPoint(
            { x: center.left, y: center.top },
            zoom
          );
    }
    
    canvasZoom(zoom)
    
 }



 export const ZoomCanvasMouse = (
   canvasRef: React.RefObject<fabric.Canvas>,
   zoom: number,
   canvasZoom: (data: number) => void,
   mousePosition: { x: number, y: number }
) => {
  
   if (canvasRef.current) {
       canvasRef.current.zoomToPoint(
           { x: mousePosition.x, y: mousePosition.y },
           zoom
       );
   }
   
   canvasZoom(zoom);
}
 
