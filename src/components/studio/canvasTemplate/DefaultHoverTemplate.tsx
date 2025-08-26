import PolygonOverlay from "@/components/canvas/PolygonOverlay";
import HoverHeader from "@/components/designHub/HoverHeader";
import CompareGenAiHome from "@/components/workSpace/compareGenAiImages/CompareGenAiHome";
import DesignProject from "@/components/workSpace/projectWorkSpace/DesignProject";
import GuidancePanel from "@/components/workSpace/projectWorkSpace/GuidancePanel";
import { SelectPalletPopover } from "@/components/workSpace/projectWorkSpace/SelectPalletPopover";
import { RootState } from "@/redux/store";
import React, { useCallback } from "react";
import { Root } from "react-dom/client";
import { useSelector } from "react-redux";

type Props = {
  canvasImage: string|null;
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
   const handleImageLoad = useCallback(() => {
     // setImageLoading(false);
   }, []);
  return (
    <>
      <HoverHeader />
      {!isCompare  ? (
        canvasImage && (
          <PolygonOverlay
            key={`canvas-hover-${canvasImage}`}
            imageUrl={canvasImage}
            width={canvasWidth}
            height={canvasHeight}
            className="mb-6"
            onImageLoad={handleImageLoad}
          />
        )
      ) : (
        <CompareGenAiHome />
      )}
      <SelectPalletPopover/>
        <DesignProject />
        <GuidancePanel />
      
    </>
  );
};

export default DefaultHoverTemplate;
