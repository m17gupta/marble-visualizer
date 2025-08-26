import PolygonOverlay from "@/components/canvas/PolygonOverlay";
import CompareGenAiHome from "@/components/workSpace/compareGenAiImages/CompareGenAiHome";
import DesignProject from "@/components/workSpace/projectWorkSpace/DesignProject";
import GuidancePanel from "@/components/workSpace/projectWorkSpace/GuidancePanel";
import { RootState } from "@/redux/store";
import React from "react";
import { Root } from "react-dom/client";
import { useSelector } from "react-redux";

type Props = {
  canvasImage: string;
  canvasWidth: number;
  canvasHeight: number;
};
const DefaultHoverTemplate = ({
  canvasImage,
  canvasWidth,
  canvasHeight,
}: Props) => {

    // const [isCompare, setIsCompare] = React.useState(false);
    const {isCompare} = useSelector((state:RootState) => state.canvas);
  const handleImageLoad = () => {
    // Handle image load event
  };
  return (
    <>
      {!isCompare ? (
        <PolygonOverlay
          key={`canvas-hover-${canvasImage}`}
          imageUrl={canvasImage}
          width={canvasWidth}
          height={canvasHeight}
          className="mb-6"
          onImageLoad={handleImageLoad}
        />
      ) : (
        <CompareGenAiHome />
      )}
      <>
        <DesignProject />
        <GuidancePanel />
      </>
    </>
  );
};

export default DefaultHoverTemplate;
