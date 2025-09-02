import React from 'react'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { CanvasMode, setActiveTab, setCanvasType } from '@/redux/slices/canvasSlice';
import { AiOutlineBorderInner, AiTwotoneHome } from 'react-icons/ai';
import { MdOutlineHideImage, MdOutlineImage } from 'react-icons/md';
import { Separator } from '../ui/separator';

const Toggleheader = () => {
    const dispatch= useDispatch<AppDispatch>();
     const activeCanvas = useSelector(
    (state: RootState) => state.canvas.activeCanvas
  );
    
      // Use Redux for hide/show image state
      const handleShowHideImage = (data: string) => {
        if (activeCanvas === "hideSegments") {
          // dispatch(setCanvasType("showSegments"));
          dispatch(setActiveTab("showSegments"));
        } else {
          dispatch(setActiveTab("hideSegments"));
          dispatch(setCanvasType("hover"));
        }
      };
    
      const handleOutline = (type: CanvasMode) => {
        if (activeCanvas === "outline") {
          dispatch(setActiveTab("hideSegments"));
        } else {
          dispatch(setActiveTab(type));
        }
      };
    
      const handleMask = (type: CanvasMode) => {
        if (activeCanvas === "mask") {
          dispatch(setActiveTab("hideSegments"));
        } else {
          dispatch(setActiveTab(type));
        }
      };
  return (
   <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`group relative flex items-center justify-start w-10 hover:w-36 transition-all duration-300 overflow-hidden px-2
                ${
                  activeCanvas === "outline"
                    ? "bg-blue-100 text-blue-600 border-blue-400"
                    : ""
                }`}
                  onClick={() => handleOutline("outline")}>
                  {/* Icon stays visible */}
                  <AiOutlineBorderInner
                    className={`h-5 w-5 shrink-0 ${
                      activeCanvas === "outline" ? "fill-blue-600" : ""
                    }`}
                  />

                  {/* Text appears on hover */}
                  <span className="ml-2 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
                    Outline
                  </span>
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShowHideImage(activeCanvas)}
                  className={`group relative flex items-center justify-start w-10 hover:w-36 transition-all duration-300 overflow-hidden px-2
                ${
                  activeCanvas === "hideSegments"
                    ? "bg-blue-100 text-blue-600 border-blue-400"
                    : ""
                }`}>
                  {/* Icon changes dynamically based on Redux */}
                  {activeCanvas === "hideSegments" ? (
                    <MdOutlineHideImage className="h-5 w-5 shrink-0 fill-blue-600" />
                  ) : (
                    <MdOutlineImage className="h-5 w-5 shrink-0 " />
                  )}

                  {/* Text fades in on hover */}
                  <span className="ml-2 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
                    {activeCanvas === "showSegments"
                      ? "Show Segments"
                      : "Hide Segments "}
                  </span>
                </Button>
                <Separator orientation="vertical" className="h-6" />

                <Button
                  variant="outline"
                  size="sm"
                  className={`group relative flex items-center justify-start w-10 hover:w-36 transition-all duration-300 overflow-hidden px-2
                ${
                  activeCanvas === "mask"
                    ? "bg-blue-100 text-blue-600 border-blue-400"
                    : ""
                }`}
                  onClick={() => handleMask("mask")}>
                
                  <AiTwotoneHome
                    className={`h-5 w-5 shrink-0 ${
                      activeCanvas === "mask" ? "fill-blue-600" : ""
                    }`}
                  />

                  {/* Text appears on hover */}
                  <span className="ml-2 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
                    Mask
                  </span>
                </Button>
              </div>
  )
}

export default Toggleheader