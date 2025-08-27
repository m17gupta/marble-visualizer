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
} from "@/redux/slices/canvasSlice";
import { AiOutlineBorderInner } from "react-icons/ai";

import { Separator } from "../ui/separator";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Badge } from "../ui/badge";
import { MdOutlineHideImage, MdOutlineImage } from "react-icons/md";
import { BiGitCompare } from "react-icons/bi";

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
  const { currentZoom ,mousePosition} = useSelector((state: RootState) => state.canvas);

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
    // Toggle between 'hideImage' and 'showImage' as activeCanvas
    // dispatch({ type: "canvas/setActiveTab", payload: activeCanvas === "hideImage" ? "showImage" : "hideImage" });
    if (activeCanvas === "hideSegments") {
      // dispatch(setCanvasType("showSegments"));
      dispatch(setActiveTab("showSegments"));
    } else {
      dispatch(setActiveTab("hideSegments"));
      dispatch(setCanvasType("hover"));
    }
  };

  const handleOutline = (type: CanvasMode) => {
    if (canvasType === "outline") {
      dispatch(setCanvasType("hover"));
      dispatch(setActiveTab("showSegments"));
    } else {
      dispatch(setActiveTab("outline"));
      dispatch(setCanvasType(type));
    }
  };

  return (
    <>
      <Card>
        <CardContent className="py-2 px-4 flex items-center justify-between ">
          {
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="group relative flex items-center justify-start w-10 hover:w-24 transition-all duration-300 overflow-hidden px-2"
                onClick={() => handleOutline("outline")}
              >
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
                }`}
              >
                {/* Icon changes dynamically based on Redux */}
                {activeCanvas === "hideSegments" ? (
                  <MdOutlineHideImage className="h-5 w-5 shrink-0 " />
                ) : (
                  <MdOutlineImage className="h-5 w-5 shrink-0 fill-blue-600" />
                )}

                {/* Text fades in on hover */}
                <span className="ml-2 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
                  {activeCanvas === "showSegments"
                    ? "Hide Segments"
                    : "Show Segments"}
                </span>
              </Button>
            </div>
          }

          <div className="flex items-center justify-between">
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

                <Button variant="ghost" size="icon" className="h-6 w-20 p-0"
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
                {/* <Badge variant="secondary"  className="grid items-center gap-2 w-20 h-4 pt-0">
                  <span className="text-[10px]">Y: 32</span>
                </Badge> */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default HoverHeader;
