import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as fabric from 'fabric';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch, RootState } from '@/redux/store';
import {
  startDrawing,
  addPoint,
  finishDrawing,
  cancelDrawing,
  selectSegment,
  deleteSegment,
  // assignMaterialToSegment,
  removeMaterialFromSegment,
  saveToHistory,
  undo,
  redo,
  copySegment,
  pasteSegment,
  bringForward,
  sendBackward,
} from '@/redux/slices/segmentsSlice';
import {
  setZoom,
  toggleZoomMode,
  setCanvasReady,
  setMousePosition
} from '@/redux/slices/canvasSlice';
//import { MaterialPickerDialog } from './MaterialPickerDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import {
  MousePointer,
  Pentagon,
  Trash2,
  Undo2,
  Redo2,
  Download,
  // Eye,
  // EyeOff,
  Copy,
  Palette,
  Paintbrush,
  X,
  Clipboard,
  ChevronUp,
  ChevronDown,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { animatePolygonCompletion, PointModel } from '@/utils/canvasAnimations';
import { drawLines } from '../canvasUtil/DrawMouseLine';

type DrawingTool = 'select' | 'polygon';


interface CanvasEditorProps {
  imageUrl?: string;
  width?: number;
  height?: number;
  className?: string;
  onImageLoad?: () => void;
}

 /**
   * Handle mouse wheel events for zooming the canvas
   * @param event - Fabric.js event object containing wheel event data
   */

