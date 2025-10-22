import React, { useState } from "react";
import { MaterialModel } from "@/models/swatchBook/material/MaterialModel";
import { setIsSwatchDetailsOpen, updateSelectedSwatchInfo, updateSwatch } from "@/redux/slices/demoProjectSlice/DemoMasterArraySlice";
import { AppDispatch, RootState } from "@/redux/store";

import { FaRegHeart } from "react-icons/fa6";
import { IoInformation } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";


import Loading from "@/components/loading/Loading";

type Props = {
  swatch: MaterialModel;
  url: string | null;
  hideImage: boolean;
};

const GridSwatch: React.FC<Props> = ({ swatch, url, hideImage }) => {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Local selection state (instead of undefined selectedSwatchId)
  const [isSelected, setIsSelected] = useState(false);

  // const handleSelect = () => {
  //   setIsSelected((prev) => !prev);
  // };
  const [activeId, setActiveId] = useState<string | null>(null);
 const {selectedDemoMasterItem}= useSelector((state:RootState)=>state.demoMasterArray);
  const isOpen = activeId === swatch.id?.toString();

  const handlePick = () => {
      setIsSelected((prev) => !prev);
    setActiveId(isOpen ? null : swatch.id?.toString() || null);
    if(selectedDemoMasterItem){
    
      const segType= selectedDemoMasterItem.name;
      const segTitle= selectedDemoMasterItem.allSegments?.find(seg=>seg.segment_type===segType)?.short_title || [];
      dispatch(updateSwatch({
        pallete:swatch,
        segType:segType,
      }))

    }
  };

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    // dispatch(favoriteSwatch(swatch.id));
  };

  const handleSwatchInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setIsSwatchDetailsOpen(true));
    dispatch(updateSelectedSwatchInfo(swatch));
  };

  return (
    <>
   
   
    <div className="relative flex flex-col items-center w-full" key={swatch.id}>
      <button
        onClick={handlePick}
        className={[
          "group block w-full overflow-hidden rounded-xl border bg-white text-left shadow-sm transition p-0",
          isSelected
            ? "border-emerald-500 ring-2 ring-emerald-300"
            : "border-zinc-200 hover:border-zinc-300 hover:shadow",
        ].join(" ")}
      >
        <div className="relative aspect-square w-full group">
          {!hideImage ? (
            <img
              src={url as string}
              alt={swatch.title || `material-${swatch.id}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500 bg-zinc-100">
              Image hidden
            </div>
          )}

          {/* ✅ Center Tick SVG */}
          <svg
            className={`checkicon absolute inset-0 m-auto transition-all duration-300 ${
              isSelected ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
            width="36"
            height="36"
          >
            <circle
              className="text-white stroke-current checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
              strokeWidth="2"
            />
            <path
              className="text-white stroke-current checkmark__check"
              fill="none"
              strokeWidth="3"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>

       

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFav(e);
            }}
            className="absolute right-1 top-1 inline-flex items-center justify-center rounded-full
                       bg-white/90 text-zinc-700 shadow hover:bg-white p-1
                       opacity-0 translate-y-[2px] transition-all duration-200
                       group-hover:opacity-100 group-hover:translate-y-0
                       focus-visible:opacity-100 focus-visible:translate-y-0"
            aria-label="favorite"
            type="button"
          >
            <FaRegHeart className="h-3 w-3" />
          </button>

          {/* Info button */}
          <button
            onClick={handleSwatchInfo}
            className="absolute left-1 top-1 inline-flex items-center justify-center rounded-full
                       bg-white/90 text-zinc-700 shadow hover:bg-white p-1
                       opacity-0 translate-y-[2px] transition-all duration-200
                       group-hover:opacity-100 group-hover:translate-y-0
                       focus-visible:opacity-100 focus-visible:translate-y-0"
            aria-label="info"
            type="button"
          >
            <IoInformation className="h-3 w-3" />
          </button>
        </div>
      </button>
    </div>

  

     </>
  );
};

export default GridSwatch;
