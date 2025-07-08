import * as fabric from "fabric";
import { MutableRefObject, RefObject } from "react";

interface AutoPanConfig {
  edgeThreshold?: number;
  panSpeed?: number;
  minZoomLevel?: number;
}

interface AutoPanState {
  isAutoPanning: boolean;
  setIsAutoPanning: (value: boolean) => void;
  autoPanIntervalRef: MutableRefObject<number | null>;
  panStartPositionRef: MutableRefObject<{ x: number; y: number } | null>;
  currentMousePosition: RefObject<{ x: number; y: number } | null>;
}

/**
 * Handles auto-panning of canvas when mouse is near edges
 * @param event - Fabric event object
 * @param canvasRef - Reference to the fabric canvas
 * @param state - State variables for auto-panning
 * @param config - Configuration options for auto-panning
 */
export const handleCanvasAutoPan = (
  event: fabric.TEvent,
  canvasRef: RefObject<fabric.Canvas>,
  state: AutoPanState,
  config: AutoPanConfig = {}
): void => {
  const {
    edgeThreshold = 50,
    minZoomLevel = 1,
    panSpeed = 10
  } = config;

  const {
    isAutoPanning,
    setIsAutoPanning,
    autoPanIntervalRef,
    panStartPositionRef,
    currentMousePosition
  } = state;

  const canvas = canvasRef.current;
  if (!canvas) return;

  // We'll use currentMousePosition for calculations
  const zoom = canvas.getZoom();
  console.log("Zoom level:", zoom);
  console.log("Minimum zoom level:", minZoomLevel);
  console.log("Auto-pan active:", zoom >= minZoomLevel);

  // Only enable auto-panning when zoom level is at or above the minimum (e.g., 1.2)
  if (zoom < minZoomLevel) {
    console.log("Auto-panning disabled - zoom too low");
    if (autoPanIntervalRef.current !== null) {
      cancelAnimationFrame(autoPanIntervalRef.current);
      autoPanIntervalRef.current = null;
      setIsAutoPanning(false);
      panStartPositionRef.current = null;
    }
    return;
  }

  const canvasWidth = canvas.getWidth() || 0;
  const canvasHeight = canvas.getHeight() || 0;

  const zoomedWidth = canvasWidth * zoom;
  const zoomedHeight = canvasHeight * zoom;

  // Get current viewport transform to check hidden content
  const vpt = canvas.viewportTransform!;
  console.log("canvasWidth-->", canvasWidth);
  console.log("canvasHeight-->", canvasHeight);

  console.log("currentMousePosition.current-->", currentMousePosition.current);

  if (!vpt) return;

  if (!currentMousePosition.current ||
    currentMousePosition.current.x === undefined ||
    currentMousePosition.current.y === undefined) return;

  console.log("vpt-->", vpt);

  // Get mouse position relative to the DOM element, not the canvas content
  // This is critical - we need to know if the mouse is near the edge of the visible area
  // not where it is in the canvas coordinate system
  const canvasElement = canvas.getElement();
  const rect = canvasElement.getBoundingClientRect();
  
  // Get mouse coordinates relative to the canvas DOM element
  // Need to handle both mouse and touch events
  let mouseX: number;
  let mouseY: number;
  
  if (event.e instanceof MouseEvent) {
    mouseX = event.e.clientX - rect.left;
    mouseY = event.e.clientY - rect.top;
  } else if (event.e instanceof TouchEvent && event.e.touches?.[0]) {
    // Handle touch events
    mouseX = event.e.touches[0].clientX - rect.left;
    mouseY = event.e.touches[0].clientY - rect.top;
  } else {
    // Fallback to fabric's pointer (less accurate for edge detection)
    const pointer = canvas.getPointer(event.e);
    mouseX = pointer.x * zoom;
    mouseY = pointer.y * zoom;
  }
  
  console.log("Mouse DOM position:", { x: mouseX, y: mouseY });
  console.log("Canvas DOM rect:", { width: rect.width, height: rect.height });
  console.log("Edge threshold:", edgeThreshold);
  
  // Calculate distance from each edge
  const distanceFromLeft = mouseX;
  const distanceFromRight = rect.width - mouseX;
  const distanceFromTop = mouseY;
  const distanceFromBottom = rect.height - mouseY;
  
  console.log("Distance from left edge:", distanceFromLeft, "px", distanceFromLeft < edgeThreshold ? "(NEAR)" : "");
  console.log("Distance from right edge:", distanceFromRight, "px", distanceFromRight < edgeThreshold ? "(NEAR)" : "");
  console.log("Distance from top edge:", distanceFromTop, "px", distanceFromTop < edgeThreshold ? "(NEAR)" : "");
  console.log("Distance from bottom edge:", distanceFromBottom, "px", distanceFromBottom < edgeThreshold ? "(NEAR)" : "");

  // Left edge: Pan if near left edge AND canvas is scrolled to the right (vpt[4] < 0)
  const isNearLeftEdge = (mouseX < edgeThreshold) && vpt[4] < 0;
  console.log("isNearLeftEdge:", isNearLeftEdge);
  
  // Right edge: Pan if near right edge AND there's more content to the right
  const isNearRightEdge = ((rect.width - mouseX) < edgeThreshold) &&
    (vpt[4] + canvasWidth < zoomedWidth - canvasWidth / zoom);

  // Top edge: Pan if near top edge AND canvas is scrolled down (vpt[5] < 0)
  const isNearTopEdge = (mouseY < edgeThreshold) && vpt[5] < 0;

  // Bottom edge: Pan if near bottom edge AND there's more content below
  const isNearBottomEdge = ((rect.height - mouseY) < edgeThreshold) &&
    (vpt[5] + canvasHeight < zoomedHeight - canvasHeight / zoom);


  // Cancel existing auto-pan if not near any edge
  if (!isNearLeftEdge && !isNearRightEdge && !isNearTopEdge && !isNearBottomEdge) {
    if (autoPanIntervalRef.current !== null) {
      cancelAnimationFrame(autoPanIntervalRef.current);
      autoPanIntervalRef.current = null;
      setIsAutoPanning(false);
      panStartPositionRef.current = null;
    }
    return;
  }

  // If already auto-panning, don't start another interval
  if (isAutoPanning) {
    console.log("Auto-panning already active, skipping");
    return;
  }

  // We should start auto-panning now
  console.log("Starting auto-panning");

  // Save the initial viewport position
  if (!panStartPositionRef.current) {
    panStartPositionRef.current = {
      x: vpt[4],
      y: vpt[5]
    };
  }

  setIsAutoPanning(true);

  const pan = () => {
    if (!canvas || !panStartPositionRef.current) {
      setIsAutoPanning(false);
      return;
    }

    // Get current viewport transform
    const vpt = [...canvas.viewportTransform!];
    let modified = false;
    
    // Get canvas element dimensions for dynamic speed calculation
    const canvasElement = canvas.getElement();
    const rect = canvasElement.getBoundingClientRect();

    // Calculate how much content is available to pan in each direction
    const maxPanLeft = 0; // We can't pan beyond the left edge (0)
    const totalContentWidth = canvasWidth * zoom;
    const maxPanRight = -(totalContentWidth - canvasWidth); // Negative value

    const maxPanTop = 0; // We can't pan beyond the top edge (0)
    const totalContentHeight = canvasHeight * zoom;
    const maxPanBottom = -(totalContentHeight - canvasHeight); // Negative value

    // Get updated mouse position to recalculate speed dynamically
    let currentMouseX = mouseX;
    let currentMouseY = mouseY;
    
    // If mouse is still over the canvas, update position
    if (event.e instanceof MouseEvent) {
      currentMouseX = event.e.clientX - rect.left;
      currentMouseY = event.e.clientY - rect.top;
    } else if (event.e instanceof TouchEvent && event.e.touches?.[0]) {
      currentMouseX = event.e.touches[0].clientX - rect.left;
      currentMouseY = event.e.touches[0].clientY - rect.top;
    }
    
    // Calculate speed multiplier based on how close to the edge
    // The closer to the edge, the faster the pan
    let horizontalSpeed = panSpeed;
    let verticalSpeed = panSpeed;

    // Calculate pan amounts based on which edge the mouse is near
    if (isNearLeftEdge) {
      // Calculate dynamic speed based on proximity to edge
      const proximity = Math.max(1, currentMouseX);
      horizontalSpeed = Math.min(panSpeed * 2, panSpeed * (edgeThreshold / proximity));
      
      // Pan right (increase vpt[4] value)
      const newX = Math.min(vpt[4] + horizontalSpeed, maxPanLeft);
      if (newX !== vpt[4]) {
        vpt[4] = newX;
        modified = true;
      }
    } else if (isNearRightEdge) {
      // Calculate dynamic speed based on proximity to edge
      const proximity = Math.max(1, rect.width - currentMouseX);
      horizontalSpeed = Math.min(panSpeed * 2, panSpeed * (edgeThreshold / proximity));
      
      // Pan left (decrease vpt[4] value)
      const newX = Math.max(vpt[4] - horizontalSpeed, maxPanRight);
      if (newX !== vpt[4]) {
        vpt[4] = newX;
        modified = true;
      }
    }

    if (isNearTopEdge) {
      // Calculate dynamic speed based on proximity to edge
      const proximity = Math.max(1, currentMouseY);
      verticalSpeed = Math.min(panSpeed * 2, panSpeed * (edgeThreshold / proximity));
      
      // Pan down (increase vpt[5] value)
      const newY = Math.min(vpt[5] + verticalSpeed, maxPanTop);
      if (newY !== vpt[5]) {
        vpt[5] = newY;
        modified = true;
      }
    } else if (isNearBottomEdge) {
      // Calculate dynamic speed based on proximity to edge
      const proximity = Math.max(1, rect.height - currentMouseY);
      verticalSpeed = Math.min(panSpeed * 2, panSpeed * (edgeThreshold / proximity));
      
      // Pan up (decrease vpt[5] value)
      const newY = Math.max(vpt[5] - verticalSpeed, maxPanBottom);
      if (newY !== vpt[5]) {
        vpt[5] = newY;
        modified = true;
      }
    }

    if (modified) {
      // Apply the new transform
      canvas.setViewportTransform(vpt as fabric.TMat2D);
      // Request next frame for smooth animation
      autoPanIntervalRef.current = requestAnimationFrame(pan);
    } else {
      // We've reached the maximum pan distance
      setIsAutoPanning(false);
      cancelAnimationFrame(autoPanIntervalRef.current!);
      autoPanIntervalRef.current = null;
    }
  };

  // Start the auto-pan animation
  autoPanIntervalRef.current = requestAnimationFrame(pan);
};

/**
 * Cleanup function to cancel any ongoing auto-panning
 * @param autoPanIntervalRef - Reference to the animation frame ID
 * @param setIsAutoPanning - Function to update auto-panning state
 */
export const cleanupAutoPan = (
  autoPanIntervalRef: MutableRefObject<number | null>,
  setIsAutoPanning: (value: boolean) => void
): void => {
  if (autoPanIntervalRef.current !== null) {
    cancelAnimationFrame(autoPanIntervalRef.current);
    autoPanIntervalRef.current = null;
    setIsAutoPanning(false);
  }
};
