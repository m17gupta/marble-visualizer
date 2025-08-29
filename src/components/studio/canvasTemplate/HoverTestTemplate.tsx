
import CompareGenAiHome from "@/components/workSpace/compareGenAiImages/CompareGenAiHome";
import DesignProject from "@/components/workSpace/projectWorkSpace/DesignProject";
import GuidancePanel from "@/components/workSpace/projectWorkSpace/GuidancePanel";
import RequestgenAitemplate from "@/components/workSpace/projectWorkSpace/request_template/RequestgenAitemplate";

import { RootState } from "@/redux/store";
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import PolygonOverlayTest from "@/components/canvas/test/PolyOverlayTest";

type Props = {
  canvas: React.RefObject<any>;
  width: number;
  height: number;
};
const Hovertesttemplate = ({ canvas, width, height }: Props) => {

  const {isCompare} = useSelector((state:RootState) => state.canvas);
   const {requests} = useSelector((state:RootState) => state.genAi);
    
  const handleImageLoad = useCallback(() => {
    // setImageLoading(false);
  }, []);

  return (
    <>
       {!isCompare && canvas.current ? (
        <PolygonOverlayTest
          canvas={canvas}
          width={width}
          height={height}
          className="mb-6"
        />
      ) : (
        <CompareGenAiHome />
      )}


   
     {requests &&
      ( ( requests.paletteUrl && requests.paletteUrl.length > 0 )||
       ( requests.referenceImageUrl && requests.referenceImageUrl.length > 0 )||
       ( requests.prompt && requests.prompt.length > 0 )) ? (
        <RequestgenAitemplate />
      ) : null}
      <DesignProject />
      <GuidancePanel />
    </>
  );
};

export default Hovertesttemplate;
