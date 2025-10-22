import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Share2,
  MoreVertical,
  Camera,
  ExternalLink,
  Store,
  ImagePlus,
  ArrowLeftRight,
  ShoppingCart,
  HelpCircle,
  Star,
  ChevronsLeftRight,
  X,
  Heart,
  Search,
  EllipsisVertical,
  Trash2,
  RefreshCcw,
  User,
  LucideIcon,
} from "lucide-react";
import { UploadProjects } from "../UploadProjects";
import SelectPalletPopover from "../SelectPalletPopover";
import { HiOutlineViewGrid } from "react-icons/hi";
import { LeftSampleSection } from "./LeftSampleSection";

/* ========================= Compare Slider ========================= */


type MenuItem =
  | { type: "action"; icon: LucideIcon; label: string; onClick?: () => void }
  | { type: "component"; component: React.ReactNode; key?: string };

const menuItems: MenuItem[] = [
  { type: "action", icon: ExternalLink, label: "View Product" },
  { type: "component", component: <UploadProjects />, key: "upload" },
  // { type: "action", icon: Store, label: "Find Store" },
  // { type: "action", icon: ArrowLeftRight, label: "Compare Products" },
  { type: "action", icon: ShoppingCart, label: "View Cart" },
  { type: "action", icon: HelpCircle, label: "Help" },
];
function CompareSlider({
  leftSrc,
  rightSrc,
  onClose,
}: {
  leftSrc: string;
  rightSrc: string;
  onClose: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState(0.5);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const pct = (clientX: number) => {
      const r = wrap.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - r.left, 0), r.width);
      return x / r.width;
    };

    let dragging = false;
    const down = (e: PointerEvent) => {
      dragging = true;
      (e.target as Element).setPointerCapture?.(e.pointerId);
      setPos(pct(e.clientX));
    };
    const move = (e: PointerEvent) => dragging && setPos(pct(e.clientX));
    const up = () => (dragging = false);

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
    <div className="relative overflow-hidden rounded-xl border bg-white">
      <button
        onClick={onClose}
        className="absolute right-3 top-3 z-30 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow"
        aria-label="Close compare"
      >
        <X className="h-4 w-4" />
      </button>

      <div ref={wrapRef} className="relative w-full select-none">
        <img src={rightSrc} alt="Right" className="block w-full" />
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${pos * 100}%` }}
        >
          <img src={leftSrc} alt="Left" className="block w-full" />
        </div>
        <div
          className="pointer-events-none absolute inset-y-0"
          style={{ left: `calc(${pos * 100}% - 1px)`, width: 2 }}
        >
          <div className="h-full bg-white/70 mix-blend-difference" />
        </div>
        <button
          type="button"
          data-handle
          className="absolute top-1/2 z-30 -translate-y-1/2 translate-x-[-50%] rounded-lg bg-white p-1.5 shadow ring-1 ring-black/5"
          style={{ left: `${pos * 100}%` }}
          aria-label="Drag to compare"
        >
          <ChevronsLeftRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[11px] text-zinc-700 shadow">
          Powered by <span className="font-semibold text-blue-600">Dzinly</span>
        </div>
      </div>
    </div>
  );
}

/* ========================= Custom Action Menu ========================= */
function CustomActionMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
         <Button variant="outline"  className="px-2 border-none">
          Menu <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="z-50 w-64 rounded-xl border bg-white p-0 shadow-xl"
      >
        <button className="m-3 flex w-[calc(100%-1.5rem)] items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800">
          <Camera className="h-4 w-4" />
          Take a photo
        </button>

    <div className="px-2 pb-2">
  {menuItems.map((item, i) => (
    <div key={item.type === "action" ? item.label : item.key ?? `component-${i}`}>
      {item.type === "action" ? (
        <button
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-[14px] hover:bg-zinc-50 focus:outline-none focus:ring-0"
          onClick={item.onClick}
        >
          <item.icon className="h-4 w-4 text-zinc-700" />
          <span>{item.label}</span>
        </button>
      ) : (
        <div className="px-3 py-2">
          {item.component}
        </div>
      )}
    </div>
  ))}

  {/* Divider below menu */}
  <div className="my-2 h-px w-full bg-zinc-200" />

  {/* Rating */}
  <div className="px-3 pb-2">
    <div className="mb-1 text-[13px] text-zinc-700">Rate Your Experience</div>
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-5 w-5 text-zinc-400" />
      ))}
    </div>
  </div>
</div>


        <div className="flex items-center justify-end gap-1 px-3 pb-2">
          <span className="text-[11px] text-zinc-500">Powered by</span>
          <span className="text-[11px] font-semibold text-blue-600">Dzinly</span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ========================= Layout Sheet (Apply Layout UI) ========================= */
function LayoutSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const thumbs = [
    "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Belden__470-479_Medium_Range_Smooth_MTIwMDkz.jpg",
    "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/3-4_Light__Naval_MTE4ODgw.jpg",
    "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Atlas__Driftwood_HD_ODA4NDAz.jpg",
    "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Behr__Vine_Leaf_MTkxNzM2.jpg",
    "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Behr__Standing_Ovation_MTEzNjYw.jpg",
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="z-40 mx-auto w-full max-w-[520px] rounded-t-2xl border shadow-2xl"
      >
        {/* grab handle */}
        <div className="flex items-center justify-center">
          <div className="my-2 h-1.5 w-14 rounded-full bg-zinc-300" />
        </div>

        {/* pills row + powered by + kebab */}
        <div className="flex items-center justify-between px-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {["Glossy", "Grout", "Layout", "Compare"].map((p, i) => (
              <button
                key={p}
                className={[
                  "rounded-full border px-3 py-1 text-sm",
                  i === 0
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50",
                ].join(" ")}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-[11px] text-zinc-600 shadow">
              Powered by <b className="text-orange-600">Tilesview.ai</b>
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* thumbnails */}
        <div className="mt-2">
          <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-2 pb-2">
            {thumbs.map((t, i) => (
              <div key={i} className="relative snap-start rounded-xl border bg-white p-1">
                <img src={t} alt={`thumb-${i}`} className="h-20 w-20 rounded-lg object-cover" />
                <button className="absolute right-1 top-1 rounded-full bg-white/90 p-1 shadow">
                  <Heart className="h-3 w-3 text-zinc-700" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* selected row */}
        <div className="mt-1 flex items-center gap-3 border-t px-2 py-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-md border">
            <img src={thumbs[0]} alt="thumb" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-xs text-zinc-500">Demo Company</div>
            <div className="truncate text-sm font-medium">Abstract Spatters</div>
          </div>
          <div className="ml-auto">
            <Button variant="ghost" size="sm" className="gap-1">
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>

        {/* footer row */}
        <div className="flex items-center justify-between border-t px-2 py-2">
          {/* <div className="flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3940/3940403.png"
              alt="company"
              className="h-6 w-6 rounded-full"
            />
            <div className="text-[12px] leading-tight">
              <div className="font-semibold text-zinc-700">Default Company</div>
              <div className="text-zinc-500">MONALISA O.</div>
            </div>
          </div> */}
          <SelectPalletPopover />

          <button className="grid h-10 w-10 place-items-center rounded-full border bg-white shadow">
            <Search className="h-5 w-5 text-zinc-700" />
          </button>
          <div className="flex items-center gap-4 pr-1">
            <button className="relative">
              <ShoppingCart className="h-5 w-5 text-zinc-700" />
              <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-rose-600 text-[10px] text-white">
                1
              </span>
            </button>
            <User className="h-5 w-5 text-zinc-700" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ========================= Bottom Tiles Bar ========================= */
function BottomTilesBar({
  onCompareToggle,
  showCompare,
  onOpenLayout,
}: {
  onCompareToggle: () => void;
  showCompare: boolean;
  onOpenLayout: () => void;
}) {
  const tiles = [
    "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Belden__470-479_Medium_Range_Smooth_MTIwMDkz.jpg",
    "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/3-4_Light__Naval_MTE4ODgw.jpg",
    "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Atlas__Driftwood_HD_ODA4NDAz.jpg",
    "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Behr__Vine_Leaf_MTkxNzM2.jpg",
    "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Behr__Standing_Ovation_MTEzNjYw.jpg",
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-white shadow-md pt-2"  >
   <LeftSampleSection/>

      {/* top buttons */}
      <div className="flex items-center justify-between px-3 pt-2">
        <div className="flex gap-2 overflow-x-auto ">
          <Button
            variant="outline"
            size="sm"
            className="rounded-md px-4 py-1 text-sm bg-zinc-900 text-white hover:bg-zinc-800"
          >
            Glossy
          </Button>
          <Button variant="outline" size="sm" className="rounded-md px-4 py-1 text-sm">
            Grout
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-md px-4 py-1 text-sm"
            onClick={onOpenLayout}
          >
            Layout
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-md px-4 py-1 text-sm"
            onClick={onCompareToggle}
          >
            {showCompare ? "Exit Compare" : "Compare"}
          </Button>
        </div>
        
      </div>

      {/* Swiper / horizontal scroll */}
      <div className="mt-2 flex gap-3 overflow-x-auto px-3 pb-2 no-scrollbar">
        {tiles.map((src, i) => (
          <div
            key={i}
            className="relative h-[80px] w-[80px] flex-shrink-0 overflow-hidden rounded-xl border"
          >
            <img src={src} alt={`Tile ${i + 1}`} className="h-full w-full object-cover" />
            <button className="absolute right-1 top-1 rounded-full bg-white/90 p-1 shadow">
              <Heart className="h-3 w-3 text-zinc-700" />
            </button>
          </div>
        ))}
      </div>

      {/* bottom footer row */}
      <div className="flex items-center justify-between border-t px-3 py-2">
        {/* <div className="flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3940/3940403.png"
            alt="company"
            className="h-6 w-6 rounded-full"
          />
          <div className="text-[13px] leading-none">
            <div className="font-semibold text-zinc-700">Default Company</div>
            <div className="text-xs text-zinc-500">MONALISA O.</div>
          </div>
        </div> */}
           <SelectPalletPopover />

        <div className="flex items-center gap-4 text-zinc-700">
          <Search className="h-5 w-5" />
          <ShoppingCart className="h-5 w-5" />
          <User className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/* ========================= Main Mobile Page ========================= */
const SampleMobile: React.FC = () => {
  const [showCompare, setShowCompare] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);

  const baseImg =
    "https://testvizualizer.s3.us-east-2.amazonaws.com/uploads/images/11/jeramie_b_archchange_1657719958.jpg";
  const altImg =
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1600&auto=format&fit=crop";

  return (
    <div className="relative min-h-screen bg-gray-100 md:hidden block">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-white px-3 py-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2 bg-gray-100">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          
         
         
           <Button variant="ghost" size="sm" className="gap-2 bg-gray-100">
            {/* <Share2 className="h-4 w-4" /> */}
            <ShoppingCart className="h-4 w-4" />
            Card
          </Button>
         
        </div>
       <CustomActionMenu />
      </div>

      {/* Main Image OR Compare */}
      <div className="px-3 py-3 h-[60%] flex justify-center items-center">
        {showCompare ? (
          <CompareSlider
            leftSrc={altImg}
            rightSrc={baseImg}
            onClose={() => setShowCompare(false)}
          />
        ) : (
        <div className="relative w-full overflow-hidden rounded-xl border bg-white ">
           <img src={baseImg} alt="Main Room" className="w-full h-auto" /> 
           <button className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900 px-3 py-1.5 text-sm text-white shadow"> 
            Floor 
           </button>
        </div>

        )}
      </div>

      {/* Bottom Fixed Bar (with working buttons) */}
      <BottomTilesBar
        onCompareToggle={() => setShowCompare((v) => !v)}
        showCompare={showCompare}
        onOpenLayout={() => setLayoutOpen(true)}
      />

      {/* Layout Sheet like Apply Layout page */}
      <LayoutSheet open={layoutOpen} onOpenChange={setLayoutOpen} />
    </div>
  );
};

export default SampleMobile;
