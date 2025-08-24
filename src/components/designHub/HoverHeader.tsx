import React from "react";

import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setActiveTab, setCanvasType, setIsResetZoom } from "@/redux/slices/canvasSlice";
import { AiOutlineBorderInner } from "react-icons/ai";

import { Separator } from "../ui/separator";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Badge } from "../ui/badge";
import { MdOutlineHideImage, MdOutlineImage } from "react-icons/md";
import { BiGitCompare } from "react-icons/bi";

const HoverHeader = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const [activeButton, setActiveButton] = useState<"view" | "chat">("view");
  const [activeButton, setActiveButton] = React.useState<"view" | "chat">("view");
  const { canvasType } = useSelector((state: any) => state.canvas);
  const activeCanvas = useSelector((state: RootState) => state.canvas.activeCanvas);
  const handleHover = () => {
    dispatch(setCanvasType("hover"));
    setActiveButton("view");
  };

  const handleChat = () => {
    // Handle chat action here
    dispatch(setCanvasType("hover-default"));
    setActiveButton("chat");
  };

  const handleResetZoom = () => {
    dispatch(setIsResetZoom(true));
  };


  // Use Redux for hide/show image state
  const handleShowHideImage = () => {
    // Toggle between 'hideImage' and 'showImage' as activeCanvas
    dispatch({ type: "canvas/setActiveTab", payload: activeCanvas === "hideImage" ? "showImage" : "hideImage" });
  } 

  const handleActiveCanvas = (type:string) => {
    dispatch(setActiveTab(type));
  };

  return (
    <>
      <Card>
        <CardContent className="py-2 px-4 flex items-center justify-between ">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="group relative flex items-center justify-start w-10 hover:w-24 transition-all duration-300 overflow-hidden px-2"
              onClick={() => handleActiveCanvas("outline")}
            >
              {/* Icon stays visible */}
              <AiOutlineBorderInner className={`h-5 w-5 shrink-0 ${activeCanvas === "outline" ? "fill-blue-600" : ""}`} />

              {/* Text appears on hover */}
              <span className="ml-2 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
                Outline
              </span>
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <Button
              variant="outline"
              size="sm"
              className="group relative flex items-center justify-start w-10 hover:w-28 transition-all duration-300 overflow-hidden "
                onClick={() => handleActiveCanvas("compare")}
            >
              {/* <FaCodeCompare className="h-4 w-4" /> */}
              <BiGitCompare className={`h-4 w-4 flex-shrink-0 ${activeCanvas === "compare" ? "fill-blue-600" : ""}`} />
              <span className="ml-2 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
                {" "}
                Compare
              </span>
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <Button
              variant="outline"
              size="sm"
              onClick={handleShowHideImage}
              className={`group relative flex items-center justify-start w-10 hover:w-36 transition-all duration-300 overflow-hidden px-2
                ${activeCanvas === "hideImage" ? "bg-blue-100 text-blue-600 border-blue-400" : ""}`}
            >
              {/* Icon changes dynamically based on Redux */}
              {activeCanvas === "hideImage" ? (
                <MdOutlineHideImage className="h-5 w-5 shrink-0 fill-blue-600" />
              ) : (
                <MdOutlineImage className="h-5 w-5 shrink-0" />
              )}

              {/* Text fades in on hover */}
              <span className="ml-2 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
                {activeCanvas === "hideImage" ? "Hide Segments" : "Show Segments"}
              </span>
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {/* <Button
                  variant={activeButton === "view" ? "default" : "outline"}
                  size="sm"
                  onClick={handleHover}>
                  View
                </Button>
                <Button
                  variant={activeButton === "chat" ? "default" : "outline"}
                  size="sm"
                  onClick={handleChat}>
                  Chat
                </Button> */}
                {canvasType === "hover" && (
                  <Button
                    variant={activeButton === "chat" ? "default" : "outline"}
                    size="sm"
                    onClick={handleResetZoom}
                  >
                    Reset Zoom
                  </Button>
                )}
              </div>

              <Badge variant="secondary" className="flex items-center gap-2">
                <span>Zoom:100%</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                    <ZoomIn className="h-3 w-3" />
                  </Button>

                  <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                    <ZoomOut className="h-3 w-3" />
                  </Button>
                </div>
              </Badge>

              <div className="flex gap-1">
                <Badge
                  variant="secondary"
                  className="grid items-center gap-2 w-20"
                >
                  <span>X: 524</span>
                </Badge>
                <Badge
                  variant="secondary"
                  className="grid items-center gap-2 w-20"
                >
                  <span>Y: 32</span>
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default HoverHeader;
