import * as fabric from 'fabric';

// Types for the animation
export interface PointModel {
  x: number;
  y: number;
}

interface CustomCircleOptions {
  name?: string;
  animated?: boolean;
}

/**
 * Creates animation effect when mouse hovers near the first point of a polygon
 * @param mousePoint Current mouse position
 * @param canvas Fabric canvas instance
 * @param allPointsRef Array containing the first point coordinates [x, y]
 * @param tolerance Distance tolerance for hover detection
 */
export const FinalAnimationPoint = (
  mousePoint: PointModel,
  canvas: fabric.Canvas,
  allPointsRef: number[],
  tolerance: number
): void => {
  if (!canvas) return;

  if (mousePoint && allPointsRef && allPointsRef.length > 0) {
    const top = mousePoint.y;
    const left = mousePoint.x;
    const point1 = allPointsRef[0]; // x coordinate
    const point2 = allPointsRef[1]; // y coordinate
    
    const existingFirstCircle = canvas.getObjects().find(
      obj => (obj as any).name === "firstpoint"
    ) as fabric.Circle & CustomCircleOptions;
    
    const existingFinalCircle = canvas.getObjects().find(
      obj => (obj as any).name === "finalPoint"
    ) as fabric.Circle & CustomCircleOptions;
    
    // Check if mouse is near the first point
    if (
      Math.abs(top - point2) < tolerance &&
      Math.abs(point1 - left) < tolerance &&
      existingFirstCircle &&
      existingFinalCircle
    ) {
      // Create animation effect on final point - just zoom once
      if (!existingFinalCircle.animated) {
        // Store original properties
        const originalRadius = existingFinalCircle.radius || tolerance;
        
        // Flag to prevent multiple animations
        (existingFinalCircle as any).animated = true;
        
        // Add a glowing effect
        existingFinalCircle.set({
          stroke: '#FF0000',
          strokeWidth: 2,
          shadow: new fabric.Shadow({
            color: 'rgba(255,0,0,0.7)',
            blur: 10
          })
        });
        
        // Simple zoom animation using fabric's animate method
        existingFinalCircle.animate({
          radius: originalRadius * 1.5
        }, {
          onChange: canvas.renderAll.bind(canvas),
          duration: 300,
          onComplete: () => {
            // Return to original size after growing
            existingFinalCircle.animate({
              radius: originalRadius
            }, {
              onChange: canvas.renderAll.bind(canvas),
              duration: 300
            });
          }
        });
        
        canvas.renderAll();
      }
    } else {
      // Reset animation when mouse moves away
      if (existingFinalCircle && (existingFinalCircle as any).animated) {
        // Reset properties
        existingFinalCircle.set({
          radius: tolerance,
          opacity: 1,
          strokeWidth: 1,
          shadow: undefined
        });
        (existingFinalCircle as any).animated = false;
        
        canvas.renderAll();
      }
    }
  }
};

/**
 * Creates a hover animation effect for polygon completion
 * @param mousePoint Current mouse position
 * @param canvas Fabric canvas instance
 * @param firstPoint The first point of the polygon being drawn
 * @param tolerance Distance tolerance for hover detection
 */
export const animatePolygonCompletion = (
  mousePoint: PointModel,
  canvas: fabric.Canvas,
  firstPoint: PointModel,
  tolerance: number = 10
): boolean => {
  if (!canvas || !mousePoint || !firstPoint) return false;

  const distance = Math.sqrt(
    Math.pow(mousePoint.x - firstPoint.x, 2) + 
    Math.pow(mousePoint.y - firstPoint.y, 2)
  );

  // Find the first point circle
  const firstPointCircle = canvas.getObjects().find(
    obj => (obj as any).data?.type === 'temp-point' && (obj as any).data?.isFirst
  ) as fabric.Circle & CustomCircleOptions;

  if (distance < tolerance && firstPointCircle) {
    // Mouse is near first point - animate it
    if (!(firstPointCircle as any).animated) {
      const originalRadius = firstPointCircle.radius || 4;
      
      (firstPointCircle as any).animated = true;
      
      // Add glowing effect
      firstPointCircle.set({
        stroke: '#FF1493',
        strokeWidth: 3,
        shadow: new fabric.Shadow({
          color: 'rgba(255, 20, 147, 0.8)',
          blur: 8
        })
      });
      
      // Pulse animation
      firstPointCircle.animate({
        radius: originalRadius * 1.8
      }, {
        onChange: canvas.renderAll.bind(canvas),
        duration: 400,
        easing: fabric.util.ease.easeOutQuad,
        onComplete: () => {
          firstPointCircle.animate({
            radius: originalRadius
          }, {
            onChange: canvas.renderAll.bind(canvas),
            duration: 400,
            easing: fabric.util.ease.easeInQuad
          });
        }
      });
      
      canvas.renderAll();
    }
    return true;
  } else if (firstPointCircle && (firstPointCircle as any).animated) {
    // Mouse moved away - reset
    firstPointCircle.set({
      radius: 4,
      stroke: '#ffffff',
      strokeWidth: 2,
      shadow: undefined
    });
    (firstPointCircle as any).animated = false;
    canvas.renderAll();
  }
  
  return false;
};
