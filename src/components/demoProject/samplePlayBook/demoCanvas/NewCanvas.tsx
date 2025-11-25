  // Programmatic zoom function (must be inside component to access refs/state)


"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import * as fabric from "fabric";
import { Canvas as FabricCanvas, Image as FabricImage, Point as FabricPoint } from "fabric";

import _throttle from "lodash/throttle";
import _debounce from "lodash/debounce";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setIsResetCanvas } from "@/redux/slices/demoProjectSlice/DemoCanvasSlice";
import { getPathPoints, handlePolygonVisibilityTest, HideAll, ShowOutline } from "@/components/canvasUtil/test/HoverSegmentTest";
import { isPointInPolygon } from "@/components/canvasUtil/ISPointInsidePolygon";
import { setSelectedDemoMasterItem } from "@/redux/slices/demoProjectSlice/DemoMasterArraySlice";
import ShowSelectedSegment from "./ShowSelectedSegment";

type Props = {
  backgroundImage: string;
  className?: string;
  onCanvasReady?: (canvas: FabricCanvas) => void;
};


type NamedFabricObject = fabric.Object & {
  name?: string;
  groupName?: string;
  subGroupName?: string;
  isActived?: boolean;
};
const NewCanvas: React.FC<Props> = ({ backgroundImage, className, onCanvasReady }) => {
  const [isImageLoading, setIsImageLoading] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { isHover, isMask ,isShowSegmentName} = useSelector((state: RootState) => state.demoCanvas);
  const demoMasterArray = useSelector((state: RootState) => state.demoMasterArray.demoMasterArray);
  // Use a ref to always have the latest value in event handlers
  const demoMasterArrayRef = useRef(demoMasterArray);
  useEffect(() => {
    demoMasterArrayRef.current = demoMasterArray;
  }, [demoMasterArray]);

  // gesture state

  const touchZoomRef = useRef<number>(1);


  // "first zoom commit expands to fullscreen"
  const firstCommitDone = useRef(false);

  // Store original canvas and image properties for reset
  const originalCanvasSize = useRef<{ width: number; height: number } | null>(null);
  const originalImageProps = useRef<{ width: number; height: number; scaleX: number; scaleY: number } | null>(null);

  const { isResetCanvas } = useSelector((state: RootState) => state.demoCanvas);

  // update the reset Canvas state
  useEffect(() => {
    if (isResetCanvas) {
      dispatch(setIsResetCanvas(false));
      resetCanvas();
    }
  }, [isResetCanvas]);


  const pinchCoords = (t1: Touch, t2: Touch) => ({
    x1: t1.clientX,
    y1: t1.clientY,
    x2: t2.clientX,
    y2: t2.clientY,
  });






  const resetCanvas = () => {
    const fc = fabricRef.current;
    const wrapper = wrapperRef.current;
    if (!fc || !wrapper) return;

    const wrapperEl = fc.wrapperEl as unknown as HTMLElement;

    // Reset CSS transform properties
    wrapperEl.style.setProperty("--tOriginX", "0px");
    wrapperEl.style.setProperty("--tOriginY", "0px");

    // Reset Fabric.js canvas properties
    fc.viewportTransform = [1, 0, 0, 1, 0, 0];
    fc.setViewportTransform(fc.viewportTransform);
    fc.setZoom(1);

    // Reset zoom tracking
    touchZoomRef.current = 1;
    firstCommitDone.current = false;

    // Always restore to initial load state (centered, not zoomed out, not offset)
    const vw = wrapper.clientWidth || window.innerWidth;
    const vh = wrapper.clientHeight || window.innerHeight;
    const targetW = Math.max(1280, Math.floor(vw * 0.6));
    const targetH = Math.max(680, Math.floor(vh * 0.6));
    // const targetW = Math.max(950, Math.floor(vw * 0.6));
    // const targetH = Math.max(558, Math.floor(vh * 0.6));

    let cw = targetW;
    let ch = targetH;
    let scale = 1;
    let imgWidth = 0;
    let imgHeight = 0;

    const backgroundImg = fc.backgroundImage;
    if (backgroundImg && backgroundImg.width && backgroundImg.height) {
      imgWidth = backgroundImg.width;
      imgHeight = backgroundImg.height;
      scale = Math.min(targetW / imgWidth, targetH / imgHeight);
      cw = Math.floor(imgWidth * scale);
      ch = Math.floor(imgHeight * scale);

      fc.setDimensions({ width: cw, height: ch });
      backgroundImg.set({
        left: 0,
        top: 0,
        scaleX: cw / imgWidth,
        scaleY: ch / imgHeight,
        originX: 'left',
        originY: 'top',
        selectable: false,
        evented: false
      });
      backgroundImg.width = imgWidth;
      backgroundImg.height = imgHeight;
    } else if (originalCanvasSize.current && originalImageProps.current) {
      // fallback to original if no background image
      fc.setDimensions({
        width: originalCanvasSize.current.width,
        height: originalCanvasSize.current.height
      });
    } else {
      fc.setDimensions({ width: cw, height: ch });
    }

    fc.requestRenderAll();

    // Center the canvas in wrapper after reset (like initial load)
    const dx = (vw - cw) / 2;
    const dy = (vh - ch) / 2;
    wrapperEl.style.transform = `translate(${dx}px, ${dy}px) scale(1)`;
  };



  // ---------------- Fabric mouse handlers ----------------
  // Handle canvas click to get target segment


  const onMouseDown = useCallback((e: any) => {
    const fc = fabricRef.current;
    const pointer = fc?.getPointer(e.e);
    if (!fc || !pointer) return;
    const target = e.target;
    // Always use the latest demoMasterArray from ref
    const currentDemoMasterArray = demoMasterArrayRef.current;
    if (target) {
      console.log('Mouse down target:', target.subGroupName);
      console.log('Matched demoMasterArray:', currentDemoMasterArray);
      const seg = currentDemoMasterArray.find(item => item.name === target.subGroupName)
      console.log('Matched segment:', seg);
      if (seg)
        dispatch(setSelectedDemoMasterItem(seg));
    }
  }, [fabricRef, dispatch]);
  
  const isShow= useRef<boolean>(isShowSegmentName);
  useEffect(() => {
    isShow.current = isShowSegmentName;
  }, [isShowSegmentName]);
  
  const handleMouseMove = useCallback((event: any) => {
    if (isHover) {
      const fc = fabricRef.current;

      if (!fc) return;
      const pointer = fc.getPointer(event.e);
      if (!pointer) return;
      // Use fabric.Point from imported fabric
      const fabricPoint = new FabricPoint(pointer.x, pointer.y);
      // handlePolygonVisibilityTest expects a RefObject, so wrap fc in a ref-like object if needed
      handlePolygonVisibilityTest({ current: fc }, fabricPoint,isShow.current);
    }
  }, [isHover,isShow]);
  const onMouseUp = () => {
    // Drag functionality removed
  };

    const centerCanvas = (x: number, y: number) => {
    const fc = fabricRef.current;
    const wrapper = wrapperRef.current;
    if (!fc || !wrapper) return;

    const wrapperEl = fc.wrapperEl as unknown as HTMLElement;
    const canvasRect = wrapperEl.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    // Calculate center position
    const dx = (wrapperRect.width - canvasRect.width) / 2;
    const dy = (wrapperRect.height - canvasRect.height) / 2;

    const currentScale = touchZoomRef.current;
    // wrapperEl.style.transform = `translate(${dx}px, ${dy}px) scale(${currentScale})`;
    wrapperEl.style.transform = `translate(${x}px, ${y}px) scale(${currentScale})`;
  };

  const onMouseWheel = (e: any) => {
    const delta = e.e.deltaY;
    let wheelDelta = e.e.wheelDelta;
    let newZoom = touchZoomRef.current;
    newZoom *= 0.999 ** delta;

    // Clamp zoom levels like in CanavasImage
    if (newZoom > 20) newZoom = 20;
    if (newZoom < 1) newZoom = 1;

    const fc = fabricRef.current;
    if (!fc) return;

    // Get mouse position relative to canvas
    const pointer = fc.getPointer(e.e);
  
    fc.zoomToPoint(new fabric.Point(pointer.x, pointer.y), newZoom);
    e.e.preventDefault();
    e.e.stopPropagation();

    touchZoomRef.current = newZoom;
    fc.renderAll();
    setZoom(newZoom); // Update zoom state to trigger re-render
// centerCanvas(pointer.x, pointer.y);


  };

  // ---------------- Touch handlers (on wrapper) ----------------
  const touchStart = (event: TouchEvent) => {
    const fc = fabricRef.current;
    if (!fc) return;

    // if (event.touches.length === 2) {
    //   initialPinchDistance.current = pinchDistance(event.touches[0], event.touches[1]);
    // }
  };

  const touchMove = (event: TouchEvent) => {
    const fc = fabricRef.current;
    const wrapper = wrapperRef.current;
    if (!fc || !wrapper) return;

    // if (event.touches.length === 2) {
    //   const currentDist = pinchDistance(event.touches[0], event.touches[1]);
    //   let scale = Number((currentDist / (initialPinchDistance.current || 1)).toFixed(2));
    //   scale = 1 + (scale - 1) / 20; // slow pinch zoom

    //   let newZoom = scale * touchZoomRef.current;
    //   // Clamp zoom levels like mouse wheel
    //   if (newZoom > 20) newZoom = 20;
    //   if (newZoom < 1) newZoom = 1;

    //   // Use Fabric.js center-based zoom like CanavasImage
    //   const center = fc.getCenter();
    //   fc.zoomToPoint(
    //     { x: center.left, y: center.top } as any,
    //     newZoom
    //   );

    //   touchZoomRef.current = newZoom;

    //   // Center the canvas after zoom
    //   centerCanvas();
    // }
    // Drag functionality removed
  };

  const touchEnd = (event: TouchEvent) => {
    // if (event.touches.length < 2) {
    //   canvasScaleToZoom();
    // }
    // Drag functionality removed
  };

  // ---------------- init / teardown ----------------
  useEffect(() => {
    // Remove previous canvas instance if exists
    if (fabricRef.current) {
      fabricRef.current.dispose();
      fabricRef.current = null;
    }
    const el = canvasElRef.current;
    const wrapper = wrapperRef.current;
    if (!el || !wrapper) return;

    const fc = new FabricCanvas(el, {
      allowTouchScrolling: false,
      width: 1400,  // initial logical size (we'll resize after image load)
      height: 750,
      zoom: 1,
      defaultCursor: "default",
      selection: false,
      renderOnAddRemove: false,
      skipTargetFind: false, // Enable hit detection for objects
    });
    fabricRef.current = fc;
    // Call the callback with canvas instance
    onCanvasReady?.(fc);

    (fc.wrapperEl as HTMLElement).style.setProperty("--tOriginX", "0px");
    (fc.wrapperEl as HTMLElement).style.setProperty("--tOriginY", "0px");

    // Load background and start SMALL (like the CodePen grid-in-a-box)
    const loadBackgroundImage = async () => {
      // setIsImageLoading(true);
      if (!backgroundImage) {
        //console.warn('No background image URL provided');
        // Create a default colored canvas instead of failing
        const vw = wrapper.clientWidth || window.innerWidth;
        const vh = wrapper.clientHeight || window.innerHeight;
        const cw = Math.floor(vw * 0.6);
        const ch = Math.floor(vh * 0.6);

        fc.setDimensions({ width: cw, height: ch });
        fc.backgroundColor = '#f0f0f0';
        fc.requestRenderAll();

        // Store original properties for fallback canvas too
        originalCanvasSize.current = { width: cw, height: ch };
        originalImageProps.current = {
          width: cw,
          height: ch,
          scaleX: 1,
          scaleY: 1
        };

        // Center the fallback canvas
        const dx = (vw - cw) / 2;
        const dy = (vh - ch) / 2;
        (fc.wrapperEl as HTMLElement).style.transform = `translate(${dx}px, ${dy}px) scale(1)`;

        // Ensure zoom is at minimum
        touchZoomRef.current = 1;
        return;
      }


      try {
        // Try loading with different CORS settings
        let img: any = null;

        try {
          // First try with crossOrigin: anonymous
          img = await FabricImage.fromURL(backgroundImage, { crossOrigin: "anonymous" });
        } catch (error) {
          console.warn('Failed to load with crossOrigin anonymous, trying without CORS:', error);
          try {
            // Try without CORS
            img = await FabricImage.fromURL(backgroundImage);
          } catch (secondError) {
            console.warn('Failed to load without CORS, trying use-credentials:', secondError);
            try {
              // Last attempt with use-credentials
              img = await FabricImage.fromURL(backgroundImage, { crossOrigin: "use-credentials" });
            } catch (thirdError) {
              console.error('Failed to load image with all CORS methods:', thirdError);
              return;
            }
          }
        }

        if (!img) {
          console.error('Failed to load image after all attempts');
          // setIsImageLoading(false);
          return;
        }

        //  console.log('Image loaded successfully:', img.width, 'x', img.height);

        // Guard: If img.width or img.height is undefined, treat as error
        if (typeof img.width !== 'number' || typeof img.height !== 'number') {
          // console.error('Image object missing width/height:', img);
          // setIsImageLoading(false);
          return;
        }
        const iw = img.width;
        const ih = img.height;

        const vw = wrapper.clientWidth || window.innerWidth;
        const vh = wrapper.clientHeight || window.innerHeight;

        // Start at ~60% of wrapper to get that "small initial view" feel
        const targetW = Math.max(1280, Math.floor(vw * 0.6));
        const targetH = Math.max(680, Math.floor(vh * 0.6));
        // const targetW = Math.max(950, Math.floor(vw * 0.6));
        // const targetH = Math.max(558, Math.floor(vh * 0.6));

        // scale image to fit targetW x targetH
        const scale = Math.min(targetW / iw, targetH / ih);
        const cw = Math.floor(iw * scale);
        const ch = Math.floor(ih * scale);

        // console.log('Setting canvas dimensions:', cw, 'x', ch);
        fc.setDimensions({ width: cw, height: ch });

        // Set background image using the proper method
        img.set({
          left: 0,
          top: 0,
          originX: 'left',
          originY: 'top',
          scaleX: cw / iw,
          scaleY: ch / ih,
          selectable: false,
          evented: false
        });

        // Wait for canvas to be fully initialized before setting background
        setTimeout(() => {
          fc.backgroundImage = img;
          fc.requestRenderAll();
          setIsImageLoading(false);
        }, 0);

        // Store original canvas and image properties for reset functionality
        originalCanvasSize.current = { width: cw, height: ch };
        originalImageProps.current = {
          width: iw,
          height: ih,
          scaleX: cw / iw,
          scaleY: ch / ih
        };

        // Always center the canvas in the wrapper
        const dx = (vw - cw) / 2;
        const dy = (vh - ch) / 2;
        (fc.wrapperEl as HTMLElement).style.transform = `translate(${dx}px, ${dy}px) scale(1)`;

        // Ensure zoom is set to minimum (1)
        touchZoomRef.current = 1;
      } catch (error) {
        console.error('Error loading background image:', error);
        //setIsImageLoading(false);
      }
    };
    //console.log('Background image prop changed, reloading:');
    loadBackgroundImage();

    // Fabric mouse events
    fc.on("mouse:down", onMouseDown);
    // Use custom handleMouseMove for hover effect
    fc.on("mouse:move", handleMouseMove);
    fc.on("mouse:up", onMouseUp);
    fc.on("mouse:wheel", onMouseWheel);

    // touch events on wrapper (Fabric doesn't emit touch)
    wrapper.addEventListener("touchstart", touchStart, { passive: false });
    wrapper.addEventListener("touchmove", touchMove, { passive: false });
    wrapper.addEventListener("touchend", touchEnd);

    return () => {
      wrapper.removeEventListener("touchstart", touchStart);
      wrapper.removeEventListener("touchmove", touchMove);
      wrapper.removeEventListener("touchend", touchEnd);
      fc.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundImage]);


  // handle Mask
  useEffect(() => {
    const fc = fabricRef.current;
    if (!fc) return;
    if (isMask) {
      ShowOutline({ current: fc }, "mask", true);
    } else {
      HideAll({ current: fc }, true);
    }
  }, [isMask]);


  return (
    <>
      <ShowSelectedSegment
        canvas={fabricRef}
        zoom={zoom}
      />
      <section
        ref={wrapperRef}
        className={["relative inline-block w-full", className || ""].join(" ")}
        style={{
          touchAction: "none",      // important for pinch/drag
          height: "100vh",          // wrapper = fullscreen height
          overflow: "hidden",
        }}
      >
      
        {isImageLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70">
            <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span className="ml-3 text-blue-700 font-medium">Loading image...</span>
          </div>
        )}
        <canvas ref={canvasElRef} id="dzinly-fabric-canvas" />
      </section>
    </>

  );
};

export default NewCanvas;