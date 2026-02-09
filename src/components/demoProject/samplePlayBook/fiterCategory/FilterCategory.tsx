import { RootState } from '@/redux/store';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';


const OPTIONS = [
  "EIFS",
  "Stone",
  "Stain",
  "Pediment",
  "Siding",
  "Wall Panels",
  "Brick",
];
const FilterCategory = () => {

    const {selectedDemoMasterItem}= useSelector((state:RootState)=>state.demoMasterArray);
 const [active, setActive] = useState<string[]>([]);
   const toggle = (v: string) =>
    setActive((a) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]));

  return (
  <div className="flex flex-wrap gap-2">
                  {selectedDemoMasterItem && selectedDemoMasterItem?.categories?.map((opt) => {
                    const isActive = active.includes(opt);
                    return (
                      <button
                        key={opt}
                        // size="sm"
                        onClick={() => toggle(opt)}
                        className={[
                          "rounded-lg border px-2 py-1 text-[12px] text-normal",
                          "transition-colors",
                          isActive
                            ? "bg-emerald-50 text-emerald-600 border-emerald-500"
                            : " text-gray-600 border-gray-300 bg-white hover:bg-emerald-50",
                        ].join(" ")}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
  )
}

export default FilterCategory