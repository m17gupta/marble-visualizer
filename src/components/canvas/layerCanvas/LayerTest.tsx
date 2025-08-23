// import { useCallback, useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import { AnimatePresence, motion } from "framer-motion";

// import { toast } from "sonner";

// import { cn } from "@/lib/utils";

// import { Card, CardContent } from "@/components/ui/card";

// import { TooltipProvider } from "@/components/ui/tooltip";

// import * as fabric from "fabric";

// import { setCanvasReady, setZoom } from "@/redux/slices/canvasSlice";

// import { AppDispatch, RootState } from "@/redux/store";

// import {
//   handlePolygonVisibilityOnMouseMove,
//   HideAllSegments,
// } from "@/components/canvasUtil/HoverSegment";

// type NamedFabricObject = fabric.Object & { name?: string };

// interface CanvasTestLayerProps {
//   imageUrl?: string;

//   width?: number; // initial MIN width of container

//   height?: number; // initial MIN height of container

//   className?: string;

//   onImageLoad?: () => void;
// }

// type PointModel = { x: number; y: number };

// const LayerCanvas = ({
//   imageUrl,

//   width = 800,

//   height = 600,

//   className,

//   onImageLoad,
// }: CanvasTestLayerProps) => {
//   const dispatch = useDispatch<AppDispatch>();

//   const { isCanvasReady } = useSelector((state: RootState) => state.canvas);
//   const { allPolygon } = useSelector((state: RootState) => state.testCanvas);

//   // Refs

//   const wrapperRef = useRef<HTMLDivElement | null>(null); // container we observe for resize

//   const canvasRef = useRef<HTMLCanvasElement | null>(null); // actual <canvas>

//   const fabricCanvasRef = useRef<fabric.Canvas | null>(null); // Fabric canvas

//   const imageRef = useRef<fabric.FabricImage | null>(null); // loaded image object

//   const imgNatural = useRef<{ w: number; h: number } | null>(null);

//   const [loading, setLoading] = useState(false);

//   const fitAndCenter = useCallback(() => {
//     const canvas = fabricCanvasRef.current;

//     const imgSize = imgNatural.current;

//     const wrapper = wrapperRef.current;

//     if (!canvas || !imgSize || !wrapper) return;

//     // 1) Size backing store to container (respect DPR for crisp rendering)

//     const cssW = Math.max(wrapper.clientWidth, 1);

//     const cssH = Math.max(wrapper.clientHeight, 1);

//     const dpr = window.devicePixelRatio || 1;

//     canvas.setDimensions({ width: cssW * dpr, height: cssH * dpr });

//     // Ensure CSS size stays logical

//     const lower = canvas.getElement() as HTMLCanvasElement;

//     lower.style.width = `${cssW}px`;

//     lower.style.height = `${cssH}px`;

//     // 2) Compute zoom that fits the full natural image into the viewport

//     const zoomX = (cssW * dpr) / imgSize.w;

//     const zoomY = (cssH * dpr) / imgSize.h;

//     const zoom = Math.min(zoomX, zoomY);

//     canvas.setZoom(zoom);

//     // 3) Center image-space in the viewport by panning

//     const vpw = canvas.getWidth() / zoom;
//     const vph = canvas.getHeight() / zoom;
//     const panX = (imgSize.w - vpw) / 2;
//     const panY = (imgSize.h - vph) / 2;

//     canvas.setZoom(zoom);
//     canvas.absolutePan(new fabric.Point(panX, panY)); // ⟵ put this back
//     dispatch(setZoom(canvas.getZoom()));
//     canvas.requestRenderAll();
//   }, [dispatch]);

//   // Build and add a polygon from image-space coords (no offsets/scales!)

//   const addPolygon = (annotation: number[], index: number) => {
//     const canvas = fabricCanvasRef.current;
//     if (!canvas || !annotation || annotation.length < 6) return;

//     // 1) Build absolute image-space points
//     const absPts: PointModel[] = [];
//     for (let i = 0; i < annotation.length; i += 2) {
//       absPts.push({ x: annotation[i], y: annotation[i + 1] });
//     }

//     // 2) Compute the bounding box of those absolute points
//     const minX = Math.min(...absPts.map((p) => p.x));
//     const minY = Math.min(...absPts.map((p) => p.y));

//     // 3) Convert to local polygon coordinates (relative to minX/minY)
//     const localPts = absPts.map((p) => ({ x: p.x - minX, y: p.y - minY }));

//     // 4) Create the polygon with local points, position it at minX/minY
//     const poly = new fabric.Polygon(localPts, {
//       left: minX,
//       top: minY,
//       originX: "left",
//       originY: "top",
//       fill: "rgba(0,128,0,0.25)",
//       stroke: "red",
//       strokeWidth: 2,
//       selectable: false,
//       evented: true,
//       objectCaching: false,
//     });

//     (poly as NamedFabricObject).name = `segment-Test-${index}`;
//     canvas.add(poly);
//   };

//   // Mouse move highlighter

//   const handleMouseMove = useCallback((event: fabric.TEvent) => {
//     if (!fabricCanvasRef.current) return;
//     console.log("event---->", fabricCanvasRef.current);
//     const ev = event as unknown as { target?: NamedFabricObject };

//     const target = ev.target;

