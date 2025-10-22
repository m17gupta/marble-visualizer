import React, { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FiTrash2, FiX, FiSettings, FiClock } from "react-icons/fi";
// import StudioActionLayout from "./studiolayoutactions/StudioActionLayout";
// import StudioActionComment from "./studiolayoutactions/StudioActionComment";
// import StudioLayoutMeasurements from "./studiolayoutactions/StudioLayoutMeasurements";
import StudioLayoutHisory from "./StudioLayoutHisory";
import StudioActionLayout from "./studiolayoutactions/StudioActionLayout";
import StudioActionComment from "./studiolayoutactions/StudioActionComment";
import StudioLayoutMeasurements from "./studiolayoutactions/StudioLayoutMeasurements";

/* ---------- Small round button ---------- */
const CircleBtn = ({
  onClick,
  children,
  size = 44,
  title,
  btnRef,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  size?: number;
  title?: string;
  btnRef?: React.Ref<HTMLButtonElement>;
}) => (
  <button
    ref={btnRef}
    type="button"
    title={title}
    onClick={onClick}
    className="grid place-items-center rounded-full bg-blue-600 text-white shadow-lg hover:scale-105 active:scale-95 transition-transform focus:outline-none p-0 [&>svg]:block shrink-0"
    style={{ width: size, height: size }}
  >
    {children}
  </button>
);

type Mode = "expandRight" | "expandLeft" | "split";

const PADDING = 12;
const CENTER_TOL = 140; // center zone half-width in px

const StudioLayout: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLButtonElement>(null);   // closed state anchor
  const closeRef = useRef<HTMLButtonElement>(null); // open state anchor

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("expandRight"); // locked at open time
  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - 200,
    y: window.innerHeight - 200,
  });

  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [down, setDown] = useState<{ x: number; y: number } | null>(null);

  // --- decide mode from the current dot position (in viewport coords) ---
  const decideModeFromDot = (): Mode => {
  const el = dotRef.current;
  if (!el) return "expandRight";
  const r = el.getBoundingClientRect();
  const ax = r.left + r.width / 2;
  const mid = window.innerWidth / 2;
  const diff = Math.abs(ax - mid);
  if (diff <= CENTER_TOL) {
    return "split";   // ✅ force split if dot near center
  }
  return ax < mid ? "expandRight" : "expandLeft";
};


  const clampToViewport = (nx: number, ny: number) => {
    const rect = rootRef.current?.getBoundingClientRect();
    const w = rect?.width ?? 52;
    const h = rect?.height ?? 52;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const minX = PADDING;
    const maxX = vw - w - PADDING;
    const minY = PADDING;
    const maxY = vh - h - PADDING;
    return {
      x: Math.min(Math.max(nx, minX), Math.max(minX, maxX)),
      y: Math.min(Math.max(ny, minY), Math.max(minY, maxY)),
    };
  };

  // --- drag start on whole widget (dot or close) ---
  const onRootMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDown({ x: e.clientX, y: e.clientY });
    setDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.preventDefault();
  };

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragging) return;
      setPosition(clampToViewport(e.clientX - offset.x, e.clientY - offset.y));
    };
    const up = (e: MouseEvent) => {
      if (dragging && down) {
        const dx = Math.abs(e.clientX - down.x);
        const dy = Math.abs(e.clientY - down.y);
        if (Math.hypot(dx, dy) < 5) {
          // CLICK: toggle open and lock mode using DOT position
          if (!open) setMode(decideModeFromDot());
          setOpen((p) => !p);
          // after width change, clamp once
          setTimeout(() => {
            const p = rootRef.current?.getBoundingClientRect();
            setPosition((prev) =>
              clampToViewport(prev.x, prev.y - (p ? 0 : 0)) // no Y shift, just clamp
            );
          }, 0);
        }
      }
      setDragging(false);
      setDown(null);
    };
    if (dragging) {
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    }
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging, offset, down, open]);

  // --- actions strip ---
  const IconsStrip = () => (
    <>
      <StudioActionLayout />
      <StudioActionComment />
      <StudioLayoutMeasurements />
      <CircleBtn title="Settings">
        <FiSettings size={18} />
      </CircleBtn>
      {/* <CircleBtn title="Timer">
        <FiClock size={18} />
      </CircleBtn> */}
      <StudioLayoutHisory/>
      <CircleBtn title="Delete">
        <FiTrash2 size={18} />
      </CircleBtn>
    </>
  );

  const SaveButton = (
    <button className="px-5 py-2 font-semibold text-white transition bg-teal-500 rounded-lg shadow-md hover:bg-teal-600">
      Save
    </button>
  );

  return (
    <div
      ref={rootRef}
      className="absolute z-[9] cursor-move select-none"
      style={{ left: position.x, top: position.y }}
      onMouseDown={onRootMouseDown}
    >
      {/* CLOSED: DOT (anchor = dotRef). No onClick; click is handled by root (distance). */}
      {!open && (
        <CircleBtn title="Open toolbar" btnRef={dotRef}>
          <BsThreeDots size={22} />
        </CircleBtn>
      )}

      {/* OPEN: CLOSE + toolbar */}
      {open && (
        <>
          {/* Left/Right expand (opposite side) */}
          {(mode === "expandRight" || mode === "expandLeft") && (
            <div
              className={`flex items-center gap-4 absolute left-0 right-0 ${
                mode === "expandRight" ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <CircleBtn title="Close toolbar" size={56} btnRef={closeRef} onClick={() => setOpen(false)}>
                <FiX size={26} />
              </CircleBtn>

              <div
                className={`flex items-center gap-4 ${
                  mode === "expandRight" ? "flex-row" : "flex-row-reverse"
                }`}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {mode === "expandRight" ? (
                  <>
                    <IconsStrip />
                    {SaveButton}
                  </>
                ) : (
                  <>
                    {SaveButton}
                    <IconsStrip />
                  </>
                )}
              </div>
            </div>
          )}

          {/* Center: split 3 left + 3 right; Save rightmost */}
          {mode === "split" && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4" onMouseDown={(e) => e.stopPropagation()}>
                <StudioActionLayout />
                <StudioActionComment />
                <StudioLayoutMeasurements />
              </div>

              <CircleBtn title="Close toolbar" size={56} btnRef={closeRef} onClick={() => setOpen(false)}>
                <FiX size={26} />
              </CircleBtn>

              <div className="flex items-center gap-4" onMouseDown={(e) => e.stopPropagation()}>
                <CircleBtn title="Settings">
                  <FiSettings size={18} />
                </CircleBtn>
                <CircleBtn title="Timer">
                  <FiClock size={18} />
                </CircleBtn>
                <CircleBtn title="Delete">
                  <FiTrash2 size={18} />
                </CircleBtn>
                {SaveButton}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudioLayout;
