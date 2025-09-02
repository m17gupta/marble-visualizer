import React from "react";
import { Button } from "../ui/button";
import { PiPolygonDuotone } from "react-icons/pi";
import { AiOutlineBorder } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const DrawHeader = () => {
  const activeCanvas = useSelector(
    (state: RootState) => state.canvas.activeCanvas
  );

  const { markingMode,canvasType } = useSelector((state: RootState) => state.canvas);
  return (
    <>
     {(canvasType === "draw"|| canvasType === "reannotation")

     && <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          className={`group relative flex items-center justify-start w-10 hover:w-36 transition-all duration-300 overflow-hidden px-2
                ${
                  markingMode === "polygon"
                    ? "bg-blue-100 text-blue-600 border-blue-400"
                    : ""
                }`}
          //  onClick={() => handleOutline("polygon")}
        >
          {/* Icon stays visible */}
          <PiPolygonDuotone
            className={`h-5 w-5 shrink-0 ${
              markingMode === "polygon" ? "fill-blue-600" : ""
            }`}
          />

          {/* Text appears on hover */}
          <span className="ml-2 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
            Polygon
          </span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={`group relative flex items-center justify-start w-10 hover:w-36 transition-all duration-300 overflow-hidden px-2
                ${
                  markingMode === "rectangle"
                    ? "bg-blue-100 text-blue-600 border-blue-400"
                    : ""
                }`}
          //onClick={() => handleOutline("rectangle")}
        >
          {/* Icon stays visible */}
          <AiOutlineBorder
            className={`h-5 w-5 shrink-0 ${
              markingMode === "rectangle" ? "fill-blue-600" : ""
            }`}
          />

          {/* Text appears on hover */}
          <span className="ml-2 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
            Rectangle
          </span>
        </Button>
      </div>}
    </>
  );
};

export default DrawHeader;
