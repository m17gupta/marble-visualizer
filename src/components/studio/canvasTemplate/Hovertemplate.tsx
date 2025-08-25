import PolygonOverlay from "@/components/canvas/PolygonOverlay";
import HoverHeader from "@/components/designHub/HoverHeader";
import React, { useCallback } from "react";

type Props={
  canvasImage: string | null;
  canvasWidth: number;
  canvasHeight: number;
}
const Hovertemplate = ({ canvasImage, canvasWidth, canvasHeight }: Props) => {
  const handleImageLoad = useCallback(() => {
    // setImageLoading(false);
  }, []);
  return (
    <>
      <HoverHeader />
     {canvasImage &&
      <PolygonOverlay
        key={`canvas-hover-${canvasImage}`}
        imageUrl={canvasImage}
        width={canvasWidth}
        height={canvasHeight}
        className="mb-6"
        onImageLoad={handleImageLoad}
      />}
    </>
  );
};

export default Hovertemplate;
