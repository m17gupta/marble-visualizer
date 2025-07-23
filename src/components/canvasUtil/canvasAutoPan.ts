import * as fabric from 'fabric';

export interface EdgeDistances {
  left: number;
  right: number;
  top: number;
  bottom: number;
  minHorizontal: number;
  minVertical: number;
  isNearLeftEdge: boolean;
  isNearRightEdge: boolean;
  isNearTopEdge: boolean;
  isNearBottomEdge: boolean;
}

export interface AutoPanState {
  isAutoPanning: boolean;
  setIsAutoPanning: (value: boolean) => void;
  autoPanIntervalRef: React.MutableRefObject<number | null>;
  panStartPositionRef: React.MutableRefObject<{ x: number; y: number } | null>;
  currentMousePosition: React.MutableRefObject<{ x: number; y: number } | null>;
}

export interface AutoPanOptions {
  edgeThreshold?: number;
  panSpeed?: number;
  minZoomLevel?: number;
}

/**
 * Calculate distances from mouse position to canvas frame edges
 */
export const getDistanceToCanvasEdges = (
  event: fabric.TEvent,
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>,
  edgeThreshold: number = 50
): EdgeDistances | null => {
  if (!fabricCanvasRef.current) return null;

  const canvas = fabricCanvasRef.current;
  const canvasElement = canvas.getElement();
  const rect = canvasElement.getBoundingClientRect();
  
  // Get mouse position relative to the viewport
  let clientX: number;
  let clientY: number;
  
  if (event.e instanceof MouseEvent) {
    clientX = event.e.clientX;
    clientY = event.e.clientY;
  } else if (event.e instanceof TouchEvent && event.e.touches?.[0]) {
    clientX = event.e.touches[0].clientX;
    clientY = event.e.touches[0].clientY;
  } else {
    return null;
  }
  
  // Calculate distances to each edge
  const distanceToLeft = clientX - rect.left;
  const distanceToRight = rect.right - clientX;
  const distanceToTop = clientY - rect.top;
  const distanceToBottom = rect.bottom - clientY;
  
  return {
    left: distanceToLeft,
    right: distanceToRight,
    top: distanceToTop,
    bottom: distanceToBottom,
    minHorizontal: Math.min(distanceToLeft, distanceToRight),
    minVertical: Math.min(distanceToTop, distanceToBottom),
    isNearLeftEdge: distanceToLeft < edgeThreshold,
    isNearRightEdge: distanceToRight < edgeThreshold,
    isNearTopEdge: distanceToTop < edgeThreshold,
    isNearBottomEdge: distanceToBottom < edgeThreshold
  };
};

/**
 * Handle canvas auto-panning when mouse is near edges
 */
export const handleCanvasAutoPan = (
  event: fabric.TEvent,
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>,

): void => {

    const edgeThreshold = 50;
    const panSpeed = 10;
    const minZoomLevel = 1.2;

 

  if (!fabricCanvasRef.current) return;

  const canvas = fabricCanvasRef.current;
  const zoom = canvas.getZoom();

  // Only enable auto-panning when zoomed in sufficiently
  if (zoom < minZoomLevel) {
   
    return;
  }

  // Get edge distances
  const edgeDistances = getDistanceToCanvasEdges(event, fabricCanvasRef, edgeThreshold);
  if (!edgeDistances) return;

  const vpt = canvas.viewportTransform;
  if (!vpt) return;

  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  const zoomedWidth = canvasWidth * zoom;
  const zoomedHeight = canvasHeight * zoom;

  // Determine if we should start auto-panning based on edge proximity and pan constraints
  const shouldPanLeft = edgeDistances.isNearLeftEdge && vpt[4] < 0;
  const shouldPanRight = edgeDistances.isNearRightEdge && (vpt[4] + canvasWidth < zoomedWidth - canvasWidth / zoom);
  const shouldPanUp = edgeDistances.isNearTopEdge && vpt[5] < 0;
  const shouldPanDown = edgeDistances.isNearBottomEdge && (vpt[5] + canvasHeight < zoomedHeight - canvasHeight / zoom);
 
  // Handle left panning
  if (shouldPanLeft) {
    const panDistance = vpt[4] + panSpeed;
    vpt[4] = panDistance;
    canvas.setViewportTransform(vpt);
    canvas.renderAll();
  }

  // Handle right panning
  if (shouldPanRight) {
    const panDistance = vpt[4] - panSpeed;
    vpt[4] = panDistance;
    canvas.setViewportTransform(vpt);
    canvas.renderAll();
  }

  // Handle up panning
  if (shouldPanUp) {
    const panDistance = vpt[5] + panSpeed;
    vpt[5] = panDistance;
    canvas.setViewportTransform(vpt);
    canvas.renderAll();
  }

  // Handle down panning
  if (shouldPanDown) {
    const panDistance = vpt[5] - panSpeed;
    vpt[5] = panDistance;
    canvas.setViewportTransform(vpt);
    canvas.renderAll();
  }

 
};

/**
 * Clean up auto-panning resources
 */
export const cleanupAutoPan = (
  autoPanIntervalRef: React.MutableRefObject<number | null>,
  setIsAutoPanning: (value: boolean) => void
): void => {
  if (autoPanIntervalRef.current) {
    clearInterval(autoPanIntervalRef.current);
    autoPanIntervalRef.current = null;
  }
  setIsAutoPanning(false);
};

