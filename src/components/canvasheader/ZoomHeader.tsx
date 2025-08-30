import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";

interface ZoomCanvasProps {
  resetCanvas: () => void;

}
const ZoomHeader = ({  resetCanvas }: ZoomCanvasProps) => {
   const { currentZoom, mousePosition } = useSelector(
     (state: RootState) => state.canvas
   );
 
    const [zoomLevel, setZoomLevel] = useState(1);
      const [mouseMove, setMouseMove] = useState({ x: 0, y: 0 });
   // update zoom
   useEffect(() => {
     if (currentZoom) {
       const zoomPercentage = Math.round(currentZoom * 100);
       setZoomLevel(zoomPercentage);
     } else {
       setZoomLevel(1);
     }
   }, [currentZoom]);

     useEffect(() => {
       if (mousePosition) {
         setMouseMove(mousePosition);
       } else {
         setMouseMove({ x: 0, y: 0 });
       }
     }, [mousePosition]);
  
    const handleResetZoom = () => {
    resetCanvas();
  };


  return (
    <>
     <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                   <Badge
                     variant="secondary"
                     className="flex items-center gap-2 py-1"
                   >
                     <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                       <ZoomIn className="h-4 w-4" />
                     </Button>
                     <span>{zoomLevel}%</span>
                     <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                       <ZoomOut className="h-4 w-4" />
                     </Button>
     
                     <Button
                       variant="ghost"
                       size="icon"
                       className="h-6 w-20 p-0"
                       onClick={handleResetZoom}
                     >
                       {" "}
                       Reset
                     </Button>
                   </Badge>
     
                   <div className="flex flex-col gap-1">
                     <Badge
                       variant="secondary"
                       className="grid items-center gap-0 w-20  pt-1"
                     >
                       <span className="text-[10px]">X: {mouseMove.x}</span>
                       <span className="text-[10px]">Y: {mouseMove.y}</span>
                     </Badge>
                     {/* <Badge variant="secondary"  className="grid items-center gap-2 w-20 h-4 pt-0">
                       <span className="text-[10px]">Y: 32</span>
                     </Badge> */}
                   </div>
                 </div>
               </div>
    </>
  )
}

export default ZoomHeader