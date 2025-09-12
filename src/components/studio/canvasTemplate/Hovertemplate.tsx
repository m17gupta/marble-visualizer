import CanvasEdit from "@/components/canvas/canvasEdit/CanvasEdit";
import LayerCanvas from "@/components/canvas/layerCanvas/LayerCanvas";
import PolygonOverlay from "@/components/canvas/PolygonOverlay";
import CompareHoverHeader from "@/components/designHub/CompareHoverHeader";
import UpdateCanvasAfterDelete from "@/components/designHub/deleteSegModal/UpdateCanvasAfterDelete";
import UpdateSegmentsOnCanvas from "@/components/designHub/editSegment/UpdateSegmentaOnCanvas";
import HoverHeader from "@/components/designHub/HoverHeader";
import CompareGenAiHome from "@/components/workSpace/compareGenAiImages/CompareGenAiHome";
import DesignProject from "@/components/workSpace/projectWorkSpace/DesignProject";
import GuidancePanel from "@/components/workSpace/projectWorkSpace/GuidancePanel";
import RequestgenAitemplate from "@/components/workSpace/projectWorkSpace/request_template/RequestgenAitemplate";

import { RootState } from "@/redux/store";
import React, { useCallback, useRef } from "react";
import { useSelector } from "react-redux";

type Props = {
  canvas: React.RefObject<any>;
  width: number;
  height: number;
};
const Hovertemplate = ({ canvas, width, height  }: Props) => {

  const {isCompare} = useSelector((state:RootState) => state.canvas);
   const {requests} = useSelector((state:RootState) => state.genAi);
  const handleImageLoad = useCallback(() => {
    // setImageLoading(false);
  }, []);

  const sliderRef = useRef<HTMLDivElement>(null);
  return (
    <>
      
      {!isCompare && canvas.current ? (
        <>
        <PolygonOverlay
          canvas={canvas}
          width={width}
          height={height}
          className="mb-6"
        />

        <LayerCanvas
          canvas={canvas}
          width={width}
          height={height}
        />

        <CanvasEdit
           fabricCanvasRef={canvas}
          width={width}
          height={height}
          className="mb-6"
        />

                {/* update segment on canvas */}
        
        <UpdateSegmentsOnCanvas canvasRef={canvas} />

          <UpdateCanvasAfterDelete canvasRef={canvas} />

      {requests &&
      ( ( requests.paletteUrl && requests.paletteUrl.length > 0 )||
       ( requests.referenceImageUrl && requests.referenceImageUrl.length > 0 )||
       ( requests.prompt && requests.prompt.length > 0 )) ? (
        <RequestgenAitemplate />
      ) : null}
      </>
      ) : (
      <>
    
        <CompareGenAiHome  />
        
      </>
      )}
    
      <DesignProject />
      <GuidancePanel />
    </>
  );
};

export default Hovertemplate;
