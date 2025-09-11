import React from "react";
import * as fabric from "fabric";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Undo2, Redo2, Copy, Clipboard, ZoomIn, ZoomOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setCanvasType } from "@/redux/slices/canvasSlice";
import AddSegLists from "./canvasAddNewSegment/AddSegLists";
import ZoomHeader from "../canvasheader/ZoomHeader";
import DrawHeader from "../canvasheader/DrawHeader";
import Toggleheader from "../canvasheader/Toggleheader";
interface CanvasToolbarProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
  cancelDrawing: () => void;
  resetCanvas: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CanvasToolbar({
  fabricCanvasRef,
  cancelDrawing,
  resetCanvas,
  zoomIn,
  zoomOut,
}: CanvasToolbarProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { canvasType } = useSelector((state: RootState) => state.canvas);
  const { currentZoom, mousePosition } = useSelector(
    (state: RootState) => state.canvas
  );
  const { selectedSegment } = useSelector(
    (state: RootState) => state.masterArray
  );

  const handleResetZoom = () => {
    resetCanvas();
  };

  const handleZoomIn = () => {
    zoomIn();
  };

  const handleZoomOut = () => {
    zoomOut();
  };

  const handleCancelDrawing = () => {
    dispatch(setCanvasType("hover"));
    cancelDrawing();
  };

  return (
      <Card>
        <CardContent className="py-2 pt-1.5 px-4 flex items-center justify-between">
           {canvasType == "reannotation" && (
              <AddSegLists
                segType={selectedSegment?.segment_type || "Unknown"}
                groupName={selectedSegment?.group_label_system || "Unknown"}
                shortName={selectedSegment?.short_title || "Unknown"}
              />
            )}
            
         <DrawHeader/>

               
          <div className="flex gap-4 items-center">

            <Tooltip>
            <TooltipTrigger asChild>
               <Button
                  variant="ghost"
                  className="py-0 px-3 h-8 border-gray-300 bg-blue-100 text-blue-600"
                  onClick={handleCancelDrawing}
                >
                  <span className="text-xs font-semibold ">Close Draw </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cancel Marking</TooltipContent>
            </Tooltip>

            <Toggleheader />

            <ZoomHeader resetCanvas={handleResetZoom} />
          </div>

          
        </CardContent>
      </Card>
  );
}


//  <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//           {canvasType == "reannotation" && (
//               <AddSegLists
//                 segType={selectedSegment?.segment_type || "Unknown"}
//                 groupName={selectedSegment?.group_label_system || "Unknown"}
//                 shortName={selectedSegment?.short_title || "Unknown"}
//               />
//             )}

//             {/* Action Buttons */}
//             <div className="flex items-center space-x-1">
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     // onClick={handleUndo}
//                     // disabled={!canUndo}
//                   >
//                     <Undo2 className="h-4 w-4" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
//               </Tooltip>

//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     // onClick={handleRedo}
//                     // disabled={!canRedo}
//                   >
//                     <Redo2 className="h-4 w-4" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
//               </Tooltip>
//             </div>

//             {/* Copy/Paste Tools */}
//             <Separator orientation="vertical" className="h-6" />
           

//             <Separator orientation="vertical" className="h-6" />
        
//           </div>
//           <Badge variant="secondary">
//             <span className="text-xs font-bold">
//               {canvasType === "draw"
//                 ? "Marking canvas"
//                 : canvasType === "reannotation"
//                 ? "ReAnnotating Marking canvas"
//                 : canvasType === "mask"
//                 ? "Creating Mask canvas"
//                 : "Mark Dimension canvas"}
//             </span>
//           </Badge>
//           <div className="flex items-center space-x-2">
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="py-0 px-3 "
//                   onClick={handleCancelDrawing}
//                 >
//                   <span className="text-xs font-bold ">Cancel Draw</span>
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Cancel Marking</TooltipContent>
//             </Tooltip>

//             <ZoomHeader
//              resetCanvas={handleResetZoom} />
          

            
//           </div>
//         </div>