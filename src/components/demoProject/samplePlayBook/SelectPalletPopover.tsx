"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { X, Trash2, Link as LinkIcon, Layers, Hand, ExternalLink } from "lucide-react";
// import { X, Trash2, Link as LinkIcon, Layers, ExternalLink } from "lucide-react";
import { LuLayers } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";
import ProjectDetails from "./ProjectDetails";
import { FaArrowRightLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setIsSwatchDetailsOpen } from "@/redux/slices/demoProjectSlice/DemoMasterArraySlice";
import { TbColorSwatch } from "react-icons/tb";
import { MdOutlineShoppingCart, MdOutlineShoppingCartCheckout } from "react-icons/md";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/* ---------------------- small util: detect mobile ---------------------- */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState<boolean>(() =>
    typeof window === "undefined" ? false : window.innerWidth < breakpoint
  );
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width:${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [breakpoint]);
  return isMobile;
}

/* ---------------- panel content used in BOTH popover & sheet ----------- */
function SelectedProductsPanel({
  onClose,
}: {
  onClose?: () => void;
}) {

  const dispatch= useDispatch<AppDispatch>()
  const { selectedSwatchInfo, isSwatchDetailsOpen } = useSelector((state: RootState) => state.demoMasterArray);

  const handleOpenSwatchInfo = () => {
        dispatch(setIsSwatchDetailsOpen(true));
    }
  return (
    <div className="w-[360px] rounded-xl border bg-background shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-xl px-4 py-3">
        <div className="text-base font-semibold">2 Products Selected</div>
        <Button variant="ghost" className="p-4" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Separator />

      {/* Body */}
      <ScrollArea className="h-[320px] px-4 py-3">
        <div className="space-y-5">
          {/* FLOORS */}
          <div className="space-y-3">
            <div className="px-1 text-xs font-semibold tracking-wide text-muted-foreground">
              Wall
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-white">
                    <img
                      src="https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Belden__470-479_Medium_Range_Smooth_MTIwMDkz.jpg"
                      alt="Red Oak"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="leading-tight">
                    <div className="text-xs text-muted-foreground">
                      Demo Company
                    </div>
                    <div className="text-sm font-medium">Red Oak</div>
                  </div>
                </div>

               


                   <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-muted-foreground py-2 px-2"> <Trash2 className="h-4 w-4" /> </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove</p>
                      </TooltipContent>
                    </Tooltip>
                   </TooltipProvider>

              </div>

              <div className="mt-0 pl-[60px] flex gap-2">
                 
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleOpenSwatchInfo}
            className="items-center gap-2 text-sm text-muted-foreground hover:text-foreground
                       focus:outline-none focus:ring-0 bg-transparent hover:bg-gray-100
                       border border-gray-50 hover:border-gray-100 px-1 py-1"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View Project</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
              <button className="items-center gap-2 text-sm text-muted-foreground hover:text-foreground focus:outline-none focus:ring-0 bg-transparent hover:bg-gray-100 border-gray-50 hover:border-gray-100 px-1 py-1 border">
                <MdOutlineShoppingCartCheckout className="h-4 w-4" />
                </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Order Sample</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider >
                  
                

                

                                  
              </div>
            </div>
          </div>

          {/* WALL DECORS */}
          <div className="space-y-2">
            <div className="px-1 text-xs font-semibold tracking-wide text-muted-foreground">
              WALL DECORS
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-white">
                    <img
                      src="https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Belden__470-479_Medium_Range_Smooth_MTIwMDkz.jpg"
                      alt="Abstract Spatters"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="leading-tight">
                    <div className="text-xs text-muted-foreground">
                      Demo Company
                    </div>
                    <div className="text-sm font-medium">Abstract Spatters</div>
                  </div>
                </div>

                  <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-muted-foreground py-2 px-2"> <Trash2 className="h-4 w-4" /> </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove</p>
                      </TooltipContent>
                    </Tooltip>
                   </TooltipProvider>
              </div>

              <div className="mt-0 pl-[55px]">
             <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleOpenSwatchInfo}
            className="items-center gap-2 text-sm text-muted-foreground hover:text-foreground
                       focus:outline-none focus:ring-0 bg-transparent hover:bg-gray-100
                       border border-gray-50 hover:border-gray-100 px-1 py-1"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View Project</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
              <button className="items-center gap-2 text-sm text-muted-foreground hover:text-foreground focus:outline-none focus:ring-0 bg-transparent hover:bg-gray-100 border-gray-50 hover:border-gray-100 px-1 py-1 border">
                <MdOutlineShoppingCartCheckout className="h-4 w-4" />
                </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Order Sample</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer CTA */}
      <div className="rounded-b-xl px-3 pb-3 pt-2">
        <Button className="h-11 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-blue-900/60">
            <MdOutlineShoppingCart />
          </span>
        Add Cart
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------- trigger row ------------------------------ */
function PalletTriggerRow() {
  return (
    <div className="flex w-auto items-center gap-2 rounded-xl border-none bg-white px-3 text-left shadow-sm transition cursor-pointer">
      <div className=" hidden md:block">
        <div className="flex">
        <div className="relative z-0 h-10 w-10 overflow-hidden rounded-md border bg-white shadow-sm">
          <img
            src="https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Belden__470-479_Medium_Range_Smooth_MTIwMDkz.jpg"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="-ml-3 relative z-10 h-10 w-10 overflow-hidden rounded-md border bg-white shadow-sm ring-2 ring-white">
          <img
            src="https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Belden__470-479_Medium_Range_Smooth_MTIwMDkz.jpg"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="-ml-3 relative z-20 h-10 w-10 overflow-hidden rounded-md border bg-white shadow-sm ring-2 ring-white">
          <img
            src="https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Belden__470-479_Medium_Range_Smooth_MTIwMDkz.jpg"
            className="h-full w-full object-cover"
          />
        </div>
        </div>
      </div>

    <span className="relative inline-block block md:hidden">
      {/* icon */}
      <Layers className="h-7 w-7 text-zinc-500" />{/* or <LuLayers size={28} /> */}

      {/* count badge */}
      <span
        aria-label="selected items"
        className="
          absolute -top-1 -right-1
          flex h-5 min-w-[20px] items-center justify-center
          rounded-full bg-emerald-800 px-1.5
          text-[11px] font-bold leading-none text-white
          ring-2 ring-white shadow
        "
      >
        2
      </span>
    </span>

      <div className="rounded-lg p-2 hover:bg-gray-100">
        <div className="truncate text-xs text-muted-foreground">
          Demo Company
        </div>
        <div className="truncate text-sm font-medium">Red Oak – Natural</div>
      </div>
    </div>
  );
}

/* =================== Responsive wrapper (Popover ↔ Sheet) =================== */
const SelectPalletPopover: React.FC = () => {
  const isMobile = useIsMobile(); 
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSwatchInfo, isSwatchDetailsOpen } = useSelector((state: RootState) => state.demoMasterArray);
 
  // separate open state for each container type
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
        dispatch(setIsSwatchDetailsOpen(false));
    }
  if (isMobile) {
    // Mobile: open as bottom sheet / offcanvas
    return (
      <>
        <div onClick={() => setOpen(true)}>
          <PalletTriggerRow />
        </div>

        <Sheet open={isSwatchDetailsOpen} 
        >
          <SheetContent
            side="bottom"
            className="mx-auto w-full max-w-[520px] rounded-t-2xl border p-3"
          >
            {/* small grab handle */}
            <div className="mx-auto mb-2 mt-1 h-1.5 w-14 rounded-full bg-zinc-300" />
            <SelectedProductsPanel onClose={handleClose} />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop: open as popover
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>
          <PalletTriggerRow />
        </div>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="start"
        sideOffset={12}
        className="w-auto border-none p-0 shadow-none"
      >
        <SelectedProductsPanel onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
};

export default SelectPalletPopover;
