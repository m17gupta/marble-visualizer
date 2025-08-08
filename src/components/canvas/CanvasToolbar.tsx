import React from 'react';
import * as fabric from 'fabric';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {

  Undo2,
  Redo2,

  Copy,
  Clipboard,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setCanvasType } from '@/redux/slices/canvasSlice';
import AddSegLists from './canvasAddNewSegment/AddSegLists';
interface CanvasToolbarProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
  cancelDrawing: () => void;
  resetCanvas: () => void;
  zoomIn: () => void;
  zoomOut: () => void;

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CanvasToolbar({ fabricCanvasRef, cancelDrawing, resetCanvas, zoomIn, zoomOut, }: CanvasToolbarProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { canvasType } = useSelector((state: RootState) => state.canvas);
  const { currentZoom, mousePosition } = useSelector((state: RootState) => state.canvas);
  const { selectedSegment } = useSelector((state: RootState) => state.masterArray);



  const handleResetZoom = () => {
    resetCanvas()
  }


  const handleZoomIn = () => {
    zoomIn()
  }

  const handleZoomOut = () => {
    zoomOut()
  }

  const handleCancelDrawing = () => {
    dispatch(setCanvasType('hover'))
    cancelDrawing();
  }


  return (
    <Card>
      <CardContent className="py-2 px-4">
        {/* {children} */}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">

            {/* <Separator orientation="vertical" className="h-6" /> */}

            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                  // onClick={handleUndo}
                  // disabled={!canUndo}
                  >
                    <Undo2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                  // onClick={handleRedo}
                  // disabled={!canRedo}
                  >
                    <Redo2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
              </Tooltip>
            </div>

            {/* Copy/Paste Tools */}
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                  // onClick={handleCopySelected}
                  // disabled={!activeSegmentId}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy segment (Ctrl+C)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                  // onClick={handlePasteSegment}
                  // disabled={!canPaste}
                  >
                    <Clipboard className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Paste segment (Ctrl+V)</TooltipContent>
              </Tooltip>
            </div>




            <Separator orientation="vertical" className="h-6" />
            {/* 
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                onClick={handleDeleteSelected}
                disabled={!activeSegmentId}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete selected segment (Delete)</TooltipContent>
            </Tooltip> */}
          </div>
          <Badge variant="secondary">
            <span className="text-xs font-bold">
              {canvasType === "draw" ? "Marking canvas" : (canvasType === "reannotation" ? "ReAnnotating Marking canvas" : (canvasType === "mask"? "Creating Mask canvas" : "Mark Dimension canvas"))}
            </span>
          </Badge>
          <div className="flex items-center space-x-2">





            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"

                  className='py-0 px-3 '
                  onClick={handleCancelDrawing}
                >
                  <span className="text-xs font-bold ">Cancel Draw</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cancel Marking</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"

                  className='py-0 px-3 '
                  onClick={handleResetZoom}
                >
                  <span className="text-xs font-bold ">Reset </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset zoom to 100%</TooltipContent>
            </Tooltip>

            {/* Display current zoom level and mouse coordinates */}
            <Badge variant="secondary" className="flex items-center gap-2">
              <span>Zoom: {Math.round(currentZoom * 100)}%</span>
              <div className="flex items-center gap-1">

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
                      onClick={handleZoomIn}
                    >
                      <ZoomIn className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Zoom in</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
                      onClick={handleZoomOut}
                    >
                      <ZoomOut className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Zoom out</TooltipContent>
                </Tooltip>

              </div>
              <span className="w-px h-4 bg-gray-300"></span>
              <span>X: {mousePosition.x}</span>
              <span>Y: {mousePosition.y}</span>
            </Badge>

            {canvasType == "reannotation" && <AddSegLists
              segType={selectedSegment?.segment_type || "Unknown"}
              groupName={selectedSegment?.group_label_system || "Unknown"}
              shortName={selectedSegment?.short_title || "Unknown"}
            />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
