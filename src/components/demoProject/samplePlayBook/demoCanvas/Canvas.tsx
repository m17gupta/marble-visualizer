import CanavasImage from '@/components/canvas/CanavasImage'
import { RootState } from '@/redux/store'
import React, { useCallback, useEffect, useState } from 'react'
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
  const canavasImageRef = React.useRef<any>(null);
  const newCanvasRef = React.useRef<FabricCanvas | null>(null);
  const { allSegments } = useSelector((state: RootState) => state.segments)
  const { currentJob } = useSelector((state: RootState) => state.jobs)
  const {aiTrainImageWidth,aiTrainImageHeight}= useSelector((state:RootState) => state.canvas)
  const canvasWidth= aiTrainImageWidth??800;
  const canvasHeight= aiTrainImageHeight??600;
    // Use backgroundImage prop if provided, otherwise use currentJob image
  const imageToUse = backgroundImage || currentJob?.full_image || "";
  
  //  useEffect(() => {
  //   newCanvasRef.current?.clear();
  //   console.log('Canvas cleared due to background image change');
  //  },[])
   

const handleCanvasReady = (canvas: FabricCanvas) => {
  console.log('Canvas is ready:', canvas);
  newCanvasRef.current = canvas;
 
};


  return (
    <>
  

   <NewCanvas
      backgroundImage={imageToUse}
      className={ "block h-auto w-full"}
          onCanvasReady={handleCanvasReady}
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