// import { AppDispatch, RootState } from '@/redux/store';
// import React, { useEffect, useRef } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import * as fabric from "fabric";
// interface CanvasHoverLayerProps {
//   imageUrl?: string;
//   width?: number;
//   height?: number;
//   className?: string;
//   onImageLoad?: () => void;
// }
// const PolygonOverlay = ({
//   imageUrl,
//   width = 800,
//   height = 600,
//   className,
//   onImageLoad,
// }: CanvasHoverLayerProps) => {
//     const dispatch = useDispatch<AppDispatch>();


//       const {
//         isCanvasReady,
//         canavasActiveTool,
//       } = useSelector((state: RootState) => state.canvas);

//        const canvasRef = useRef<HTMLCanvasElement>(null);
//         const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
//         const backgroundImageRef = useRef<fabric.Image | null>(null)


//           // Initialize Fabric.js canvas
//           useEffect(() => {
//             if (!canvasRef.current || fabricCanvasRef.current) return;
        
//             const canvas = new fabric.Canvas(canvasRef.current, {
//               width,
//               height,
//               backgroundColor: "#f8f9fa",
//               selection: true,
//               preserveObjectStacking: true,
//             });
        
//             fabricCanvasRef.current = canvas;
        
//             // Store the original viewport transform
//             originalViewportTransform.current = canvas.viewportTransform
//               ? ([...canvas.viewportTransform] as fabric.TMat2D)
//               : null;
        
//             // Canvas event handlers
//             canvas.on("mouse:down", handleMouseDown);
//             canvas.on("mouse:move", (event) => {
//               handleMouseMove(event);
//             });
//             canvas.on("mouse:dblclick", handleDoubleClick);
//             // canvas.on('selection:created', handleSelection);
//             // canvas.on('selection:updated', handleSelection);
//             canvas.on("selection:cleared", () => {
//               // dispatch(selectSegment(null));
//             });
        
//             canvas.on("mouse:wheel", (event) => {
//               handleMouseWheel(event);
//               dispatch(setZoom(canvas.getZoom()));
//             });
//             // canvas.on('object:modified', handleObjectModified);
//             // canvas.on('mouse:over', handleMouseOver);
//             // canvas.on('mouse:out', handleMouseOut);
        
//             // Keyboard shortcuts
//             const handleKeyDown = (e: KeyboardEvent) => {
//               if (e.ctrlKey || e.metaKey) {
//                 switch (
//                   e.key.toLowerCase() // Use toLowerCase to handle both uppercase and lowercase keys
//                 ) {
//                   case "c":
//                     e.preventDefault();
//                     if (activeSegment) {
//                       // dispatch(copySegment(activeSegmentId));
//                       // toast.success('Segment copied');
//                     }
//                     break;
//                   case "v":
//                     e.preventDefault();
//                     // if (copiedSegment) {
//                     //   // dispatch(pasteSegment());
//                     //   // toast.success('Segment pasted');
//                     // }
//                     break;
//                   case "z":
//                     e.preventDefault();
//                     if (e.shiftKey) {
//                       handleRedo();
//                     } else {
//                       handleUndo();
//                     }
//                     break;
//                 }
//               } else {
//                 switch (e.key) {
//                   case "Delete":
//                   case "Backspace":
//                     if (activeSegment) {
//                       handleDeleteSelected();
//                     }
//                     break;
//                   case "Escape":
//                     if (isPolygonMode.current) {
//                       // Fixed: Use isPolygonMode.current instead of isPolygonMode
//                       handleCancelDrawing();
//                     }
//                     break;
//                 }
//               }
//             };
        
//             document.addEventListener("keydown", handleKeyDown);
        
//             dispatch(setCanvasReady(true));
        
//             return () => {
//               document.removeEventListener("keydown", handleKeyDown);
        
//               // Clean up auto-panning
//               cleanupAutoPan(autoPanIntervalRef, setIsAutoPanning);
        
//               canvas.dispose();
//               fabricCanvasRef.current = null;
//               backgroundImageRef.current = null;
//               dispatch(setCanvasReady(false));
//             };
//             // eslint-disable-next-line react-hooks/exhaustive-deps
//           }, [width, height, activeSegment, dispatch]);
//   return (
//     <div>PolygonOverlay</div>
//   )
// }

// export default PolygonOverlay