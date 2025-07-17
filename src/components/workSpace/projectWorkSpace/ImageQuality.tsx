import { Slider } from "@/components/ui/slider";
import React from "react";

const ImageQuality = () => {
  const ramExpansions = ["Very Low", "Low", "Medium", "High"];
  return (
    <div className="bg-white p-4 rounded-xl border  space-y-3">
      {/* <h3 className="font-semibold text-lg">2. AI Intervention Level</h3> */}
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-lg">2. AI Intervention Level</h3>
        <div className="relative group">
          <span className="cursor-pointer text-sm bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center">
            ?
          </span>
          <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 w-64 top-full left-0 -translate-x-3/4 mt-1 shadow-lg">
            Choose how much control the AI should have over your renovation. For
            Better Results choose Medium.
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Select how much influence you want the AI to have in your renovation
        plan. From subtle suggestions to full creative control, choose the level
        that fits your needs.
      </p>

      <div className="relative w-full pt-4">
        <div className="w-full max-w-sm">
          <Slider
            defaultValue={[1]}
            max={ramExpansions.length - 1}
            step={1}
            className="bg-purple-500 "
          />
          <div className="mt-2 -mx-1.5 flex items-center justify-between text-gray-900 text-sm px-2">
            {ramExpansions.map((expansion) => (
              <span key={expansion}>{expansion}</span>
            ))}
          </div>
        </div>

        {/* <div className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-200 w-full"></div>


    <div className="absolute left-1/3 top-1/2 -translate-y-1/2 -translate-x-1/2">
      <div className="w-6 h-6 rounded-full border-4 border-white bg-purple-500 shadow-md"></div>
    </div> */}
      </div>
    </div>
  );
};

export default ImageQuality;
