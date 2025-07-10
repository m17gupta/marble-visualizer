import React from 'react';
import * as fabric from 'fabric';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {

  MousePointer,
  Pentagon,
  Trash2,
  Undo2,
  Redo2,
  Download,
  Copy,
  Clipboard,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setCanvasActiveTool, setZoomMode } from '@/redux/slices/canvasSlice';
import { toast } from 'sonner';
interface CanvasToolbarProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
  cancelDrawing: () => void;
  resetCanvas: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CanvasToolbar({ fabricCanvasRef,cancelDrawing,resetCanvas,zoomIn,zoomOut }: CanvasToolbarProps) {
  const dispatch = useDispatch<AppDispatch>();
  // Control whether zoom is centered on mouse position or canvas center
  const {
 
    isDrawing,
    segmentDrawn
  } = useSelector((state: RootState) => state.segments)

  const { canavasActiveTool, currentZoom, zoomMode, mousePosition } = useSelector((state: RootState) => state.canvas);

  const handleToolChange = (tool: string) => {
    // Dispatch action to set the active tool in the canvas state
    dispatch(setCanvasActiveTool(tool));
    if(tool !== "polygon") {
      cancelDrawing();
    }
  };

  const handleResetZoom = () => {
    resetCanvas()
  }


  const handleZoomIn = () => {
    zoomIn()
  }

  const handleZoomOut = () => {
    zoomOut()
  }

  const changeZoomMode = () => {
    
    if(zoomMode === 'center') {
      dispatch(setZoomMode('mouse'));
    }else{
      dispatch(setZoomMode('center'));
    }
    toast.success(`Zoom mode: ${zoomMode === 'center' ? 'Mouse' : 'Center'}`);
  };
  return (
    <Card>
      <CardContent className="p-4">
        {/* {children} */}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Drawing Tools */}
            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={canavasActiveTool === 'select' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToolChange('select')}
                  >
                    <MousePointer className="h-4 w-4 mr-1" />
                    Select
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Select and move segments</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={canavasActiveTool === 'polygon' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToolChange('polygon')}
                  >
                    <Pentagon className="h-4 w-4 mr-1" />
                    Polygon
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Draw polygon segments</TooltipContent>
              </Tooltip>
            </div>

            <Separator orientation="vertical" className="h-6" />

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

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                // onClick={handleDeleteSelected}
                // disabled={!activeSegmentId}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete selected segment (Delete)</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center space-x-2">
            {/* Status */}
            {isDrawing && (
              <Badge variant="secondary">
                segment drawn: {Object.keys(segmentDrawn).length}
              </Badge>
            )}

      
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleResetZoom}
                >
                  <span className="text-xs font-bold">Reset </span>
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
                      onClick={changeZoomMode}
                      // onClick={() => {
                      //   dispatch(toggleZoomMode());
                      //   toast.success(`Zoom mode: ${zoomMode === 'center' ? 'Mouse' : 'Center'}`);
                      // }}
                    >
                      <span className="text-xs">{zoomMode === 'center' ? 'C' : 'M'}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {zoomMode === 'center'
                      ? 'Zoom centered on canvas (click to change)'
                      : 'Zoom centered on mouse (click to change)'}
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="w-px h-4 bg-gray-300"></span>
              <span>X: {mousePosition.x}</span>
              <span>Y: {mousePosition.y}</span>
            </Badge>

            <Button variant="outline" size="sm"
            // onClick={handleExport}
             >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