//     if (target?.name) {
//       handlePolygonVisibilityOnMouseMove(fabricCanvasRef, target.name);
//     } else {
//       HideAllSegments(fabricCanvasRef);
//     }
//   }, []);

//   useEffect(() => {
//     if (!canvasRef.current || fabricCanvasRef.current) return;

//     const canvas = new fabric.Canvas(canvasRef.current, {
//       selection: false,

//       preserveObjectStacking: true,

//       backgroundColor: "#282828",
//     });

//     fabricCanvasRef.current = canvas;

//     // Events

//     canvas.on("mouse:move", handleMouseMove);

//     canvas.on("mouse:wheel", () => dispatch(setZoom(canvas.getZoom())));

//     dispatch(setCanvasReady(true));

//     return () => {
//       canvas.dispose();

//       fabricCanvasRef.current = null;

//       imageRef.current = null;

//       imgNatural.current = null;

//       dispatch(setCanvasReady(false));
//     };
//   }, [dispatch, handleMouseMove]);

//   // Load image (v6 Promise API) and draw polygons

//   useEffect(() => {
//     const run = async () => {
//       if (!fabricCanvasRef.current || !isCanvasReady || !imageUrl) return;

//       const canvas = fabricCanvasRef.current;

//       // Clear previous scene (image + polys)

//       canvas.getObjects().forEach((o) => canvas.remove(o));

//       canvas.discardActiveObject();

//       canvas.requestRenderAll();

//       setLoading(true);

//       try {
//         // v6: FabricImage.fromURL returns a Promise<FabricImage>

//         const img = await fabric.FabricImage.fromURL(imageUrl, {
//           crossOrigin: "anonymous",
//         });

//         // Natural image size becomes our "world units"

//         const w = img.width ?? 0;

//         const h = img.height ?? 0;

//         imgNatural.current = { w, h };

//         // Place at origin (no scaling); we will fit using viewport zoom

//         img.set({
//           left: 0,

//           top: 0,

//           selectable: false,

//           evented: false,
//         });

//         canvas.add(img);

//         imageRef.current = img;

//         canvas.sendObjectToBack(img);

//         fitAndCenter();

//         onImageLoad?.();
//       } catch (err) {
//         console.error("Image load failed:", err);

//         toast.error(
//           imageUrl.includes("s3.") || imageUrl.includes("amazonaws.com")
//             ? "Failed to load S3 image due to CORS. Please check your S3 bucket CORS configuration allows requests from this domain."
//             : "Failed to load image. The server may block cross-origin requests."
//         );

//         onImageLoad?.();
//       } finally {
//         setLoading(false);
//       }
//     };

//     run();
//   }, [imageUrl, isCanvasReady, fitAndCenter, onImageLoad]);

//   // ---------------------------

//   // Observe container resize -> fit & center

//   // ---------------------------

//   useEffect(() => {
//     if (!wrapperRef.current) return;

//     const ro = new ResizeObserver(() => fitAndCenter());

//     ro.observe(wrapperRef.current);

//     return () => ro.disconnect();
//   }, [fitAndCenter]);

//   // ---------------------------
//   useEffect(() => {
//     console.log("annotation", allPolygon);

//     if (fabricCanvasRef.current && allPolygon.length > 0) {
//       allPolygon.forEach((polygon, index) => {
//         addPolygon(polygon.annotation, index);
//       });
//       // If there are polygons, ensure they are visible
//       fabricCanvasRef.current.getObjects().forEach((obj) => {
//         if (obj.type === "polygon") {
//           obj.set({ visible: true });
//         }
//       });
//       fabricCanvasRef.current.renderAll();
//     } else if (fabricCanvasRef.current && allPolygon.length === 0) {
//       // remove existing polygon if annotation is empty
//       const existingPolygon = fabricCanvasRef.current
//         .getObjects()
//         .find((obj) => obj.type === "polygon");
//       if (existingPolygon) {
//         fabricCanvasRef.current.remove(existingPolygon);
//         fabricCanvasRef.current.renderAll();
//       }
//     }
//   }, [fabricCanvasRef, allPolygon, dispatch]);

//   return (
//     <TooltipProvider>
//       <div className={cn("flex flex-col space-y-4", className)}>
//         <motion.div
//           initial={{ opacity: 0, scale: 0.98 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.25 }}
//           className="relative px-4"
//         >
//           <Card className="overflow-hidden">
//             <CardContent className="p-0">
//               {/* This wrapper is the responsive container we fit to */}
//               <div
//                 ref={wrapperRef}
//                 className="relative bg-gray-50 flex items-center justify-center min-h-[600px] min-w-[800px]"
//                 style={{ minWidth: width, minHeight: height }}
//               >
//                 <canvas
//                   ref={canvasRef}
//                   className="block mx-auto"
//                   style={{ maxWidth: "100%", height: "auto" }}
//                 />

//                 {/* Overlay: init / loading */}
//                 <AnimatePresence>
//                   {(!isCanvasReady || loading) && (
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       className="absolute inset-0 flex items-center justify-center bg-gray-100/70"
//                     >
//                       <div className="text-center">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
//                         <p className="text-sm text-muted-foreground">
//                           {isCanvasReady
//                             ? "Loading image…"
//                             : "Initializing canvas…"}
//                         </p>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </TooltipProvider>
//   );
// };

// export default LayerCanvas;
