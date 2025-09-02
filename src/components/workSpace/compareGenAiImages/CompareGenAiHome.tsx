import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CompareSlider from "./CompareSlider";

// import AllGenAiImages from './AllGenAiImages';
import { setIsGenerated } from "@/redux/slices/visualizerSlice/workspaceSlice";
import {
  resetRequest,
  setCurrentGenAiImage,
} from "@/redux/slices/visualizerSlice/genAiSlice";
import { GenAiChat } from "@/models/genAiModel/GenAiModel";
import { setCurrentTabContent } from "@/redux/slices/studioSlice";
import { resetCanvas, updateIsCompare } from "@/redux/slices/canvasSlice";

const CompareGenAiHome: React.FC = () => {
  const dispatch = useDispatch();
  const { genAiImages } = useSelector((state: RootState) => state.genAi);
  const { currentGenAiImage } = useSelector((state: RootState) => state.genAi);
  const [showCompareView, setShowCompareView] = useState(true);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [allGenAiImages, setAllGenAiImages] =
    useState<GenAiChat[]>(genAiImages);

  // update all GenAiImages
  useEffect(() => {
    if (genAiImages.length > 0) {
      // Sort the genAiImages based on created date, latest first
      const sortedImages = [...genAiImages].sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
      );
      setAllGenAiImages(sortedImages);
    }
  }, [genAiImages]);

  useEffect(() => {
    if (allGenAiImages && allGenAiImages.length > 0 && !isAuthenticated) {
      dispatch(setCurrentGenAiImage(allGenAiImages[0]));
    }
  }, [allGenAiImages, isAuthenticated]);

  const handleCloseCompare = () => {
    // setShowCompareView(false);
    dispatch(setCurrentTabContent("home"));
    dispatch(setCurrentGenAiImage(null));
    dispatch(setIsGenerated(false));
    dispatch(resetRequest());
    dispatch(updateIsCompare(false));
  };
  return (
    <div className="flex flex-col  md:h-full w-full p-2 pb-0 md:pb-2 bg-gray-50 px-4">
      {showCompareView &&
        currentGenAiImage &&
        currentGenAiImage.master_image_path &&
        currentGenAiImage.output_image ? (
        <div className="h-[23vh] mb-2 md:mb-6 md:h-[80vh]">
          {currentGenAiImage.master_image_path &&
            currentGenAiImage.output_image &&
            <CompareSlider
              onClose={handleCloseCompare}
            />
          }
        </div>
      ) : (
        <div className="flex items-center justify-center h-[300px] bg-gray-100 mb-6 rounded-lg">
          <div className="text-center">
            <p className="text-xl font-medium mb-2">
              Select a Design to Compare
            </p>
            <p className="text-gray-600">
              Choose one of the generated designs below to see a comparison with
              your original house.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareGenAiHome;
