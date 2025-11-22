import React, { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";

import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import GeneratedMask from "./GeneratedMask";
import { resetCanvas, setCanvasType } from "@/redux/slices/canvasSlice";
import { IoMdArrowRoundBack } from "react-icons/io";
import { CanvasEditor } from "@/components/canvas/newSegmentCanvas/CanvasEditor";

type Props = {
  isCanvasModalOpen: boolean;
  onClose: () => void;
};
const ModelCanvas = ({ isCanvasModalOpen, onClose }: Props) => {
  const { currentImageUrl } = useSelector((state: RootState) => state.studio);

  const [currentCanvasImage, setCurrentCanvasImage] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const closeModal = () => {
    dispatch(setCanvasType("hover"));
    dispatch(resetCanvas());
    onClose();
  };

  useEffect(() => {
    if (currentImageUrl && currentImageUrl !== "") {
      setCurrentCanvasImage(currentImageUrl);
    }
  }, [currentImageUrl]);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  return (
    <>
      {/* Modal Overlay */}
      {isCanvasModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-7xl max-h-[95vh] mx-4 my-4 transform transition-all flex flex-col">


            {/* Modal Body - Two Column Layout */}
            <div className="flex-1 overflow-auto flex">
              {/* Left Section - Instructions */}

              <div className="w-1/4 p-4 border-r border-gray-200 bg-gray-50">
                <div className="flex items-center mb-4 gap-2 border-b border-gray-200 pb-2">
                  <button
                    onClick={closeModal}
                    className="text-black-400 hover:text-gray-600 transition-colors bg-transparent border border-gray-200 rounded-sm px-1 py-1">
                    {/* <X size={24} className='text-black'/> */}
                    <IoMdArrowRoundBack />
                  </button>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Creat custom Mask
                  </h2>
                </div>

                <GeneratedMask />
              </div>

              {/* Right Section - Canvas */}
              <div className="flex-1 p-4 overflow-auto">
                <CanvasEditor
                  key={`canvas-editor-${currentCanvasImage}`}
                  imageUrl={currentCanvasImage}
                  width={800}
                  height={600}
                  className="mb-6"
                  onImageLoad={handleImageLoad}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModelCanvas;
