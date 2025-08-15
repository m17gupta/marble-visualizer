"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { RiResetLeftLine } from "react-icons/ri";

import SelectedSegment from "../searchSwatch/SelectedSegment";
import SearchCategory from "../searchSwatch/SearchCategory";
import SearchedSwatch from "../searchSwatch/SearchedSwatch";
import { TextShimmer } from "@/components/core";
import { AppDispatch, RootState } from "@/redux/store";
import {
  clearFilter,
  setFilterSwatchBrand,
  setFilterSwatchStyle,
  fetchAllStyles,
} from "@/redux/slices/swatch/FilterSwatchSlice";
import { BrandModel } from "@/models/swatchBook/brand/BrandModel";
import { StyleModel } from "@/models/swatchBook/styleModel/StyleModel";
import { Badge } from "@/components/ui/badge";

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-sm font-medium text-gray-700 mb-2">{children}</div>
);

// tiny chip
const Chip: React.FC<
  { children: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>
> = ({ children, className = "", ...rest }) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full border text-sm leading-none ${className}`}
    {...rest}
  >
    {children}
  </span>
);

const ChatPallet: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [totalSwatches, setTotalSwatches] = useState<number>(0);

  // one source of truth from Redux
  const { filterSwatch, brand, style, isFetchingBrand, isFetchingStyle } =
    useSelector((s: RootState) => s.filterSwatch);

  const selectedBrandIds = (filterSwatch?.brand ?? []).map((b) => b.id);
  const selectedStyleIds = (filterSwatch?.style ?? []).map((s) => s.id);

  // ONE open state, not duplicated
  const [openCard, setOpenCard] = useState<null | "brand" | "style">(null);
  const toggleCard = (card: "brand" | "style") =>
    setOpenCard((prev) => (prev === card ? null : card));

  const handleResetFilters = () => dispatch(clearFilter());
  const onBrandClick = async (b: BrandModel) => {
    dispatch(setFilterSwatchBrand(b));
    await dispatch(fetchAllStyles(b.id));
  };
  const onStyleClick = (s: StyleModel) => dispatch(setFilterSwatchStyle(s));

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <button
                type="button"
                className="text-base hover:text-purple-600 transition p-0 inline-flex items-center px-1 py-1"
                aria-label="Open Materials"
                onClick={() => setIsSheetOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                  fill="currentColor" className="bi bi-bricks" viewBox="0 0 16 16">
                  <path d="M0 .5A.5.5 0 0 1 .5 0h15a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H14v2h1.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H14v2h1.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5H2v-2H.5a.5.5 0 0 1-.5-.5v-3A.5.5 0 0 1 .5 6H2V4H.5a.5.5 0 0 1-.5-.5zM3 4v2h4.5V4zm5.5 0v2H13V4zM3 10v2h4.5v-2zm5.5 0v2H13v-2zM1 1v2h3.5V1zm4.5 0v2h5V1zm6 0v2H15V1zM1 7v2h3.5V7zm4.5 0v2h5V7zm6 0v2H15V7zM1 13v2h3.5v-2zm4.5 0v2h5v-2zm6 0v2H15v-2z" />
                </svg>
              </button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add Pallet</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <SheetContent
        side="left"
        className="w-[380px] sm:w-[420px] !left-0 max-w-[100vw] overflow-y-auto sheet-scrollbar p-0"
      >
        <SheetHeader className="mb-3 border-b pb-3 p-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <IoMdArrowRoundBack className="cursor-pointer" />
              Filters
            </SheetTitle>
            <div className="flex items-center gap-2">
              <RiResetLeftLine
                onClick={handleResetFilters}
                className="cursor-pointer hover:text-purple-600"
              />
              <SelectedSegment />
            </div>
          </div>
        </SheetHeader>

        {/* Category */}
        <div className="space-y-3 ps-4 border-b pb-3">
          <SectionTitle><h5 className="font-semibold text-base text-black/80">Category</h5></SectionTitle>
          <SearchCategory />
        </div>

        {/* Filter cards + panels */}
        <div className="flex flex-col gap-3 p-3 pb-0">
          <div className="grid grid-cols-2 gap-3">
            {/* Brand header */}
            <Card
              role="button"
              onClick={() => toggleCard("brand")}
              className={`rounded-xl border shadow-none transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                openCard === "brand" ? "border-purple-500" : "border-gray-200 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between p-3">
                <div>
                  <div className="text-sm font-medium leading-none">Brand</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {selectedBrandIds.length} selected
                  </div>
                </div>
                {openCard === "brand" ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground mt-0.5" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground mt-0.5" />
                )}
              </div>
            </Card>

            {/* Style header */}
            <Card
              role="button"
              onClick={() => toggleCard("style")}
              className={`rounded-xl border shadow-none transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                openCard === "style" ? "border-purple-500" : "border-gray-200 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between p-3">
                <div>
                  <div className="text-sm font-medium leading-none">Style</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {selectedStyleIds.length} selected
                  </div>
                </div>
                {openCard === "style" ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground mt-0.5" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground mt-0.5" />
                )}
              </div>
            </Card>
          </div>

          {/* Brand panel */}
          <div
            className={`transition-[max-height,opacity] duration-300 ${
              openCard === "brand" ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            {openCard === "brand" && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="max-h-80 overflow-y-auto pr-1">
                  {isFetchingBrand ? (
                    <TextShimmer className="font-mono text-sm" duration={1}>
                      Loading brands...
                    </TextShimmer>
                  ) : brand && brand.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {brand.map((b) => (
                        <Chip
                          key={b.id}
                          className={`cursor-pointer transition-colors ${
                            selectedBrandIds.includes(b.id)
                              ? "border-blue-600 bg-blue-100 text-blue-800"
                              : "border-blue-400 text-blue-700 hover:bg-blue-50"
                          }`}
                          onClick={() => onBrandClick(b)}
                        >
                          {b.title}
                        </Chip>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">No brands available</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Style panel */}
          <div
            className={`transition-[max-height,opacity] duration-300 ${
              openCard === "style" ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            {openCard === "style" && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="max-h-80 overflow-y-auto pr-1">
                  {isFetchingStyle ? (
                    <TextShimmer className="font-mono text-sm" duration={1}>
                      Loading styles...
                    </TextShimmer>
                  ) : style && style.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {style.map((s) => (
                        <Chip
                          key={s.id}
                          className={`cursor-pointer transition-colors ${
                            selectedStyleIds.includes(s.id)
                              ? "border-blue-600 bg-blue-100 text-blue-800"
                              : "border-blue-400 text-blue-700 hover:bg-blue-50"
                          }`}
                          onClick={() => onStyleClick(s)}
                        >
                          {s.title}
                        </Chip>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">No styles available</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Swatches */}
        <div className="mt-3 px-4">
          <div className="flex items-center justify-between mb-2">
          <SectionTitle><h5 className="font-semibold text-base text-black">Swatch</h5></SectionTitle>
          {/* <div className="text-sm text-gray-600">{totalSwatches} items</div> */}
           <Badge
          variant="secondary"
          className="bg-blue-500 text-white dark:bg-blue-600 hover:bg-blue-500"
        >
      {totalSwatches} items
          
        </Badge>
          </div>
          <div className="flex items-center justify-between mb-2">
            
            <div className="relative w-100">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-8 rounded-md border border-gray-300 pl-8 pr-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Search..."
              />
              <svg
                className="absolute left-2 top-1/2 -translate-y-1/2"
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-6-6"
                  stroke="#666" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <SearchedSwatch onCountSwatch={setTotalSwatches}  />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatPallet;
