import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { TextShimmer } from "@/components/core";
import { setFilterSwatchStyle } from "@/redux/slices/swatch/FilterSwatchSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { StyleModel } from "@/models/swatchBook/styleModel/StyleModel";

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


type SearchStyleProps = {
  openCard: "style";
};
const SearchStyle: React.FC<SearchStyleProps> = ({ openCard }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { style, isFetchingStyle, filterSwatch } = useSelector(
    (state: RootState) => state.filterSwatch
  );


 
  const onStyleClick = (s: StyleModel) => {
    dispatch(setFilterSwatchStyle(s));
  
  };






  const selectedStyleIds = (filterSwatch?.style ?? []).map((s) => s.id);




  return (
   <>
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
   </>
  );
};

export default SearchStyle;
