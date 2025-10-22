import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FiLayout } from "react-icons/fi";

/* ----- pattern data: use your own thumbs here ----- */
const PATTERNS = [
  {
    key: "grid",
    label: "Grid",
    img: "https://imagedelivery.net/mzSuEo-CuZj22GZ2Ldj31w/ab082ac3-442a-4f95-bdfb-cf14b2c04400/public",
  },
  {
    key: "brick",
    label: "Brick",
    img: "https://imagedelivery.net/mzSuEo-CuZj22GZ2Ldj31w/bcf989c8-3306-4521-ea60-326a6244dc00/public",
  },
  {
    key: "vstack",
    label: "Vertical Stack",
    img: "https://imagedelivery.net/mzSuEo-CuZj22GZ2Ldj31w/b60b4893-75db-468f-91c7-7e7e01ba5c00/public",
  },
  {
    key: "checker",
    label: "Checkered",
    img: "https://imagedelivery.net/mzSuEo-CuZj22GZ2Ldj31w/6056469d-86c4-490a-ab08-c187a64c1c00/public",
  },
  {
    key: "custom",
    label: "Customize",
    img: "https://imagedelivery.net/mzSuEo-CuZj22GZ2Ldj31w/73496f9a-dd12-4e8d-d8c9-ba174a51f200/public",
  },
  {
    key: "vertical",
    label: "Vertical",
    img: "https://imagedelivery.net/mzSuEo-CuZj22GZ2Ldj31w/022b1141-ce89-4e86-4279-0cfb04fdf700/public",
  },
  {
    key: "horizontal",
    label: "Horizontal",
    img: "https://imagedelivery.net/mzSuEo-CuZj22GZ2Ldj31w/fe855da9-be8c-4489-f6b9-1d06a2777500/public",
  },
  {
    key: "herring",
    label: "Herringbone",
    img: "https://imagedelivery.net/mzSuEo-CuZj22GZ2Ldj31w/3a785d0a-b4fe-4c3e-7d58-224ed4fc6c00/public",
  },
  {
    key: "stretcher",
    label: "Stretcher Bond",
    img: "https://imagedelivery.net/mzSuEo-CuZj22GZ2Ldj31w/fe855da9-be8c-4489-f6b9-1d06a2777500/public",
  },
] as const;

export function LayoutSidebar() {
  const [selected, setSelected] = useState<(typeof PATTERNS)[number]["key"]>("grid");
  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(270);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <FiLayout className="h-4 w-4" />
          layout
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[420px]">
        <SheetHeader className="border-b pb-3">
          <SheetTitle className="text-lg">Layout & Pattern</SheetTitle>
        </SheetHeader>

        {/* patterns grid (with images) */}
        <div className="mt-4 grid grid-cols-4 gap-4">
          {PATTERNS.map((p) => {
            const isActive = selected === p.key;
            return (
              <button
                key={p.key}
                onClick={() => setSelected(p.key)}
                className={[
                  "flex flex-col items-center gap-2 rounded-xl border-none  bg-white p-2 transition",
                //   isActive ? "ring-2 ring-emerald-500 border-emerald-500" : "border-zinc-200",
                ].join(" ")}
              >
                <div className="h-[72px] w-[72px] overflow-hidden rounded-lg border">
                  <img
                    src={p.img}
                    alt={p.label}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-xs text-zinc-700 text-center">{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* divider */}
        <div className="my-5 h-px w-full bg-zinc-200" />

        {/* rotation pills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            {[0, 90, 180, 270].map((deg) => {
              const active = rotation === deg;
              return (
                <button
                  key={deg}
                  onClick={() => setRotation(deg as 0 | 90 | 180 | 270)}
                  className={[
                    "flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
                    active
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "inline-flex h-5 w-5 items-center justify-center rounded-full border",
                      active ? "bg-white border-transparent" : "bg-white border-zinc-300",
                    ].join(" ")}
                  />
                  {deg}°
                </button>
              );
            })}
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button className="w-full">Apply</Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
