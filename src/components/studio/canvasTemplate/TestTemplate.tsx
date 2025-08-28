// import PolygonOverlay from "@/components/canvas/PolygonOverlay";
// import HoverHeader from "@/components/designHub/HoverHeader";
// import CompareGenAiHome from "@/components/workSpace/compareGenAiImages/CompareGenAiHome";
// import DesignProject from "@/components/workSpace/projectWorkSpace/DesignProject";
// import GuidancePanel from "@/components/workSpace/projectWorkSpace/GuidancePanel";
// import RequestgenAitemplate from "@/components/workSpace/projectWorkSpace/request_template/RequestgenAitemplate";

// import { RootState } from "@/redux/store";
// import React, { useCallback } from "react";
// import { useSelector } from "react-redux";
// import type { Canvas } from "fabric/fabric-impl";

// type Props = {
//   canvas: React.RefObject<Canvas>;
// };
// const Hovertemplate = ({ canvas }: Props) => {

//   const {isCompare} = useSelector((state:RootState) => state.canvas);
//    const {requests} = useSelector((state:RootState) => state.genAi);
//   const handleImageLoad = useCallback(() => {
//     // setImageLoading(false);
//   }, []);
//   return (
//     <>
//        <HoverHeader />
//       {!isCompare  ? (
//         canvas && (
//           <PolygonOverlay
//             canvas={canvas}
//             className="mb-6"
//             width={canvas.current?.width}
//             height={canvas.current?.height}
//           />
//         )
//       ) : (
//         <CompareGenAiHome />
//       )}
//      {requests &&
//       ( ( requests.paletteUrl && requests.paletteUrl.length > 0 )||
//        ( requests.referenceImageUrl && requests.referenceImageUrl.length > 0 )||
//        ( requests.prompt && requests.prompt.length > 0 )) ? (
//         <RequestgenAitemplate />
//       ) : null}
//       <DesignProject />
//       <GuidancePanel />
//     </>
//   );
// };

// export default Hovertemplate;
