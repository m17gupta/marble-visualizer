import type { CanvasMode } from "@/redux/slices/canvasSlice";
import React, { useEffect, useMemo, useState } from "react";

import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  setActiveTab,
  setCanvasType,
  setIsResetZoom,
  updateSwitchCanvas,
} from "@/redux/slices/canvasSlice";
import {
  AiFillBehanceCircle,
  AiOutlineBorder,
  AiOutlineBorderInner,
  AiTwotoneHome,
} from "react-icons/ai";

import { Separator } from "../ui/separator";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Badge } from "../ui/badge";
import { MdOutlineHideImage, MdOutlineImage } from "react-icons/md";
import { BiGitCompare } from "react-icons/bi";
import ZoomHeader from "../canvasheader/ZoomHeader";
import { PiPolygonDuotone } from "react-icons/pi";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
const HoverHeader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [canvasMode, setCanvasMode] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mouseMove, setMouseMove] = useState({ x: 0, y: 0 });
  // const [activeButton, setActiveButton] = useState<"view" | "chat">("view");
  const [activeButton, setActiveButton] = React.useState<"view" | "chat">(
    "view"
  );
  const { canvasType } = useSelector((state: RootState) => state.canvas);
  const activeCanvas = useSelector(
    (state: RootState) => state.canvas.activeCanvas
  );
  const { currentZoom, mousePosition } = useSelector(
    (state: RootState) => state.canvas
  );

  // update zoom
  useEffect(() => {
    if (currentZoom) {
      const zoomPercentage = Math.round(currentZoom * 100);
      setZoomLevel(zoomPercentage);
    } else {
      setZoomLevel(1);
    }
  }, [currentZoom]);

  // update the mouse position

  useEffect(() => {
    if (mousePosition) {
      setMouseMove(mousePosition);
    } else {
      setMouseMove({ x: 0, y: 0 });
    }
  }, [mousePosition]);

  useEffect(() => {
    if (canvasType) {
      setCanvasMode(canvasType);
    } else {
      setCanvasMode("");
    }
  }, [canvasType]);

  const handleChat = () => {
    // Handle chat action here
    dispatch(setCanvasType("hover-default"));
    setActiveButton("chat");
  };

  const handleResetZoom = () => {
    dispatch(setIsResetZoom(true));
  };

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
    <>
      <Card>
        <CardContent className="py-2 pt-1.5 px-4 flex items-center justify-between">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className={`group relative flex items-center justify-start w-10 hover:w-36 transition-all duration-300 overflow-hidden px-2
                ${
                  activeCanvas === "polygon"
                    ? "bg-blue-100 text-blue-600 border-blue-400"
                    : ""
                }`}
              onClick={() => handleOutline("polygon")}>
              {/* Icon stays visible */}
              <PiPolygonDuotone
                className={`h-5 w-5 shrink-0 ${
                  activeCanvas === "outline" ? "fill-blue-600" : ""
                }`}
              />
              {/* <AiOutlineBorderInner
                  className={`h-5 w-5 shrink-0 ${
                    activeCanvas === "outline" ? "fill-blue-600" : ""
                  }`}
                /> */}

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
                  activeCanvas === "rectangle"
                    ? "bg-blue-100 text-blue-600 border-blue-400"
                    : ""
                }`}
              onClick={() => handleOutline("rectangle")}>
              {/* Icon stays visible */}
              <AiOutlineBorder
                className={`h-5 w-5 shrink-0 ${
                  activeCanvas === "outline" ? "fill-blue-600" : ""
                }`}
              />
              {/* <AiOutlineBorderInner
                  className={`h-5 w-5 shrink-0 ${
                    activeCanvas === "outline" ? "fill-blue-600" : ""
                  }`}
                /> */}

              {/* Text appears on hover */}
              <span className="ml-2 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
                Rectangle
              </span>
            </Button>
          </div>

          <div className="flex gap-4">
            {
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
                  {/* Icon stays visible */}
                  {/* <AiFillBehanceCircle 
                  className={`h-5 w-5 shrink-0 ${
                    activeCanvas === "mask" ? "fill-blue-600" : ""
                  }`}
                /> */}
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
            }

            <ZoomHeader resetCanvas={handleResetZoom} />
          </div>

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="flex items-center gap-2 py-1"
              >
                <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <span>{zoomLevel}%</span>
                <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                  <ZoomOut className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-20 p-0"
                  onClick={handleResetZoom}
                >
                  {" "}
                  Reset
                </Button>
              </Badge>

              <div className="flex flex-col gap-1">
                <Badge
                  variant="secondary"
                  className="grid items-center gap-0 w-20  pt-1"
                >
                  <span className="text-[10px]">X: {mouseMove.x}</span>
                  <span className="text-[10px]">Y: {mouseMove.y}</span>
                </Badge>
               
              </div>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </>
  );
};

export default HoverHeader;
