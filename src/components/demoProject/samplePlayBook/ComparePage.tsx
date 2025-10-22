"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronsLeftRight } from "lucide-react";

/**
 * Props:
 * leftSrc  - left (before) image URL
 * rightSrc - right (after) image URL
 * onClose  - close callback
 */
const ComparePage: React.FC<{
  leftSrc: string;
  rightSrc: string;
  onClose: () => void;
}> = ({ leftSrc, rightSrc, onClose }) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState(0.5); // 0..1

  // Drag functionality (mouse + touch)
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const getPct = (clientX: number) => {
      const rect = wrap.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      return x / rect.width;
    };

    let dragging = false;

    const down = (e: PointerEvent) => {
      dragging = true;
      (e.target as Element).setPointerCapture?.(e.pointerId);
      setPos(getPct(e.clientX));
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      setPos(getPct(e.clientX));
    };
    const up = () => {
      dragging = false;
    };

    const handle = wrap.querySelector("[data-handle]") as HTMLElement | null;
    handle?.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    return () => {
      handle?.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div className="relative mt-4 w-full overflow-hidden rounded-xl border bg-white">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow hover:bg-white"
      >
        <X className="h-4 w-4" />
      </button>

      <div ref={wrapRef} className="relative w-full select-none">
        {/* Right image */}
        <img src={rightSrc} alt="Right" className="block h-auto w-full" />

        {/* Left (clipped) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${pos * 100}%` }}
        >
          <img src={leftSrc} alt="Left" className="block h-auto w-full" />
        </div>

        {/* Divider line */}

        {/* Divider line */}
        <div
          className="pointer-events-none absolute inset-y-0"
          style={{
            left: pos <= 0 ? 0 : pos >= 1 ? 'calc(100% - 2px)' : `calc(${pos * 100}% - 1px)`,
            width: 2
          }}
        >
          <div className="h-full bg-white/70 mix-blend-difference" />
        </div>

        {/* Handle */}
        <button
          type="button"
          data-handle
          className={`absolute top-1/2 z-20 -translate-y-1/2 rounded-lg bg-white p-1.5 shadow ring-1 ring-black/5${pos > 0 && pos < 1 ? ' translate-x-[-50%]' : ''}`}
          style={{ left: pos <= 0 ? 0 : pos >= 1 ? '100%' : `${pos * 100}%` }}
        >
          <ChevronsLeftRight className="h-5 w-5" />
        </button>

        {/* Bottom controls */}
        <div className="pointer-events-auto absolute inset-x-0 bottom-4 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            className="h-10 min-w-[120px] rounded-xl bg-white/95"
            onClick={() => setPos(0)}
          >
            Left
          </Button>
          <Button
            variant="outline"
            className="h-10 rounded-xl bg-white/95 px-3"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            className="h-10 min-w-[120px] rounded-xl bg-zinc-900 text-white hover:bg-zinc-800"
            onClick={() => setPos(1)}
          >
            Right
          </Button>
        </div>

        {/* Branding */}
        <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs text-zinc-700 shadow">
          Powered by <span className="font-semibold text-blue-600">Dzinly</span>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
