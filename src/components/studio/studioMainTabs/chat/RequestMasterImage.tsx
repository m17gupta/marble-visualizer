import { AppDispatch, RootState } from "@/redux/store";

import { useDispatch, useSelector } from "react-redux";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TbVectorBezier2 } from "react-icons/tb";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { setCanvasType, setIsCanvasModalOpen } from "@/redux/slices/canvasSlice";
const RequestMasterImage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { requests: genAiRequests } = useSelector(
    (state: RootState) => state.genAi
  );

  const handleCreateMask = () => {
    dispatch(setIsCanvasModalOpen(true));
       dispatch(setCanvasType("mask"));
  };  
  return (
    <>
      {genAiRequests.houseUrl ? (
        <div className="flex-1 group relative max-w-60">
          <LazyLoadImage
          
            src={
              genAiRequests?.houseUrl[0] || "https://via.placeholder.com/150"
            }
            alt="Main"
            className="rounded-lg w-full object-cover border"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="absolute top-1 right-1 p-2 bg-white/90 border border-gray-300 rounded-2 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={handleCreateMask}
              >
                <TbVectorBezier2 className="text-black w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" align="center">
              <p>Marking label</p>
            </TooltipContent>
          </Tooltip>
          {genAiRequests && genAiRequests.prompt && genAiRequests.prompt[0] && (
            <div
              className="inline-block text-gray-600 text-sm px-3 py-1 rounded-full border border-transparent mt-2"
              style={{
                backgroundClip:"padding-box, border-box",
                backgroundImage:
                  "linear-gradient(#fff, #fff), linear-gradient(90deg, #9333ea, #3b82f6)",
                backgroundOrigin: "border-box",
              }}>
              {genAiRequests?.prompt[0]}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No master image requested yet.</p>
        </div>
      )}
    </>
  );
};

export default RequestMasterImage;
