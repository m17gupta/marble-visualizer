"use client";

import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// If you already have a Badge/Chip component, swap these spans for it.
const Chip: React.FC<{ children: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>> = ({ children, className = "", ...rest }) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full border text-sm leading-none ${className}`}
    {...rest}
  >
    {children}
  </span>
);

// Dummy swatch tiles (replace with real CDN paths or project assets)
const SWATCHES: string[] = [
  "/assets/swatch/stacked-stone-1.jpg",
  "/assets/swatch/siding-grey-1.jpg",
  "/assets/swatch/siding-ivory-1.jpg",
  "/assets/swatch/wood-red-1.jpg",
  "/assets/swatch/pebble-taupe-1.jpg",
  "/assets/swatch/siding-silver-1.jpg",
  "/assets/swatch/charcoal-tiles-1.jpg",
  "/assets/swatch/wood-oak-1.jpg",
  "/assets/swatch/wood-dark-1.jpg",
];

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-sm font-medium text-gray-700 mb-2">{children}</div>
);

const CollapsibleRow: React.FC<{
  title: string;
  count?: number;
  children?: React.ReactNode;
}> = ({ title, count = 0, children }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
          <span>{title}</span>
          <span className="inline-flex items-center justify-center text-white text-[10px] bg-violet-600 rounded-full w-5 h-5">
            {count}
          </span>
        </div>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" stroke="#111" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
};

const ChatPallet: React.FC = () => {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(
    () => SWATCHES.filter((_, i) => `${i + 1}`.includes(query.trim()) || query.trim() === ""),
    [query]
  );

  return (
    <Sheet>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <button
                type="button"
                className="text-base hover:text-purple-600 transition p-0 inline-flex items-center px-1 py-1"
                aria-label="Open Materials"
              >
                {/* same trigger icon as your screenshot */}
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bricks" viewBox="0 0 16 16">
                        <path d="M0 .5A.5.5 0 0 1 .5 0h15a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H14v2h1.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H14v2h1.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5H2v-2H.5a.5.5 0 0 1-.5-.5v-3A.5.5 0 0 1 .5 6H2V4H.5a.5.5 0 0 1-.5-.5zM3 4v2h4.5V4zm5.5 0v2H13V4zM3 10v2h4.5v-2zm5.5 0v2H13v-2zM1 1v2h3.5V1zm4.5 0v2h5V1zm6 0v2H15V1zM1 7v2h3.5V7zm4.5 0v2h5V7zm6 0v2H15V7zM1 13v2h3.5v-2zm4.5 0v2h5v-2zm6 0v2H15v-2z"></path>
                      </svg>
              </button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add Pallet</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <SheetContent side="left" className="w-[380px] sm:w-[420px] !left-0 max-w-[100vw] overflow-y-auto">
        <SheetHeader className="mb-3">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        {/* Category Pills */}
        <div className="space-y-3">
          <SectionTitle>Category</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {[
              "Brick",
              "Siding",
              "Wall Panels",
              "Pediment",
              "EIFS",
              "Stone",
              "Stain",
              "Paint",
            ].map((c) => (
              <Chip key={c} className="border-green-400 text-green-700">{c}</Chip>
            ))}
          </div>
        </div>

        {/* Brand */}
        <div className="mt-3">
          <CollapsibleRow title="Brand" count={0}>
            {/* Put brand checkboxes here if needed */}
            <div className="text-xs text-gray-500">No brand selected</div>
          </CollapsibleRow>
        </div>

        {/* Style */}
        <div>
          <CollapsibleRow title="Style" count={0}>
            <div className="text-xs text-gray-500">No style selected</div>
          </CollapsibleRow>
        </div>

        {/* Swatches */}
        <div className="mt-3">
          <SectionTitle>Swatch</SectionTitle>

          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">0 items</div>
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-8 rounded-md border border-gray-300 pl-8 pr-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Search..."
              />
              <svg
                className="absolute left-2 top-1/2 -translate-y-1/2"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-6-6" stroke="#666" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {filtered.map((src, idx) => (
              <button
                key={idx}
                className="aspect-square rounded-lg overflow-hidden border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                title={`Swatch ${idx + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`swatch-${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </SheetContent>

      {/* Transparent overlay like your previous sheet */}
      <style jsx global>{`
        .fixed.inset-0.bg-black\/80 { background-color: transparent !important; }
      `}</style>
    </Sheet>
  );
};

export default ChatPallet;
