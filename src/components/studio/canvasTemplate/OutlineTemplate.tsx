import OutLineCanvas from '@/components/canvas/outlineCanavas/OutLineCanvas';
import HoverHeader from '@/components/designHub/HoverHeader';
import React, { useCallback } from 'react'
type Props={
  canvasImage: string | null;
  canvasWidth: number;
  canvasHeight: number;
}
const OutlineTemplate = ({ canvasImage, canvasWidth, canvasHeight }: Props) => {
     const handleImageLoad = useCallback(() => {
        // setImageLoading(false);
      }, []);
  return (
    <>
    <HoverHeader />
     {canvasImage &&
      <OutLineCanvas
        key={`canvas-hover-${canvasImage}`}
        imageUrl={canvasImage}
        width={canvasWidth}
        height={canvasHeight}
        className="mb-6"
        onImageLoad={handleImageLoad}
      />}
    </>
  )
}

export default OutlineTemplate