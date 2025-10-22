import * as React from "react";
import { Button } from "@/components/ui/button";
import { GalleryCardProps } from "./types";

const GalleryCard: React.FC<GalleryCardProps> = ({ 
  src, 
  idx, 
  onUse, 
  onClick, 
  isSelected = false 
}) => {
  const handleUseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUse?.(idx);
    console.log("Use room:", idx + 1);
  };

  return (
    <div
      onClick={onClick}
      className={[
        "group relative cursor-pointer rounded-xl border bg-white shadow-sm transition hover:shadow-md",
        isSelected ? "ring-2 ring-emerald-500" : "ring-0",
        "overflow-hidden",
      ].join(" ")}
    >
      {/* image wrapper keeps the 4:3 ratio and clips scale */}
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={src}
          alt={`Room ${idx + 1}`}
          className="block h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
      </div>

      {/* FULL background overlay */}
      <div
        className={[
          "pointer-events-none absolute inset-0 transition-opacity",
          isSelected ? "bg-black/25 opacity-100" : "bg-black/20 group-hover:opacity-100",
        ].join(" ")}
      />

      {/* bottom gradient + caption */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent px-3 pb-2 pt-10 text-white">
        <span className="text-[10px] md:text-lg font-medium">Demo Room #{idx + 1}</span>
      </div>

      {/* Use pill (clickable) */}
      <Button
        type="button"
        onClick={handleUseClick}
        className="absolute hidden md:block bottom-2 right-2 rounded-md bg-white/95 px-3 py-1 text-sm font-medium text-zinc-900 shadow hover:bg-white"
      >
        Use
      </Button>

      {/* subtle hover ring */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-red-500/0 transition group-hover:ring-2 group-hover:ring-red-500/30" />
    </div>
  );
};

export default GalleryCard;