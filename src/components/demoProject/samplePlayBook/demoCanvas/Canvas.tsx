import CanavasImage from '@/components/canvas/CanavasImage'
import { RootState } from '@/redux/store'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import * as fabric from "fabric";
import { Canvas as FabricCanvas } from "fabric";
import ShowSelectedSegment from './ShowSelectedSegment';
import NewCanvas from './NewCanvas';
import SetPolygon from './SetPolygon';

interface CanvasProps {
  backgroundImage?: string;
  className?: string;
}

const Canvas: React.FC<CanvasProps> = ({ backgroundImage, className }) => {

  const newCanvasRef = React.useRef<FabricCanvas | null>(null);
  const { allSegments } = useSelector((state: RootState) => state.segments)
  const { currentJob } = useSelector((state: RootState) => state.jobs)
  const { aiTrainImageWidth, aiTrainImageHeight } = useSelector((state: RootState) => state.canvas)
  const canvasWidth = useMemo(() => aiTrainImageWidth ? aiTrainImageWidth : 1400, [aiTrainImageWidth]);
  const canvasHeight = useMemo(() => aiTrainImageHeight ? aiTrainImageHeight : 750, [aiTrainImageHeight]);
  // Use backgroundImage prop if provided, otherwise use currentJob image

  const imageToUse = useMemo(() => {
    return backgroundImage || currentJob?.full_image || "";
  }, [backgroundImage, currentJob]);



  const handleCanvasReady = (canvas: FabricCanvas) => {
    console.log('Canvas is ready:', canvas);
    newCanvasRef.current = canvas;

  };
  const [imageLoading, setImageLoading] = useState(false);
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  return (
    <>


      <NewCanvas
        backgroundImage={imageToUse}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        className={"block h-auto w-full"}
        onCanvasReady={handleCanvasReady}
        onImageLoad={handleImageLoad}
      />



      {newCanvasRef &&
        <SetPolygon
          canvas={newCanvasRef}
          width={canvasWidth}
          height={canvasHeight}
        />}
    </>

  )
}

export default Canvas