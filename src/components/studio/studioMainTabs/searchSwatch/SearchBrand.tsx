import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { TextShimmer } from "@/components/core";
import { BrandModel } from "@/models/swatchBook/brand/BrandModel";
import { fetchAllStyles, setFilterSwatchBrand } from "@/redux/slices/swatch/FilterSwatchSlice";
import { AppDispatch, RootState } from "@/redux/store";

/* tiny chip */
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


type SearchBrandProps = {
  openCard: "brand";
 
}
const SearchBrand: React.FC<SearchBrandProps> = ({ openCard }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { brand, isFetchingBrand, filterSwatch } = useSelector(
    (state: RootState) => state.filterSwatch
  );

  const selectedBrandIds = (filterSwatch?.brand ?? []).map((b) => b.id);


    const onBrandClick = async (b: BrandModel) => {
      dispatch(setFilterSwatchBrand(b));
      await dispatch(fetchAllStyles(b.id));
    };



  return (
   <>
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
   </>
  );
};

export default SearchBrand;
