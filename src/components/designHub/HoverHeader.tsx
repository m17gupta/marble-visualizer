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
import Toggleheader from "../canvasheader/Toggleheader";
import DrawHeader from "../canvasheader/DrawHeader";
import { Loader } from "@/pages/projectPage/ProjectsPage";
import { BreadcrumbHeader } from "../canvasheader/BreadcrumbHeader";
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
        <CardContent className="py-2 pt-1.5 px-4 flex items-center">
          {/* <BreadcrumbHeader/> */}
          <DrawHeader />
          <div className="flex-1" />
          <div className="flex gap-4 items-center">
            <Toggleheader />
            <ZoomHeader resetCanvas={handleResetZoom} />
          </div>
        </CardContent>
       
      </Card>
    </>
  );
};

export default HoverHeader;
