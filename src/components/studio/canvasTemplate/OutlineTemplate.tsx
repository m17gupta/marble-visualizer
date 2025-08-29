import OutLineCanvas from '@/components/canvas/outlineCanavas/OutLineCanvas';
//import OutLineCanvasTest from '@/components/canvas/test/OutLineCanvasTest';
import HoverHeader from '@/components/designHub/HoverHeader';
import React, { useCallback } from 'react'
type Props={
  canvasImage: string | null;
  canvasWidth: number;
  canvasHeight: number;
}
// type Props = {
//   canvas: React.RefObject<any>;
//   width: number;
//   height: number;
// };

 const OutlineTemplate = ({ canvasImage, canvasWidth, canvasHeight }: Props) => {
// const OutlineTemplate = ({ canvas, width, height }: Props) => {
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

      {/* {canvas.current && (
        <OutLineCanvasTest
          canvas={canvas}
          width={width}
          height={height}
          className="mb-6"
        />
      )} */}
    </>
  )
}

export default OutlineTemplate