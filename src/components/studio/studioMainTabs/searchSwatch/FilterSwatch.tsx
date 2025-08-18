"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { RiResetLeftLine } from "react-icons/ri";
import { Badge } from "@/components/ui/badge";

import SelectedSegment from "../searchSwatch/SelectedSegment";
import SearchCategory from "../searchSwatch/SearchCategory";
import SearchedSwatch from "../searchSwatch/SearchedSwatch";
import SearchBrand from "../searchSwatch/SearchBrand";
import SearchStyle from "../searchSwatch/SearchStyle";

import { AppDispatch, RootState } from "@/redux/store";
import { clearFilter } from "@/redux/slices/swatch/FilterSwatchSlice";

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-sm font-medium text-gray-700 mb-2">{children}</div>
);

interface FilterSwatchProps {
  setIsSheetOpen: (open: boolean) => void;
}

const FilterSwatch: React.FC<FilterSwatchProps> = ({
  setIsSheetOpen

}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState("");
  const [totalSwatches, setTotalSwatches] = useState<number>(0);
  
  const { filterSwatch } =
    useSelector((s: RootState) => s.filterSwatch);

  const selectedBrandIds = (filterSwatch?.brand ?? []).map((b) => b.id);
  const selectedStyleIds = (filterSwatch?.style ?? []).map((s) => s.id);
  

    const [openCard, setOpenCard] = useState<null | "brand" | "style">(null);
    const toggleCard = (card: "brand" | "style") =>
      setOpenCard((prev) => (prev === card ? null : card));

  const handleResetFilters = () => dispatch(clearFilter());

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };
  return (
   <>
    <SheetContent
           side="left"
           className="w-[380px] sm:w-[420px] !left-0 max-w-[100vw] overflow-y-auto sheet-scrollbar p-0 ms-[25vw]"
         >
           <SheetHeader className="mb-2 border-b py-2 px-3 bg-gray-100">
             <div className="flex items-center justify-between">
               <SheetTitle className="flex items-center gap-2">
                 <IoMdArrowRoundBack className="cursor-pointer"  onClick={handleCloseSheet}/>
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
           <div className="flex flex-col gap-2 p-3 pb-0">
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
            { openCard === "brand"  && <SearchBrand
                openCard={"brand"}
             
              />}
   
             {/* Style panel */}
             {openCard === "style" && (
               <SearchStyle
                 openCard={"style"}
               />
             )}
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
   </>
  )
}

export default FilterSwatch