export function CanvasEditor({
  imageUrl,
  width = 800,
  height = 600,
  className,
  onImageLoad
}: CanvasEditorProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    segments,
    activeSegmentId,
    copiedSegment,
    isDrawing,
    currentPoints,
    canvasHistory,
    historyIndex
  } = useSelector((state: RootState) => state.segments);

  const {
    currentZoom,
    zoomMode,
    isCanvasReady,
    mousePosition
  } = useSelector((state: RootState) => state.canvas);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const backgroundImageRef = useRef<fabric.Image | null>(null);
  // const [activeTool, setActiveTool] = useState<DrawingTool>('select');
  const activeTool = useRef<DrawingTool>('select');
  // const [isPolygonMode, setIsPolygonMode] = useState(false);
  const isPolygonMode = useRef(false);
  // const [tempPoints, setTempPoints] = useState<fabric.Point[]>([]);
  // const [tempLines, setTempLines] = useState<fabric.Line[]>([]>;

  const tempPoints = useRef<fabric.Point[]>([]);
  const tempLines = useRef<fabric.Line[]>([]);
  const tempPointCircles = useRef<fabric.Circle[]>([]);

  const [hoveredSegmentId] = useState<string | null>(null);
  // Canvas ready state now comes from Redux

  // Save canvas state to history
  const saveCanvasState = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvasState = JSON.stringify(fabricCanvasRef.current.toJSON());
    dispatch(saveToHistory(canvasState));
  }, [dispatch]);

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      dispatch(undo());
      const previousState = canvasHistory[historyIndex - 1];
      if (previousState && fabricCanvasRef.current) {
        fabricCanvasRef.current.loadFromJSON(previousState, () => {
          fabricCanvasRef.current!.renderAll();
        });
      }
    }
  }, [historyIndex, canvasHistory, dispatch]);

  const handleRedo = useCallback(() => {
    if (historyIndex < canvasHistory.length - 1) {
      dispatch(redo());
      const nextState = canvasHistory[historyIndex + 1];
      if (nextState && fabricCanvasRef.current) {
        fabricCanvasRef.current.loadFromJSON(nextState, () => {
          fabricCanvasRef.current!.renderAll();
        });
      }
    }
  }, [historyIndex, canvasHistory, dispatch]);

  // Delete selected segment
  const handleDeleteSelected = useCallback(() => {
    if (!activeSegmentId || !fabricCanvasRef.current) return;

    dispatch(deleteSegment(activeSegmentId));
    saveCanvasState();
    toast.success('Segment deleted');
  }, [activeSegmentId, dispatch, saveCanvasState]);

  console.log('Current Zoom:', currentZoom*100);
  const handleCancelDrawing = useCallback(() => {
    if (fabricCanvasRef.current && isPolygonMode.current) {
      const canvas = fabricCanvasRef.current;
      
      // Remove all temporary objects (lines, preview line, and point circles)
      const tempObjects = canvas.getObjects().filter(obj =>
        (obj as fabric.Object & { data?: { type?: string } }).data?.type === 'temp-line' || 
        (obj as fabric.Object & { data?: { type?: string } }).data?.type === 'preview-line' ||
        (obj as fabric.Object & { data?: { type?: string } }).data?.type === 'temp-point'
      );
      tempObjects.forEach(obj => canvas.remove(obj));
      canvas.renderAll();
    }

    isPolygonMode.current = false;
    tempPoints.current = [];
    tempLines.current = [];
    tempPointCircles.current = [];
    dispatch(cancelDrawing());
    
    toast.info('Polygon drawing cancelled');
  }, [dispatch]);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#f8f9fa',
      selection: true,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;

    // Canvas event handlers
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move',(event)=>{ handleMouseMove(event); });
    canvas.on('mouse:dblclick', handleDoubleClick);
    // canvas.on('selection:created', handleSelection);
    // canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => {
     
      dispatch(selectSegment(null));
    });

     canvas.on("mouse:wheel", (event) => {
        handleMouseWheel(event);
        dispatch(setZoom(canvas.getZoom()));
      });
    // canvas.on('object:modified', handleObjectModified);
   // canvas.on('mouse:over', handleMouseOver);
    // canvas.on('mouse:out', handleMouseOut);

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'c':
            e.preventDefault();
            if (activeSegmentId) {
              dispatch(copySegment(activeSegmentId));
              toast.success('Segment copied');
            }
            break;
          case 'v':
            e.preventDefault();
            if (copiedSegment) {
              dispatch(pasteSegment());
              toast.success('Segment pasted');
            }
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
        }
      } else {
        switch (e.key) {
          case 'Delete':
          case 'Backspace':
            if (activeSegmentId) {
              handleDeleteSelected();
            }
            break;
          case 'Escape':
            if (isPolygonMode) {
              handleCancelDrawing();
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    dispatch(setCanvasReady(true));
    console.log('Canvas initialized successfully');

    return () => {
      console.log('Disposing canvas...');
      document.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
      fabricCanvasRef.current = null;
      backgroundImageRef.current = null;
      dispatch(setCanvasReady(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, activeSegmentId, copiedSegment, dispatch]);

  // Load background image with comprehensive CORS and fallback handling
  useEffect(() => {
    if (!fabricCanvasRef.current || !isCanvasReady || !imageUrl) {
        console.log('Skipping image load:', { isCanvasReady, imageUrl: !!imageUrl });
      return;
    }

    const canvas = fabricCanvasRef.current;
  
    // Remove existing background image
    if (backgroundImageRef.current) {
      canvas.remove(backgroundImageRef.current);
      backgroundImageRef.current = null;
    }

    // Helper function to create and add fabric image to canvas
    const addImageToCanvas = (imgElement: HTMLImageElement) => {
      const fabricImage = new fabric.Image(imgElement, {
        selectable: false,
        evented: false,
        excludeFromExport: false,
      });

      // Calculate scaling to fit canvas
      const canvasAspect = width / height;
      const imgAspect = imgElement.width / imgElement.height;

      let scale;
      if (imgAspect > canvasAspect) {
        scale = width / imgElement.width;
      } else {
        scale = height / imgElement.height;
      }

      fabricImage.scale(scale);
      fabricImage.set({
        left: (width - imgElement.width * scale) / 2,
        top: (height - imgElement.height * scale) / 2,
      });

      // Store reference and add to canvas
      backgroundImageRef.current = fabricImage;
      canvas.add(fabricImage);
      canvas.sendObjectToBack(fabricImage);
      canvas.renderAll();

      // console.log(`Background image loaded successfully via ${loadMethod}`);
      // toast.success('Background image loaded successfully');

      // Call the onImageLoad callback if provided
      if (onImageLoad) {
        onImageLoad();
      }
    };

    // Strategy 1: Try with different CORS modes
    const loadImageWithCORS = (corsMode: string | null = 'anonymous') => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const imgElement = new Image();
        
        if (corsMode) {
          imgElement.crossOrigin = corsMode;
        }

        imgElement.onload = () => {
          resolve(imgElement);
        };

        imgElement.onerror = (error) => {
          reject(error);
        };

        imgElement.src = imageUrl;
      });
    };

    // Strategy 2: Try with fetch and different CORS modes
    const loadImageWithFetch = async (fetchMode: RequestMode) => {
      try {
        const response = await fetch(imageUrl, {
          mode: fetchMode,
          credentials: 'omit',
          cache: 'no-cache',
          headers: {
            'Accept': 'image/*'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const imgElement = new Image();
          
          imgElement.onload = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(imgElement);
          };
          
          imgElement.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to load image from blob'));
          };
          
          imgElement.src = objectUrl;
        });
        
      } catch (error) {
        throw new Error(`Fetch failed with mode ${fetchMode}: ${error}`);
      }
    };

    // Try all loading strategies in sequence
    const tryLoadImage = async () => {
      // Strategy 1: Try different CORS modes
      const corsOptions = ['anonymous', null, 'use-credentials'];
      
      for (const corsMode of corsOptions) {
        try {
          console.log(`Attempting to load image with CORS mode: ${corsMode || 'none'}`);
          const imgElement = await loadImageWithCORS(corsMode);
          console.log(`Image loaded with CORS mode: ${corsMode || 'none'}`);
          addImageToCanvas(imgElement);
          return; // Success, exit
        } catch (error) {
          console.warn(`Failed to load with CORS mode: ${corsMode || 'none'}`, error);
        }
      }

      // Strategy 2: Try different fetch modes
      const fetchModes: RequestMode[] = ['cors', 'no-cors', 'same-origin'];
      
      for (const fetchMode of fetchModes) {
        try {
          console.log(`Attempting to load image via fetch with mode: ${fetchMode}`);
          const imgElement = await loadImageWithFetch(fetchMode);
          console.log(`Image loaded with fetch mode: ${fetchMode}`);
          addImageToCanvas(imgElement);
          return; // Success, exit
        } catch (error) {
          console.warn(`Failed to load with fetch mode: ${fetchMode}`, error);
        }
      }

      // All strategies failed
      console.error('All image loading strategies failed for URL:', imageUrl);
      
      // Provide detailed error message with suggestions
      const errorMessage = imageUrl.includes('s3.') 
        ? 'Failed to load S3 image due to CORS restrictions. Please configure your S3 bucket CORS policy to allow requests from your domain.'
        : 'Failed to load background image. The image server may not allow cross-origin requests.';
      
      toast.error(errorMessage, { 
        duration: 6000,
        description: 'Check browser console for detailed error information.'
      });
      
      // Call the onImageLoad callback even on error to clear loading state
      if (onImageLoad) {
        onImageLoad();
      }
    };

    tryLoadImage();
  }, [imageUrl, isCanvasReady, width, height, onImageLoad]);

  // Update tool behavior
  useEffect(() => {
    if (!fabricCanvasRef.current || !isCanvasReady) return;

    const canvas = fabricCanvasRef.current;
    console.log('Updating tool behavior:', activeTool);

    // Update canvas selection mode
    canvas.selection = activeTool.current === 'select';

    // Update object selectability
    // const objects = canvas.getObjects();
    // objects.forEach(obj => {
    //   const objData = (obj as any).data;
    //   if (objData?.type === 'segment') {
    //     obj.selectable = activeTool.current === 'select';
    //     obj.evented = activeTool.current === 'select';
    //   }
    // });

    canvas.renderAll();
  }, [activeTool, isCanvasReady]);

  // Control whether zoom is centered on mouse position or canvas center
  const getIsCenterZooms = useRef(zoomMode === 'center');
  
 
  const handleMouseWheel = (event: fabric.TEvent) => {
    // Cast the event to WheelEvent to access deltaY
    const deltaE = event.e as WheelEvent;
    const pointer = fabricCanvasRef.current?.getPointer(event.e);
    
    // Make sure we have all required objects
    if (deltaE && fabricCanvasRef.current && pointer) {
      // Prevent default browser behavior
      event.e.stopPropagation();
      event.e.preventDefault();
      
      const delta = deltaE.deltaY;
      let zoom = fabricCanvasRef.current.getZoom();
      
      // Calculate new zoom level based on wheel direction
      // Using 0.999^delta for smoother zooming
      zoom *= 0.999 ** delta;
      
      // Enforce zoom boundaries
      const wouldGoTooSmall = zoom < 1;
      if (zoom > 20) zoom = 20; // Set maximum zoom level
      if (zoom < 1) zoom = 1; // Set minimum zoom level
      
      // Optional: Draw reference lines for better visual feedback
      drawLines(pointer.x, pointer.y, fabricCanvasRef, zoom);
      
      // Apply the zoom based on mode preference
      if (getIsCenterZooms.current || wouldGoTooSmall) {
        // Always use center zoom when hitting minimum zoom level
        const center = fabricCanvasRef.current.getCenter();
        fabricCanvasRef.current.zoomToPoint(
          new fabric.Point(center.left, center.top),
          zoom
        );
        
        // Show a notification if we're forcing center alignment at minimum zoom
        if (wouldGoTooSmall && !getIsCenterZooms.current) {
          toast.info('Minimum zoom reached - centering view', { id: 'zoom-min-center' });
        }
      } else {
        // Zoom to the mouse position
        fabricCanvasRef.current.zoomToPoint(
          new fabric.Point(pointer.x, pointer.y),
          zoom
        );
      }
      
      // Update the zoom state
      dispatch(setZoom(zoom));
    }
  };

  // Sync segments with canvas
  // useEffect(() => {
  //   if (!fabricCanvasRef.current || !canvasReady) return;

  //   const canvas = fabricCanvasRef.current;
  //   console.log('Syncing segments with canvas:', segments.length);

  //   // Remove existing segments (keep background image)
  //   const objects = canvas.getObjects().filter(obj => (obj as any).data?.type === 'segment');
  //   objects.forEach(obj => canvas.remove(obj));

  //   // Add segments to canvas (sorted by zIndex)
  //   const sortedSegments = [...segments].sort((a, b) => a.zIndex - b.zIndex);

  //   sortedSegments.forEach(segment => {
  //     const points = segment.points.map(p => new fabric.Point(p.x, p.y));

  //     let fillPattern: fabric.Pattern | string = segment.fillColor;

  //     // Apply material if assigned
  //     if (segment.material) {
  //       if (segment.material.materialType === 'color' && segment.material.color) {
  //         fillPattern = segment.material.color;
  //       } else if (segment.material.materialType === 'texture' && segment.material.textureUrl) {
  //         // Load texture pattern
  //         const imgElement = new Image();
  //         imgElement.crossOrigin = 'anonymous';
  //         imgElement.onload = () => {
  //           const pattern = new fabric.Pattern({
  //             source: imgElement,
  //             repeat: 'repeat',
  //           });

  //           const polygon = canvas.getObjects().find(obj =>
  //             obj.data?.segmentId === segment.id
  //           ) as fabric.Polygon;

  //           if (polygon) {
  //             polygon.set('fill', pattern);
  //             canvas.renderAll();
  //           }
  //         };
  //         imgElement.src = segment.material.textureUrl;
  //       }
  //     }

  //     const polygon = new fabric.Polygon(points, {
  //       fill: fillPattern,
  //       stroke: segment.strokeColor,
  //       strokeWidth: segment.strokeWidth,
  //       opacity: segment.opacity,
  //       visible: segment.visible !== false,
  //       selectable: activeTool.current === 'select',
  //       evented: activeTool.current === 'select',
  //       data: {
  //         type: 'segment',
  //         segmentId: segment.id,
  //       },
  //     });

  //     canvas.add(polygon);
  //   });

  //   canvas.renderAll();
  //   console.log('Segments synced successfully');
  // }, [segments, activeTool, canvasReady]);

  // Helper function to create a point circle
  const createPointCircle = useCallback((x: number, y: number, isFirst: boolean = false) => {
    return new fabric.Circle({
      left: x - 4,
      top: y - 4,
      radius: 4,
      fill: isFirst ? '#FF1493' : '#007bff', // Pink for first point, blue for others
      stroke: '#ffffff',
      strokeWidth: 2,
      selectable: false,
      evented: false,
      data: { 
        type: 'temp-point',
        isFirst: isFirst 
      },
    });
  }, []);

  // Helper function to calculate distance between two points
  const calculateDistance = useCallback((point1: fabric.Point, point2: { x: number; y: number }) => {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Helper function to finish and display the polygon
  const finishPolygon = useCallback(() => {
    if (!fabricCanvasRef.current || tempPoints.current.length < 3) return;

    const canvas = fabricCanvasRef.current;
    console.log('Finishing polygon with', tempPoints.current.length, 'points');

    // Remove all temporary objects (lines, preview line, and point circles)
    const tempObjects = canvas.getObjects().filter(obj =>
      (obj as fabric.Object & { data?: { type?: string } }).data?.type === 'temp-line' || 
      (obj as fabric.Object & { data?: { type?: string } }).data?.type === 'preview-line' ||
      (obj as fabric.Object & { data?: { type?: string } }).data?.type === 'temp-point'
    );
    tempObjects.forEach(obj => canvas.remove(obj));

    // Create the actual polygon
    const polygonPoints = tempPoints.current.map(p => new fabric.Point(p.x, p.y));
    const polygon = new fabric.Polygon(polygonPoints, {
      fill: 'rgba(0, 123, 255, 0.3)', // Semi-transparent blue fill
      stroke: '#007bff',
      strokeWidth: 2,
      selectable: true,
      evented: true,
    });

    // Add custom data to the polygon for identification
    (polygon as fabric.Object & { data?: { type?: string; segmentId?: string } }).data = {
      type: 'segment',
      segmentId: `segment-${Date.now()}`, // Temporary ID, will be replaced by Redux
    };

    canvas.add(polygon);
    canvas.renderAll();

    // Finish drawing in Redux
    dispatch(finishDrawing({ name: `Segment ${segments.length + 1}` }));

    // Clean up temporary state
    isPolygonMode.current = false;
    tempPoints.current = [];
    tempLines.current = [];
    tempPointCircles.current = [];

    // Save to history
    const canvasState = JSON.stringify(canvas.toJSON());
    dispatch(saveToHistory(canvasState));

    toast.success('Polygon created successfully! Ready to draw another.');
  }, [dispatch, segments.length]);

  // Handle mouse down events
  const handleMouseDown = useCallback((e: fabric.TEvent) => {
    console.log('Mouse down event activeTool:', activeTool.current);
    if (!fabricCanvasRef.current || activeTool.current !== 'polygon') {
      return;
    }

    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e.e);

    if (!isPolygonMode.current) {
      // Start new polygon
      console.log('Starting new polygon');
      isPolygonMode.current = true;
      tempPoints.current = [new fabric.Point(pointer.x, pointer.y)];
      tempLines.current = [];
      tempPointCircles.current = [];
      
      // Create and add the first point circle (pink color)
      const firstPointCircle = createPointCircle(pointer.x, pointer.y, true);
      canvas.add(firstPointCircle);
      tempPointCircles.current.push(firstPointCircle);
      
      dispatch(startDrawing());
    } else {
      // Check if we have at least 3 points and clicked near the first point
      if (tempPoints.current.length >= 3) {
        const firstPoint = tempPoints.current[0];
        const distance = calculateDistance(firstPoint, pointer);
        const snapDistance = 15; // pixels
        
        if (distance <= snapDistance) {
          console.log('Auto-completing polygon - clicked near first point');
          finishPolygon();
          return;
        }
      }

      // Add point to current polygon
      const newPoint = new fabric.Point(pointer.x, pointer.y);
      const lastPoint = tempPoints.current[tempPoints.current.length - 1];

      console.log('Adding point to polygon:', newPoint);

      // Create line from last point to new point
      const line = new fabric.Line([lastPoint.x, lastPoint.y, pointer.x, pointer.y], {
        stroke: '#FF1493',
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });

      // Add custom data to the line for identification
      (line as fabric.Object & { data?: { type?: string } }).data = { type: 'temp-line' };

      // Create point circle for the new point (blue color)
      const pointCircle = createPointCircle(pointer.x, pointer.y, false);

      canvas.add(line);
      canvas.add(pointCircle);
      tempPoints.current.push(newPoint);
      tempLines.current.push(line);
      tempPointCircles.current.push(pointCircle);

      dispatch(addPoint({ x: pointer.x, y: pointer.y }));
    }
  }, [activeTool, dispatch, createPointCircle, calculateDistance, finishPolygon]);

  // Handle mouse move for preview line
  const handleMouseMove = useCallback((e: fabric.TEvent) => {

    if(!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e.e);
    const currentZoom = canvas.getZoom();

    // Update mouse position in Redux
    dispatch(setMousePosition({ x: Math.round(pointer.x), y: Math.round(pointer.y) }));

    // update the cursor line
    console.log('Mouse move pointer:', pointer);
    console.log('currentZoom:', currentZoom, 'fabricCanvasRef:', fabricCanvasRef);
    drawLines(pointer.x, pointer.y, fabricCanvasRef, currentZoom);
    if (!fabricCanvasRef.current || !isPolygonMode.current || tempPoints.current.length === 0) return;

    // const canvas = fabricCanvasRef.current;
    // const pointer = fabricCanvasRef.current.getPointer(e.e);
    const lastPoint = tempPoints.current[tempPoints.current.length - 1];

    

    // Remove existing preview line
    const previewLine = canvas.getObjects().find(obj =>   
      (obj as fabric.Object & { data?: { type?: string } }).data?.type === 'preview-line'
    );
    if (previewLine) {
      canvas.remove(previewLine);
    }

    // Add new preview line
    const line = new fabric.Line([lastPoint.x, lastPoint.y, pointer.x, pointer.y], {
      stroke: '#007bff',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
    });

    // Add custom data to the preview line for identification
    (line as fabric.Object & { data?: { type?: string } }).data = { type: 'preview-line' };

    canvas.add(line);

    // Add hover animation for polygon completion (when hovering near first point)
    if (tempPoints.current.length >= 3) {
      const firstPoint = tempPoints.current[0];
      const mousePoint: PointModel = { x: pointer.x, y: pointer.y };
      
      // Check if mouse is near first point and animate it
      animatePolygonCompletion(mousePoint, canvas, firstPoint, 15);
    }

    canvas.renderAll();
  }, [dispatch]);

  // Handle double click to finish polygon
  const handleDoubleClick = useCallback(() => {
    if (!fabricCanvasRef.current || !isPolygonMode.current || tempPoints.current.length < 3) return;

    console.log('Double-click detected - finishing polygon');
    finishPolygon();
  }, [finishPolygon]);

  // Handle object selection
  // const handleSelection = useCallback((e: any) => {
  //   const activeObject = e.selected?.[0] || e.target;
  //   console.log('Object selected:', activeObject?.data);
  //   if (activeObject?.data?.segmentId) {
  //     dispatch(selectSegment(activeObject.data.segmentId));
  //   }
  // }, [dispatch]);

  // Handle object modification
  // const handleObjectModified = useCallback((e: any) => {
  //   const obj = e.target;
  //   console.log('Object modified:', obj?.data);
  //   if (obj?.data?.segmentId && obj.type === 'polygon') {
  //     const polygon = obj as fabric.Polygon;
  //     const points = polygon.points?.map(p => ({ x: p.x, y: p.y })) || [];

  //     dispatch(updateSegment({
  //       id: obj.data.segmentId,
  //       updates: { points }
  //     }));

  //     saveCanvasState();
  //   }
  // }, [dispatch]);

  // Handle mouse over for hover effects
  // const handleMouseOver = useCallback((e: fabric.TEvent) => {
  //   const obj = e.target;
  //   if (obj?.data?.segmentId && activeTool.current === 'select') {
  //     setHoveredSegmentId(obj.data.segmentId);
  //     obj.set('stroke', '#007bff');
  //     obj.set('strokeWidth', 3);
  //     fabricCanvasRef.current?.renderAll();
  //   }
  // }, []);

  // Handle mouse out for hover effects
  // const handleMouseOut = useCallback((e: any) => {
  //   const obj = e.target;
  //   if (obj?.data?.segmentId && activeTool.current === 'select') {
  //     setHoveredSegmentId(null);
  //     const segment = segments.find(s => s.id === obj.data.segmentId);
  //     if (segment) {
  //       obj.set('stroke', segment.strokeColor);
  //       obj.set('strokeWidth', segment.strokeWidth);
  //       fabricCanvasRef.current?.renderAll();
  //     }
  //   }
  // }, [segments]);
  // Tool handlers
  const handleToolChange = (tool: DrawingTool) => {
    console.log('Changing tool to:', tool);

    if (isPolygonMode && tool !== 'polygon') {
      handleCancelDrawing();
    }

    activeTool.current = tool;
  };

  // Material assignment handlers
  // const handleAssignMaterial = () => {
  //   if (!activeSegmentId) {
  //     toast.error('Please select a segment first');
  //     return;
  //   }
  //   setMaterialPickerOpen(true);
  // };

  // const handleMaterialSelect = (material: unknown) => {
  //   if (!activeSegmentId) return;

  //   dispatch(assignMaterialToSegment({
  //     segmentId: activeSegmentId,
  //     material
  //   }));

  //   // toast.success(`Material "${material.name}" applied to segment`);
  //   saveCanvasState();
  // };

  const handleRemoveMaterial = () => {
    if (!activeSegmentId) return;

    dispatch(removeMaterialFromSegment(activeSegmentId));
    toast.success('Material removed from segment');
    saveCanvasState();
  };

  // Delete selected segment

  // Copy/Paste handlers
  const handleCopySelected = () => {
    if (!activeSegmentId) return;

    dispatch(copySegment(activeSegmentId));
    toast.success('Segment copied');
  };

  const handlePasteSegment = () => {
    if (!copiedSegment) return;

    dispatch(pasteSegment());
    saveCanvasState();
    toast.success('Segment pasted');
  };

  // Layer order handlers
  const handleBringForward = () => {
    if (!activeSegmentId) return;

    dispatch(bringForward(activeSegmentId));
    saveCanvasState();
    toast.success('Segment moved forward');
  };

  const handleSendBackward = () => {
    if (!activeSegmentId) return;

    dispatch(sendBackward(activeSegmentId));
    saveCanvasState();
    toast.success('Segment moved backward');
  };

  // Export canvas as image
  const handleExport = () => {
    if (!fabricCanvasRef.current) return;

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });

    const link = document.createElement('a');
    link.download = 'canvas-export.png';
    link.href = dataURL;
    link.click();

    toast.success('Canvas exported successfully!');
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < canvasHistory.length - 1;
  const activeSegment = segments.find(s => s.id === activeSegmentId);
  const hoveredSegment = segments.find(s => s.id === hoveredSegmentId);
  const canPaste = copiedSegment !== null;

  return (
    <TooltipProvider>
      <div className={cn('flex flex-col space-y-4', className)}>
        {/* Toolbar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* Drawing Tools */}
                <div className="flex items-center space-x-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={activeTool.current === 'select' ? 'default' : 'outline'}
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
                        variant={activeTool.current === 'polygon' ? 'default' : 'outline'}
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
                        onClick={handleUndo}
                        disabled={!canUndo}
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
                        onClick={handleRedo}
                        disabled={!canRedo}
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
                        onClick={handleCopySelected}
                        disabled={!activeSegmentId}
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
                        onClick={handlePasteSegment}
                        disabled={!canPaste}
                      >
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Paste segment (Ctrl+V)</TooltipContent>
                  </Tooltip>
                </div>

                {/* Layer Controls */}
                {activeSegmentId && (
                  <>
                    <Separator orientation="vertical" className="h-6" />
                    <div className="flex items-center space-x-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBringForward}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Bring forward</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSendBackward}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Send backward</TooltipContent>
                      </Tooltip>
                    </div>
                  </>
                )}

                {/* Material Tools */}
                {activeSegmentId && (
                  <>
                    <Separator orientation="vertical" className="h-6" />
                    <div className="flex items-center space-x-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                           // onClick={handleAssignMaterial}
                          >
                            <Paintbrush className="h-4 w-4 mr-1" />
                            Material
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Apply material to selected segment</TooltipContent>
                      </Tooltip>

                      {activeSegment?.material && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleRemoveMaterial}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remove material</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </>
                )}

                <Separator orientation="vertical" className="h-6" />

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
                </Tooltip>
              </div>

              <div className="flex items-center space-x-2">
                {/* Status */}
                {isDrawing && (
                  <Badge variant="secondary">
                    Drawing: {currentPoints.length} points
                  </Badge>
                )}

                {activeSegmentId && (
                  <Badge variant="outline">
                    Selected: {activeSegment?.name}
                    {activeSegment?.material && (
                      <span className="ml-1 text-xs">
                        • {activeSegment.material.materialName}
                      </span>
                    )}
                  </Badge>
                )}
                 <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          // className="h-4 w-4 p-0"
                          onClick={() => {
                            if (fabricCanvasRef.current) {
                              // Reset zoom to 1 (100%)
                              const center = fabricCanvasRef.current.getCenter();
                              fabricCanvasRef.current.zoomToPoint(
                                new fabric.Point(center.left, center.top),
                                1
                              );
                              dispatch(setZoom(1));
                              toast.success("Zoom reset to 100%");
                            }
                          }}
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
                          onClick={() => {
                            if (fabricCanvasRef.current) {
                              const zoom = fabricCanvasRef.current.getZoom() * 1.1;
                              const limitedZoom = Math.min(20, zoom);
                              if (getIsCenterZooms.current) {
                                const center = fabricCanvasRef.current.getCenter();
                                fabricCanvasRef.current.zoomToPoint(
                                  new fabric.Point(center.left, center.top),
                                  limitedZoom
                                );
                              } else {
                                const center = { x: mousePosition.x, y: mousePosition.y };
                                fabricCanvasRef.current.zoomToPoint(
                                  new fabric.Point(center.x, center.y),
                                  limitedZoom
                                );
                              }
                              dispatch(setZoom(limitedZoom));
                            }
                          }}
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
                          onClick={() => {
                            if (fabricCanvasRef.current) {
                              const zoom = fabricCanvasRef.current.getZoom() * 0.9;
                              const limitedZoom = Math.max(1, zoom);
                              
                              // Check if we need to force center alignment due to minimum zoom
                              const wouldGoTooSmall = zoom < 1;
                              
                              if (getIsCenterZooms.current || wouldGoTooSmall) {
                                // Always use center zoom when hitting minimum zoom level
                                const center = fabricCanvasRef.current.getCenter();
                                fabricCanvasRef.current.zoomToPoint(
                                  new fabric.Point(center.left, center.top),
                                  limitedZoom
                                );
                                
                                // Show a notification if we're forcing center alignment
                                if (wouldGoTooSmall && !getIsCenterZooms.current) {
                                  toast.info('Minimum zoom reached - centering view');
                                }
                              } else {
                                const center = { x: mousePosition.x, y: mousePosition.y };
                                fabricCanvasRef.current.zoomToPoint(
                                  new fabric.Point(center.x, center.y),
                                  limitedZoom
                                );
                              }
                              dispatch(setZoom(limitedZoom));
                            }
                          }}
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
                          onClick={() => {
                            dispatch(toggleZoomMode());
                            getIsCenterZooms.current = !getIsCenterZooms.current;
                            toast.success(`Zoom mode: ${getIsCenterZooms.current ? 'Center' : 'Mouse'}`);
                          }}
                        >
                          <span className="text-xs">{getIsCenterZooms.current ? 'C' : 'M'}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {getIsCenterZooms.current 
                          ? 'Zoom centered on canvas (click to change)' 
                          : 'Zoom centered on mouse (click to change)'}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="w-px h-4 bg-gray-300"></span>
                  <span>X: {mousePosition.x}</span>
                  <span>Y: {mousePosition.y}</span>
                </Badge>

                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Canvas Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative bg-gray-50">
                <canvas
                  ref={canvasRef}
                  className="border-0 block"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />

                {/* Drawing Instructions */}
                {activeTool.current === 'polygon' && !isPolygonMode.current && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm">
                    Click to start drawing a polygon
                  </div>
                )}

                {isPolygonMode.current && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm">
                    Click to add points • Click near first point or double-click to finish • Esc to cancel
                  </div>
                )}

                {/* Canvas Status */}
                {!isCanvasReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Initializing canvas...</p>
                    </div>
                  </div>
                )}

                {/* Hover Material Info */}
                <AnimatePresence>
                  {hoveredSegment?.material && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <Palette className="h-3 w-3" />
                        <span>{hoveredSegment.material.materialName}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Material Picker Dialog */}
        {/* <MaterialPickerDialog
          open={materialPickerOpen}
          onOpenChange={setMaterialPickerOpen}
          onSelect={handleMaterialSelect}
          selectedMaterialId={activeSegment?.material?.materialId}
        /> */}
      </div>
    </TooltipProvider>
  );
}