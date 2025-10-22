"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronsUpDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setIsSwatchDetailsOpen } from "@/redux/slices/demoProjectSlice/DemoMasterArraySlice";

const SwatchDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isSwatchDetailsOpen } = useSelector(
    (state: RootState) => state.demoMasterArray
  );

  // ✅ Collapsible starts CLOSED (prevents initial blink)
  const [specOpen, setSpecOpen] = React.useState<boolean>(false);

  const handleClose = () => {
    dispatch(setIsSwatchDetailsOpen(false));
  };

  return (
    <Dialog
      open={isSwatchDetailsOpen}
      onOpenChange={(open) => {
        dispatch(setIsSwatchDetailsOpen(open));
        if (open) setSpecOpen(false); // ensure closed on every open
      }}
    >
      <DialogContent className="sm:max-w-[500px] rounded-xl p-0 overflow-hidden pb-4">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <DialogHeader className="p-0">
            <DialogTitle className="text-lg font-semibold">
              Product Details
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Preview */}
        <div className="px-6 pt-2 pb-2 flex gap-4 items-start">
          <div className="w-1/2 overflow-hidden rounded-lg border bg-white shadow-sm">
            <img
              src="https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Belden__470-479_Medium_Range_Smooth_MTIwMDkz.jpg"
              alt="Portoro Tile"
              className="h-48 w-full object-cover"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-center items-start space-y-1">
            <div className="text-xs text-muted-foreground">Dzinly</div>
            <div className="text-base font-medium">Wall</div>
            <div className="text-sm text-muted-foreground">Size: 160 × 160 cm</div>
          </div>
        </div>

        {/* Specifications */}
        <Collapsible
          open={specOpen}
          onOpenChange={setSpecOpen}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center justify-between gap-4 px-6">
            <h4 className="text-sm font-semibold">Specifications</h4>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="p-2 border border-gray-300"
                aria-expanded={specOpen}
              >
                <ChevronsUpDown
                  className={`h-4 w-4 transition-transform ${
                    specOpen ? "rotate-180" : ""
                  }`}
                />
                <span className="sr-only">Toggle specifications</span>
              </Button>
            </CollapsibleTrigger>
          </div>

          {/* No flicker: hide when closed */}
          <CollapsibleContent className="flex flex-col gap-2 px-6 data-[state=closed]:hidden">
            <div className="divide-y text-sm">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Product Highlights</span>
                <span className="font-medium text-foreground">Lappato</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">SKU</span>
                <span className="font-medium">113003</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Collection</span>
                <span className="font-medium">Stone &amp; Stone Look</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">Wall</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">brank</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <DialogFooter className="border-t bg-gray-50 px-6 py-3">
          <Button variant="outline" className="rounded-lg" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SwatchDetails;
