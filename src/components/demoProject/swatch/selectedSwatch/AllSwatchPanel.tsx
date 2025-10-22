import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MdOutlineShoppingCart, MdOutlineShoppingCartCheckout } from "react-icons/md";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLink, Trash2, X } from "lucide-react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { DemoMasterModel } from "@/models/demoModel/DemoMaterArrayModel";
import { computeImageUrl } from "@/utils/GetPalletUrl";

type AllSwatchPanelProps = {
  onClose?: () => void;
};
const AllSwatchPanel: React.FC<AllSwatchPanelProps> = ({ onClose }) => {
  const { demoMasterArray } = useSelector((state: RootState) => state.demoMasterArray);

  return (
    <>
      <div className="w-[360px] rounded-xl border bg-background shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-xl px-4 py-3">
          <div className="text-base font-semibold">2 Products Selected</div>
          <Button variant="ghost" className="p-4"
           onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Separator />

        {/* Body */}
        <ScrollArea className="h-[320px] px-4 py-3">
          <div className="space-y-5">
            {/* FLOORS */}
            {demoMasterArray &&
              demoMasterArray.length > 0 &&
              demoMasterArray.map((demo: DemoMasterModel) => {
                const allSwatch = demo.overAllSwatch || [];
                if (allSwatch.length === 0) return null;
                const segName = demo.name || "Demo Project";

                // FIX: You need to return the result of the inner map from the outer map
                return allSwatch.map((swatch, index) =>{
                  const url = computeImageUrl(swatch);
                  return (
                   (
                  <div className="space-y-3" key={index}> {/* Add a key for the list item */}
                    <div className="px-1 text-xs font-semibold tracking-wide text-muted-foreground">
                      {segName}
                    </div>

                    <div className="rounded-lg border p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-white">
                            <img
                              src={url || ""}
                              alt="Red Oak"
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="leading-tight">
                            <div className="text-xs text-muted-foreground">
                              {swatch.material_brand_id || "Demo Company"}
                            </div>
                            <div className="text-sm font-medium">{swatch.title || "Red Oak"}</div>
                          </div>
                        </div>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="text-muted-foreground py-2 px-2">
                                {" "}
                                <Trash2 className="h-4 w-4" />{" "}
                              </button>
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
                                //onClick={handleOpenSwatchInfo}
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
                ))}
              );
              })}


            {/* <div className="space-y-3">
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
                          //onClick={handleOpenSwatchInfo}
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
            </div> */}

            {/* WALL DECORS */}
            {/* <div className="space-y-2">
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
                          //onClick={handleOpenSwatchInfo}
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
            </div> */}
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
    </>
  )
}

export default AllSwatchPanel